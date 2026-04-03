/**
 * Payment routes
 */
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const { createOrder, verify, callback } = require('../controllers/payment.controller');

router.post('/create-order', authMiddleware, createOrder);
router.post('/verify', authMiddleware, verify);
router.post('/callback', callback);

module.exports = router;
