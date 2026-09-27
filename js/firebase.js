// ============================================
// Firebase Configuration & Initialization
// Shelter Sudan - Shelter Management Platform
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyARinGbOxZoStjSNgcXexh8M7kFJANyrCE",
  authDomain: "shelter-sudan.firebaseapp.com",
  projectId: "shelter-sudan",
  storageBucket: "shelter-sudan.firebasestorage.app",
  messagingSenderId: "562648901857",
  appId: "1:562648901857:web:e26c4ba6d71550f896afa0",
  measurementId: "G-MMF8S8B4TB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
