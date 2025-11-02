import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBu62yW41syM7Cgm8ax33fu9HW5iLYio2E",
  authDomain: "web99-b3a16.firebaseapp.com",
  projectId: "web99-b3a16",
  storageBucket: "web99-b3a16.firebasestorage.app",
  messagingSenderId: "474605097459",
  appId: "1:474605097459:web:1cb9af9593e20ab337c286",
  measurementId: "G-6V2N6ZSSHY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser environment)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { analytics };
export default app;

