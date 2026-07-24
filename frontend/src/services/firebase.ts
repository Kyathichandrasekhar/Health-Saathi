// Firebase configuration
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBni7LT3D_pBEpLaN_QfybHMNu1RVbf9Xk",
  authDomain: "health-saathi-ed9a5.firebaseapp.com",
  projectId: "health-saathi-ed9a5",
  storageBucket: "health-saathi-ed9a5.firebasestorage.app",
  messagingSenderId: "527119505840",
  appId: "1:527119505840:web:ed41957befe3e31ab59e75",
  measurementId: "G-G41W7XN5NT"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app

