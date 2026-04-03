/**
 * Queue controller — FIFO queue management
 */
const {
  addToQueue,
  getQueueStatus,
  getPatientPosition,
  advanceQueue,
} = require('../services/queue.service');
const { getAppointmentById, updateAppointment } = require('../services/appointment.store');

async function checkIn(req, res) {
  const { appointmentId } = req.body;
  if (!appointmentId) {
    return res.status(400).json({ error: 'appointmentId is required' });
  }

  const appointment = await getAppointmentById(appointmentId);
  if (!appointment) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  const doctorId = appointment.doctor_id;
  const date = appointment.date;
  const token = Number(appointment.token_number) || 0;
  const position = addToQueue(doctorId, appointmentId, token, date);

  await updateAppointment(appointmentId, { status: 'Checked-In' });
  return res.json({ appointmentId, doctorId, date, position, token, status: 'Checked-In' });
}

async function queueStatus(req, res) {
  const { doctor_id } = req.params;
  const date = String(req.query.date || '').trim();
  const status = getQueueStatus(doctor_id, date);
  res.json(status);
}

async function patientPosition(req, res) {
  const { appointment_id } = req.params;
  const pos = getPatientPosition(appointment_id);
  if (pos) return res.json(pos);
  res.json({ error: 'Not in queue' });
}

async function advance(req, res) {
  const { doctor_id } = req.params;
  const date = String(req.query.date || '').trim();
  const served = advanceQueue(doctor_id, date);
  if (served) {
    return res.json({ served, queue: getQueueStatus(doctor_id, date) });
  }
  res.json({ message: 'Queue is empty' });
}

module.exports = { checkIn, queueStatus, patientPosition, advance };
