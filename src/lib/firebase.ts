import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBAlHgaVlUPdxcX-ng-hkxxabX-xkE5rk4",
  authDomain: "bean-59d45.firebaseapp.com",
  databaseURL: "https://bean-59d45-default-rtdb.firebaseio.com",
  projectId: "bean-59d45",
  storageBucket: "bean-59d45.firebasestorage.app",
  messagingSenderId: "847646078306",
  appId: "1:847646078306:web:c741faa44d145c040d683b",
  measurementId: "G-H585LFQH4B"
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Log current domain for debugging auth/unauthorized-domain errors
if (typeof window !== 'undefined') {
  console.log('🌐 Current domain:', window.location.hostname);
  console.log('📋 Full URL:', window.location.href);
  console.log('✅ Firebase initialized for project:', firebaseConfig.projectId);
}

export const auth = getAuth(app);
export const db = getDatabase(app);

// Safe initialization of Analytics
let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then(yes => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics not supported
  });
}
export { analytics };
