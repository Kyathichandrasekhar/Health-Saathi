/**
 * QR code controller
 */
const { generateQRBase64, decodeQRData, validateAppointmentQR } = require('../utils/qr.utils');
const { getAppointmentById } = require('../services/appointment.store');

async function generateQR(req, res) {
  const {
    appointmentId = '',
    doctorName = '',
    date = '',
    slot = '',
    token = 0,
    ticketUrl,
  } = req.body;
  const cleanAppointmentId = String(appointmentId || '').trim();
  const data =
    (typeof ticketUrl === 'string' && ticketUrl.trim()) ||
    (cleanAppointmentId ? `/ticket/${cleanAppointmentId}` : {
      appointmentId: cleanAppointmentId,
      doctor: String(doctorName || '').trim(),
      date: String(date || '').trim(),
      slot: String(slot || '').trim(),
      token: Number(token) || 0,
    });
  const qrImage = await generateQRBase64(data);
  res.json({ qr_image: qrImage, data });
}

async function validateQR(req, res) {
  const { qrData } = req.body;
  const decoded = decodeQRData(qrData);
  if (!decoded) {
    return res.json({ valid: false, error: 'Invalid QR data' });
  }
  const result = validateAppointmentQR(decoded);
  if (!result.valid) {
    return res.json(result);
  }

  const appointment = await getAppointmentById(decoded.appointmentId);
  if (!appointment) {
    // Fallback for local/demo QR payloads where appointment may not exist in backend store.
    if (decoded.patientName || decoded.doctorName || decoded.date || decoded.slot) {
      return res.json({
        valid: true,
        data: {
          appointmentId: decoded.appointmentId,
          patientName: decoded.patientName || 'Patient',
          doctorName: decoded.doctorName || 'Doctor',
          hospitalName: decoded.hospitalName || 'Hospital',
          date: decoded.date || '-',
          slot: decoded.slot || '-',
          token: Number(decoded.token) || 0,
          paymentStatus: decoded.paymentStatus || 'paid',
          status: decoded.status || 'Booked',
          doctorId: decoded.doctorId || '',
          source: 'embedded',
        },
      });
    }

    return res.json({ valid: false, error: 'Appointment not found' });
  }

  return res.json({
    valid: true,
    data: {
      appointmentId: appointment.id,
      patientName: appointment.patient_name,
      doctorName: appointment.doctor_name,
      hospitalName: appointment.hospital_name,
      date: appointment.date,
      slot: appointment.slot,
      token: appointment.token_number,
      paymentStatus: appointment.payment_status,
      status: appointment.status,
      doctorId: appointment.doctor_id || '',
      source: 'backend',
    },
  });
}

module.exports = { generateQR, validateQR };
