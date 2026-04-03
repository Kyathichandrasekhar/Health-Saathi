/**
 * Booking routes
 */
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const {
  getAvailableSlots,
  createBooking,
  getUserBookings,
  getBookingById,
  getTicketReceipt,
} = require('../controllers/booking.controller');

router.get('/slots', getAvailableSlots);
router.post('/create', authMiddleware, createBooking);
router.get('/my-bookings', authMiddleware, getUserBookings);
router.get('/receipt/:appointment_id', getTicketReceipt);
router.get('/:appointment_id', getBookingById);

module.exports = router;
