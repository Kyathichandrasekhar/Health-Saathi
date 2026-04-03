/**
 * Booking controller — appointment CRUD
 */
const { v4: uuidv4 } = require('uuid');
const { getDoctorById, getSlotsForDoctor } = require('../data/hospital.data');
const {
  saveAppointment,
  getAppointmentById,
  listAppointmentsByUser,
  listAppointmentsForDoctorDate,
} = require('../services/appointment.store');

function firstNonEmpty(...values) {
  for (const value of values) {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed) {
        return trimmed;
      }
      continue;
    }

    if (value !== undefined && value !== null) {
      return value;
    }
  }

  return undefined;
}

async function getAvailableSlots(req, res) {
  try {
    const { doctorId, date } = req.query;
    console.log('booking.getAvailableSlots.request', { doctorId, date });

    const doctor = getDoctorById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const appointments = await listAppointmentsForDoctorDate(doctorId, date);
    const booked = new Set(appointments.map((appointment) => appointment.slot));

    const schedule = getSlotsForDoctor(doctorId);
    const available = schedule.filter((slot) => !booked.has(slot));
    return res.json({ slots: available, doctor_id: doctorId, date, slot_timings: doctor.slot_timings });
  } catch (error) {
    console.error('booking.getAvailableSlots.error', error);
    return res.status(500).json({ error: 'Failed to fetch available slots' });
  }
}

async function createBooking(req, res) {
  try {
    const {
      hospitalId,
      doctorId,
      slot,
      date,
      hospitalName,
      doctorName,
      specialization,
      fee,
      slotTimings,
      patientName,
      patientEmail,
      patientPhone,
    } = req.body || {};
    console.log('booking.create.request', {
      hospitalId,
      doctorId,
      date,
      slot,
    });
  const existingDoctor = getDoctorById(doctorId);
  const doctor = existingDoctor || {
    id: doctorId,
    name: doctorName || 'Doctor',
    specialization: specialization || 'General Medicine',
    specialty: specialization || 'General Medicine',
    fee: Number(fee) || 500,
    slot_timings: slotTimings || '',
  };

  const schedule = getSlotsForDoctor(doctorId);
  if (schedule.length > 0 && !schedule.includes(slot)) {
    return res.status(400).json({ error: 'Selected slot is not in doctor schedule' });
  }

  const resolvedDoctorName = String(doctorName || doctor.name || '').trim();
  const resolvedHospitalName = String(hospitalName || hospitalId || '').trim();
  const resolvedDate = String(date || '').trim();
  const resolvedSlot = String(slot || '').trim();
  const resolvedUserId = String(req.user?.uid || 'demo_user').trim() || 'demo_user';

  if (!doctorId || !hospitalId || !resolvedDoctorName || !resolvedHospitalName || !resolvedDate || !resolvedSlot) {
    return res.status(400).json({ error: 'Missing required booking data' });
  }

  const aptId = `apt_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
  const existingForDoctorDate = await listAppointmentsForDoctorDate(doctorId, date);
  const maxToken = existingForDoctorDate.reduce((max, appointment) => {
    const value = Number(appointment.token_number) || 0;
    return Math.max(max, value);
  }, 0);
  const token = maxToken + 1;
  const createdAt = new Date().toISOString();

  const appointment = {
    id: aptId,
    bookingId: aptId,
    user_id: resolvedUserId,
    userId: resolvedUserId,
    patient_name: patientName || req.user?.name || 'Patient',
    patient_email: patientEmail || req.user?.email || 'demo@example.com',
    patient_phone: patientPhone || req.user?.phone_number || '',
    hospital_id: hospitalId,
    hospital_name: resolvedHospitalName,
    hospitalName: resolvedHospitalName,
    doctor_id: doctorId,
    doctor_name: resolvedDoctorName,
    doctorName: resolvedDoctorName,
    specialization: specialization || doctor.specialization || doctor.specialty,
    date: resolvedDate,
    slot: resolvedSlot,
    token_number: token,
    tokenNumber: token,
    status: 'Booked',
    payment_status: 'pending',
    paymentStatus: 'pending',
    paid_amount: 0,
    fee: Number(fee) || doctor.fee,
    booking_timestamp: createdAt,
    created_at: createdAt,
    createdAt,
  };

    await saveAppointment(appointment);
    return res.json(appointment);
  } catch (error) {
    console.error('booking.create.error', error);
    return res.status(500).json({ error: 'Failed to create booking' });
  }
}

async function getUserBookings(req, res) {
  try {
    const uid = req.user?.uid || 'demo_user';
    console.log('booking.getUserBookings.request', { uid });
    const bookings = await listAppointmentsByUser(uid);
    return res.json(bookings);
  } catch (error) {
    console.error('booking.getUserBookings.error', error);
    return res.status(500).json({ error: 'Failed to fetch user bookings' });
  }
}

async function getBookingById(req, res) {
  try {
    const { appointment_id } = req.params;
    console.log('booking.getById.request', { appointment_id });
    const appointment = await getAppointmentById(appointment_id);
    if (appointment) {
      return res.json(appointment);
    }
    return res.status(404).json({ error: 'Appointment not found' });
  } catch (error) {
    console.error('booking.getById.error', error);
    return res.status(500).json({ error: 'Failed to fetch booking' });
  }
}

async function getTicketReceipt(req, res) {
  try {
    const { appointment_id } = req.params;
    console.log('booking.getTicketReceipt.request', { appointment_id });
    const appointment = await getAppointmentById(appointment_id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

  const receipt = {
    appointment_id: firstNonEmpty(appointment.id, appointment.bookingId),
    patient_name: firstNonEmpty(appointment.patient_name, appointment.patientName, 'Patient'),
    patient_email: firstNonEmpty(appointment.patient_email, appointment.patientEmail, 'N/A'),
    patient_phone: firstNonEmpty(appointment.patient_phone, appointment.patientPhone, ''),
    user_id: firstNonEmpty(appointment.user_id, appointment.userId, 'demo_user'),
    doctor_name: firstNonEmpty(appointment.doctor_name, appointment.doctorName, 'Unknown Doctor'),
    specialization: firstNonEmpty(appointment.specialization, 'General Medicine'),
    hospital_name: firstNonEmpty(appointment.hospital_name, appointment.hospitalName, 'Unknown Hospital'),
    date: firstNonEmpty(appointment.date, 'N/A'),
    slot: firstNonEmpty(appointment.slot, 'N/A'),
    payment_status: firstNonEmpty(appointment.payment_status, appointment.paymentStatus, 'pending'),
    paid_amount: appointment.paid_amount || 0,
    booking_timestamp: firstNonEmpty(appointment.booking_timestamp, appointment.created_at, appointment.createdAt, new Date().toISOString()),
    token_number: Number(firstNonEmpty(appointment.token_number, appointment.tokenNumber, 1)) || 1,
    status: firstNonEmpty(appointment.status, 'Booked'),
  };

    return res.json(receipt);
  } catch (error) {
    console.error('booking.getTicketReceipt.error', error);
    return res.status(500).json({ error: 'Failed to fetch receipt' });
  }
}

module.exports = { getAvailableSlots, createBooking, getUserBookings, getBookingById, getTicketReceipt };
