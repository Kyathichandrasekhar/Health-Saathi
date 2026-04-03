/**
 * General helper utilities
 */
const { v4: uuidv4 } = require('uuid');

function generateId(prefix = '') {
  return `${prefix}${uuidv4().replace(/-/g, '').slice(0, 12)}`;
}

function getCurrentTimestamp() {
  return new Date().toISOString();
}

module.exports = { generateId, getCurrentTimestamp };
