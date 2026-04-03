/**
 * Firebase Admin SDK initialization
 */
const admin = require('firebase-admin');
const path = require('path');
const { FIREBASE_SERVICE_ACCOUNT_PATH } = require('./env');

let firebaseApp = null;

function getFirebaseApp() {
  if (firebaseApp) return firebaseApp;

  try {
    if (FIREBASE_SERVICE_ACCOUNT_PATH && require('fs').existsSync(FIREBASE_SERVICE_ACCOUNT_PATH)) {
      const serviceAccount = require(path.resolve(FIREBASE_SERVICE_ACCOUNT_PATH));
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      firebaseApp = admin.initializeApp();
    }
  } catch (err) {
    console.warn('⚠️  Firebase not configured. Running in demo mode.');
    return null;
  }

  return firebaseApp;
}

function getFirestore() {
  const app = getFirebaseApp();
  if (app) return admin.firestore();
  return null;
}

function getAuth() {
  const app = getFirebaseApp();
  if (app) return admin.auth();
  return null;
}

module.exports = { getFirebaseApp, getFirestore, getAuth };
