/**
 * Admin ticket validation + check-in routes
 */
const express = require('express');
const router = express.Router();
const { adminMiddleware } = require('../middlewares/auth.middleware');
const { validateTicket, checkInTicket } = require('../controllers/admin.controller');

router.post('/validate-ticket', adminMiddleware, validateTicket);
router.post('/checkin', adminMiddleware, checkInTicket);

module.exports = router;
