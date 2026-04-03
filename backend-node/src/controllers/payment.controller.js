/**
 * Payment controller — Razorpay integration
 */
const { createRazorpayOrder, verifyPayment } = require('../services/payment.service');
const { updateAppointment, getAppointmentById } = require('../services/appointment.store');

async function createOrder(req, res) {
  const { appointmentId, amount } = req.body;
  const order = createRazorpayOrder(amount, appointmentId);
  res.json(order);
}

async function verify(req, res) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    appointmentId,
    amount,
  } = req.body;
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
  res.json({ verified: false, error: 'Payment verification failed' });
}

module.exports = { createOrder, verify };
