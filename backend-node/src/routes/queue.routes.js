/**
 * Queue management routes
 */
const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');
const { checkIn, queueStatus, patientPosition, advance } = require('../controllers/queue.controller');

router.post('/check-in', authMiddleware, checkIn);
router.get('/status/:doctor_id', queueStatus);
router.get('/position/:appointment_id', patientPosition);
router.post('/advance/:doctor_id', adminMiddleware, advance);

module.exports = router;
