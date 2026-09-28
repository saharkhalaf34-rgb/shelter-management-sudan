// ============================================
// Firebase Configuration & Initialization
// Shelter Sudan - Shelter Management Platform
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// إعدادات Firebase (المشروع الجديد)
const firebaseConfig = {
  apiKey: "AIzaSyAo-mGy7cnhgZ9a-66pxVaon51d2Q5ULR4",
  authDomain: "shelter-management-sudan.firebaseapp.com",
  projectId: "shelter-management-sudan",
  storageBucket: "shelter-management-sudan.firebasestorage.app",
  messagingSenderId: "236546791179",
  appId: "1:236546791179:web:2c653be263e86da1e2740e"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
