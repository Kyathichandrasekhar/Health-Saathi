/**
 * Database configuration (Firestore)
 */
const { getFirestore } = require('./firebase');

function getDB() {
  return getFirestore();
}

module.exports = { getDB };
