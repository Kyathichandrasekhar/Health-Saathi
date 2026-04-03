/**
 * Appointment storage with optional Firestore persistence.
 */
const admin = require('firebase-admin');
const { getFirestore } = require('../config/firebase');

const memoryStore = new Map();

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

function normalizeAppointment(appointment = {}) {
  const generatedBookingId = `apt_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
  const bookingId = firstNonEmpty(appointment.bookingId, appointment.id, generatedBookingId);
  const doctorName = firstNonEmpty(appointment.doctorName, appointment.doctor_name, 'Unknown Doctor');
  const hospitalName = firstNonEmpty(appointment.hospitalName, appointment.hospital_name, 'Unknown Hospital');
  const userId = firstNonEmpty(appointment.userId, appointment.user_id, 'demo_user');
  const paymentStatus = firstNonEmpty(appointment.paymentStatus, appointment.payment_status, 'pending');
  const slot = firstNonEmpty(appointment.slot, 'N/A');
  const date = firstNonEmpty(appointment.date, 'N/A');
  const tokenNumber = Number(firstNonEmpty(appointment.tokenNumber, appointment.token_number, 1)) || 1;
  const createdAtIso = firstNonEmpty(appointment.createdAt, appointment.created_at, new Date().toISOString());

  return {
    ...appointment,
    id: String(bookingId),
    bookingId: String(bookingId),
    doctorName: String(doctorName),
    hospitalName: String(hospitalName),
    userId: String(userId),
    paymentStatus: String(paymentStatus),
    slot: String(slot),
    date: String(date),
    tokenNumber,
    doctor_name: String(doctorName),
    hospital_name: String(hospitalName),
    user_id: String(userId),
    payment_status: String(paymentStatus),
    token_number: tokenNumber,
    created_at: String(createdAtIso),
    createdAt: String(createdAtIso),
  };
}

async function saveAppointment(appointment) {
  const normalized = normalizeAppointment(appointment);
  memoryStore.set(normalized.id, normalized);

  const db = getFirestore();
  if (db) {
    try {
      const docRef = db.collection('appointments').doc(normalized.id);
      const existing = await docRef.get();

      const firestorePayload = {
        ...normalized,
      };

      if (!existing.exists) {
        firestorePayload.createdAt = admin.firestore.FieldValue.serverTimestamp();
      } else {
        delete firestorePayload.createdAt;
      }

      await docRef.set(firestorePayload, { merge: true });
    } catch {
      // Keep app functional in demo mode.
    }
  }

  return normalized;
}

async function getAppointmentById(appointmentId) {
  if (memoryStore.has(appointmentId)) {
    return memoryStore.get(appointmentId);
  }

  const db = getFirestore();
  if (db) {
    try {
      const doc = await db.collection('appointments').doc(appointmentId).get();
      if (doc.exists) {
        const data = doc.data();
        memoryStore.set(appointmentId, data);
        return data;
      }
    } catch {
      return null;
    }
  }

  return null;
}

async function updateAppointment(appointmentId, updates) {
  const current = (await getAppointmentById(appointmentId)) || null;
  if (!current) {
    return null;
  }

  const next = { ...current, ...updates };
  await saveAppointment(next);
  return next;
}

async function listAppointments() {
  const fromMemory = Array.from(memoryStore.values());
  if (fromMemory.length > 0) {
    return fromMemory;
  }

  const db = getFirestore();
  if (db) {
    try {
      const snapshot = await db.collection('appointments').get();
      const all = snapshot.docs.map((doc) => doc.data());
      all.forEach((appointment) => {
        if (appointment?.id) {
          memoryStore.set(appointment.id, appointment);
        }
      });
      return all;
    } catch {
      return [];
    }
  }

  return [];
}

async function listAppointmentsByUser(userId) {
  const all = await listAppointments();
  return all.filter((appointment) => appointment.user_id === userId);
}

async function listAppointmentsForDoctorDate(doctorId, date) {
  const all = await listAppointments();
  return all.filter((appointment) => appointment.doctor_id === doctorId && appointment.date === date);
}

module.exports = {
  saveAppointment,
  getAppointmentById,
  updateAppointment,
  listAppointments,
  listAppointmentsByUser,
  listAppointmentsForDoctorDate,
};
