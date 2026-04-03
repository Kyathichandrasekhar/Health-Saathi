/**
 * FastAPI service — Axios calls to the Python AI backend
 */
const axios = require('axios');
const { FASTAPI_URL } = require('../config/env');

async function forwardToFastAPI(endpoint, data) {
  const url = `${FASTAPI_URL}${endpoint}`;
  const res = await axios.post(url, data, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
  });
  return res.data;
}

async function getFastAPIHealth() {
  try {
    const res = await axios.get(`${FASTAPI_URL}/api/health`, { timeout: 5000 });
    return res.data;
  } catch {
    return { status: 'unavailable' };
  }
}

module.exports = { forwardToFastAPI, getFastAPIHealth };
