/**
 * Environment configuration
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FIREBASE_SERVICE_ACCOUNT_PATH: process.env.FIREBASE_SERVICE_ACCOUNT_PATH || '',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'demo_secret',
  FASTAPI_URL: process.env.FASTAPI_URL || 'http://localhost:8001',
};
