/**
 * Admin controller — ticket validation and check-in workflow
 */
const { decodeQRData } = require('../utils/qr.utils');
const { getAppointmentById, updateAppointment } = require('../services/appointment.store');
const { addToQueue, getQueueStatus } = require('../services/queue.service');

function isDateInPast(dateValue) {
  if (!dateValue) {
    return false;
  }

  const selected = new Date(`${dateValue}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected < today;
}

function normalizeTicketId(rawTicket, rawQrData) {
  const raw = String(rawTicket || rawQrData || '').trim();
  if (!raw) {
    return '';
  }

  const decoded = decodeQRData(raw);
  if (decoded?.appointmentId) {
    return String(decoded.appointmentId).trim();
  }

  return raw;
}

async function validateTicket(req, res) {
  try {
    console.log('admin.validateTicket.incoming', req.body);

    const ticketId = normalizeTicketId(req.body?.ticketId, req.body?.qrData);
    if (!ticketId) {
      return res.status(400).json({ status: 'invalid', message: 'ticketId is required' });
    }

    console.log('admin.validateTicket.request', { ticketId });

    const appointment = await getAppointmentById(ticketId);
    if (!appointment) {
      return res.json({ status: 'invalid', message: 'Ticket not found' });
    }

    if (isDateInPast(appointment.date)) {
      return res.json({
        status: 'invalid',
        message: 'Appointment date has expired',
        appointmentId: appointment.id,
      });
    }

    const statusText = String(appointment.status || '').toLowerCase();
    const alreadyCheckedIn = statusText === 'checked-in' || statusText === 'checked in';

    return res.json({
      status: alreadyCheckedIn ? 'already_checked_in' : 'valid',
      appointmentId: appointment.id,
      patientName: appointment.patient_name || appointment.patientName || 'Patient',
      doctorName: appointment.doctor_name || appointment.doctorName || 'Doctor',
      hospitalName: appointment.hospital_name || appointment.hospitalName || 'Hospital',
      slot: appointment.slot || '-',
      date: appointment.date || '-',
      token: Number(appointment.token_number) || 0,
      paymentStatus: appointment.payment_status || appointment.paymentStatus || 'pending',
      checkedIn: alreadyCheckedIn,
      doctorId: appointment.doctor_id || '',
    });
  } catch (error) {
    console.error('Validation route error:', error);
    return res.status(500).json({ status: 'invalid', message: 'Validation route failed', error: error.message });
  }
}

async function checkInTicket(req, res) {
  try {
    console.log('admin.checkIn.incoming', req.body);

    const ticketId = normalizeTicketId(req.body?.ticketId, req.body?.qrData);
    if (!ticketId) {
      return res.status(400).json({ status: 'invalid', message: 'ticketId is required' });
    }

    console.log('admin.checkIn.request', { ticketId });

    const appointment = await getAppointmentById(ticketId);
    if (!appointment) {
      return res.status(404).json({ status: 'invalid', message: 'Ticket not found' });
    }

    const doctorId = appointment.doctor_id;
    const date = appointment.date;
    const token = Number(appointment.token_number) || 0;
    const currentStatus = String(appointment.status || '').toLowerCase();
    const alreadyCheckedIn = currentStatus === 'checked-in' || currentStatus === 'checked in';

    let position = 0;
    if (doctorId) {
      position = addToQueue(doctorId, appointment.id, token, date);
    }

    if (!alreadyCheckedIn) {
      await updateAppointment(appointment.id, { status: 'Checked-In' });
    }

    const queueStats = doctorId ? getQueueStatus(doctorId, date) : { total_in_queue: 0 };

    return res.json({
      status: alreadyCheckedIn ? 'already_checked_in' : 'checked_in',
      appointmentId: appointment.id,
      patientName: appointment.patient_name || appointment.patientName || 'Patient',
      doctorName: appointment.doctor_name || appointment.doctorName || 'Doctor',
      hospitalName: appointment.hospital_name || appointment.hospitalName || 'Hospital',
      date: appointment.date || '-',
      slot: appointment.slot || '-',
      token,
      paymentStatus: appointment.payment_status || appointment.paymentStatus || 'pending',
      checkedIn: true,
      doctorId: doctorId || '',
      queuePosition: position,
      queueTotal: Number(queueStats.total_in_queue) || 0,
    });
  } catch (error) {
    console.error('Check-in route error:', error);
    return res.status(500).json({ status: 'invalid', message: 'Check-in route failed', error: error.message });
  }
}

module.exports = { validateTicket, checkInTicket };
