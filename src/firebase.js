import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyyN0VdPVrIHR0J1PbvJ3qkHyI-K5_awE",
  authDomain: "doms-portfolio-project.firebaseapp.com",
  projectId: "doms-portfolio-project",
  storageBucket: "doms-portfolio-project.firebasestorage.app",
  messagingSenderId: "593617153100",
  appId: "1:593617153100:web:6b96744a6a79e81543d8e9",
  measurementId: "G-1C4433YRB7"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)
export const db = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)
export const analytics = typeof window !== 'undefined' ? getAnalytics(firebaseApp) : null
