// ============================================
// Authentication Logic
// Shelter Sudan - Shelter Management Platform
// ============================================

import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // مسح رسالة الخطأ القديمة
    if (errorMsg) errorMsg.textContent = "";

    try {
      // تسجيل الدخول عبر Firebase
      await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ تم تسجيل الدخول بنجاح");
      window.location.href = "dashboard.html";
    } catch (error) {
      console.error("❌ خطأ:", error.code, error.message);

      // رسائل خطأ بالعربي
      let message = "حدث خطأ غير متوقع";
      switch (error.code) {
        case "auth/invalid-email":
          message = "البريد الإلكتروني غير صالح";
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          message = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
          break;
        case "auth/too-many-requests":
          message = "محاولات كثيرة خاطئة، حاول لاحقاً";
          break;
        case "auth/network-request-failed":
          message = "تأكد من اتصالك بالإنترنت";
          break;
      }

      if (errorMsg) {
        errorMsg.textContent = message;
        errorMsg.style.color = "#e74c3c";
        errorMsg.style.marginTop = "10px";
      } else {
        alert(message);
      }
    }
  });
}
