// ============================================
// Login Logic - Firebase Authentication
// Shelter Sudan - Shelter Management Platform
// ============================================

import { auth } from './firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const errorDiv = document.getElementById('errorMsg');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;
      
      errorDiv.textContent = '';
      
      // Convert username to email (Firebase requires email)
      // If user types "admin", convert to "admin@shelter.com"
      // If user types full email, use as is
      const email = username.includes('@') ? username : username + '@shelter.com';
      
      try {
        await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem('shelterLoggedIn', '1');
        window.location.href = 'dashboard.html';
      } catch (error) {
        console.error('Login error:', error.code);
        
        let message = 'اسم المستخدم أو كلمة المرور غير صحيحة';
        if (error.code === 'auth/user-not-found') message = 'لا يوجد حساب بهذا الاسم';
        else if (error.code === 'auth/wrong-password') message = 'كلمة المرور غير صحيحة';
        else if (error.code === 'auth/invalid-email') message = 'اسم المستخدم غير صالح';
        else if (error.code === 'auth/too-many-requests') message = 'محاولات كثيرة. جربي لاحقاً';
        else if (error.code === 'auth/invalid-credential') message = 'اسم المستخدم أو كلمة المرور غير صحيحة';
        
        errorDiv.textContent = message;
      }
    });
  }
});
