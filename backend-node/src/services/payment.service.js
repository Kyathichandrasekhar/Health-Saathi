/**
 * Payment service — Razorpay integration (test mode)
 * Ported from Python payment_service.py
 */
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const Razorpay = require('razorpay');
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = require('../config/env');

function isDemoMode() {
  const keyId = String(RAZORPAY_KEY_ID || '').trim();
  const keySecret = String(RAZORPAY_KEY_SECRET || '').trim();

  if (!keyId || !keySecret) {
    return true;
  }

  return (
    keyId === 'rzp_test_demo' ||
    keySecret === 'demo_secret' ||
    keyId.includes('your_key') ||
    keySecret.includes('your_razorpay_secret')
  );
}

function createDemoOrder(numericAmount, appointmentId) {
  const safeKeyId =
    !RAZORPAY_KEY_ID || String(RAZORPAY_KEY_ID).includes('your_key')
      ? 'rzp_test_demo'
      : RAZORPAY_KEY_ID;

  const orderId = `order_${uuidv4().replace(/-/g, '').slice(0, 16)}`;
  return {
    id: orderId,
    amount: Math.round(numericAmount * 100), // in paise
    currency: 'INR',
    status: 'created',
    appointment_id: String(appointmentId),
    receipt: `appt_${String(appointmentId).slice(0, 24)}_${Date.now()}`,
    key_id: safeKeyId,
    mode: 'demo',
  };
}

async function createRazorpayOrder(amount, appointmentId, metadata = {}) {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error('Invalid amount for order creation');
  }

  if (!appointmentId || String(appointmentId).trim().length === 0) {
    throw new Error('appointmentId is required for order creation');
  }

  if (isDemoMode()) {
    return createDemoOrder(numericAmount, appointmentId);
  }

  const client = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });

  const receipt = `appt_${String(appointmentId).slice(0, 24)}_${Date.now()}`;
  const order = await client.orders.create({
    amount: Math.round(numericAmount * 100),
    currency: 'INR',
    receipt,
    notes: {
      appointmentId: String(appointmentId),
      doctorId: String(metadata.doctorId || ''),
      hospitalId: String(metadata.hospitalId || ''),
      slot: String(metadata.slot || ''),
      appointmentDate: String(metadata.appointmentDate || ''),
    },
  });

  return {
    ...order,
    key_id: RAZORPAY_KEY_ID,
    mode: 'live',
  };
}

function verifyPayment(orderId, paymentId, signature) {
  if (!orderId || !paymentId || !signature) {
    return false;
  }

  if (
    isDemoMode() ||
    String(orderId || '').startsWith('demo_order_') ||
    String(signature || '').startsWith('demo_')
  ) {
    return true; // Demo mode always passes
  }

  const message = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(message)
    .digest('hex');

  if (expected.length !== String(signature || '').length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

module.exports = { createRazorpayOrder, verifyPayment };
