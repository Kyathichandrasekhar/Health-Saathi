/**
 * Payment controller — Razorpay integration
 */
const { createRazorpayOrder, verifyPayment } = require('../services/payment.service');
const { updateAppointment, getAppointmentById } = require('../services/appointment.store');
const { FRONTEND_URL } = require('../config/env');

async function createOrder(req, res) {
  try {
    const {
      appointmentId,
      amount,
      doctorId,
      hospitalId,
      appointmentDate,
      slot,
      userId,
    } = req.body;
    const numericAmount = Number(amount);

    if (!appointmentId || !String(appointmentId).trim()) {
      return res.status(400).json({ error: 'appointmentId is required' });
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: 'amount must be a positive number' });
    }

    const existing = await getAppointmentById(appointmentId);
    if (!existing) {
      console.warn('payment.createOrder.appointmentMissing', { appointmentId, userId });
    }

    const order = await createRazorpayOrder(numericAmount, appointmentId, {
      doctorId,
      hospitalId,
      appointmentDate,
      slot,
      userId,
    });
    console.log('payment.createOrder', {
      appointmentId,
      amount: numericAmount,
      orderId: order.id,
      doctorId,
      hospitalId,
      slot,
    });

    return res.json(order);
  } catch (error) {
    console.error('payment.createOrder.error', error);
    return res.status(500).json({ error: 'Failed to create payment order' });
  }
}

async function verify(req, res) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      appointmentId,
      amount,
    } = req.body || {};

    console.log('payment.verify.request', {
      appointmentId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });

    if (!appointmentId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ verified: false, error: 'Missing required payment verification fields' });
    }

    const isValid = verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (isValid) {
      const existing = await getAppointmentById(appointmentId);
      if (existing) {
        await updateAppointment(appointmentId, {
          status: 'Confirmed',
          payment_status: 'paid',
          paymentStatus: 'paid',
          paid_amount: amount || existing.fee || 0,
          payment_order_id: razorpay_order_id,
          payment_id: razorpay_payment_id,
          paid_at: new Date().toISOString(),
        });
      }

      return res.json({ verified: true, appointmentId, status: 'confirmed' });
    }

    console.error('payment.verify.failed', {
      appointmentId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
    return res.status(400).json({ verified: false, error: 'Payment verification failed' });
  } catch (error) {
    console.error('payment.verify.error', error);
    return res.status(500).json({ verified: false, error: 'Failed to verify payment' });
  }
}

async function callback(req, res) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      appointmentId,
    } = req.body || {};

    console.log('payment.callback.request', { appointmentId, razorpay_order_id, razorpay_payment_id });

    const isValid = verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    const safeBase = String(FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
    const encodedId = encodeURIComponent(String(appointmentId || ''));

    if (!isValid) {
      return res.redirect(`${safeBase}/payment?status=failed&appointmentId=${encodedId}`);
    }

    return res.redirect(`${safeBase}/ticket/${encodedId}`);
  } catch (error) {
    console.error('payment.callback.error', error);
    return res.status(500).json({ error: 'Failed to process payment callback' });
  }
}

module.exports = { createOrder, verify, callback };
