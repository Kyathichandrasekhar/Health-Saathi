/**
 * Payment routes
 */
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const { createOrder, verify } = require('../controllers/payment.controller');

router.post('/create-order', authMiddleware, createOrder);
router.post('/verify', authMiddleware, verify);

module.exports = router;
