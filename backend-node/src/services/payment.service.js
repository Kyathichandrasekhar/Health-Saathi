/**
 * Payment service — Razorpay integration (test mode)
 * Ported from Python payment_service.py
 */
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = require('../config/env');

function createRazorpayOrder(amount, appointmentId) {
  // In production, use razorpay SDK:
  // const Razorpay = require('razorpay');
  // const instance = new Razorpay({ key_id, key_secret });
  // const order = await instance.orders.create({ amount: amount*100, currency: 'INR' });

  const orderId = `order_${uuidv4().replace(/-/g, '').slice(0, 16)}`;
  return {
    id: orderId,
    amount: amount * 100, // in paise
    currency: 'INR',
    status: 'created',
    appointment_id: appointmentId,
    key_id: RAZORPAY_KEY_ID,
  };
}

function verifyPayment(orderId, paymentId, signature) {
  if (
    RAZORPAY_KEY_SECRET === 'demo_secret' ||
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
