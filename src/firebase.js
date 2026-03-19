import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDEesliDRYi2TXeD1c242jKOG5tbgb9GjM",
  authDomain: "ecoalert-e95e8.firebaseapp.com",
  projectId: "ecoalert-e95e8",
  storageBucket: "ecoalert-e95e8.firebasestorage.app",
  messagingSenderId: "504413163468",
  appId: "1:504413163468:web:2d3a5263b63459932d1769",
  measurementId: "G-3796K538E0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics (optional)
try {
  getAnalytics(app);
} catch (error) {
  console.log('Analytics not available in this environment');
}

export default app;