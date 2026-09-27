// ============================================
// Login Logic - Firebase Authentication
// ============================================

import { auth } from './firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const errorDiv = document.getElementById('loginError');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      
      errorDiv.textContent = '';
      
      try {
        await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem('shelterLoggedIn', '1');
        window.location.href = 'dashboard.html';
      } catch (error) {
        console.error('Login error:', error.code);
        
        let message = 'Incorrect email or password.';
        if (error.code === 'auth/user-not-found') message = 'No account found with this email.';
        else if (error.code === 'auth/wrong-password') message = 'Incorrect password.';
        else if (error.code === 'auth/invalid-email') message = 'Invalid email address.';
        else if (error.code === 'auth/too-many-requests') message = 'Too many attempts. Try again later.';
        else if (error.code === 'auth/invalid-credential') message = 'Incorrect email or password.';
        
        errorDiv.textContent = message;
      }
    });
  }
});
