// ============================================
// Auth Guard - حماية الصفحات الداخلية
// Shelter Sudan - Shelter Management Platform
// ============================================

import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// التحقق من حالة تسجيل الدخول
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // لو مش مسجل دخول → رجّعه لصفحة تسجيل الدخول
    console.log("❌ غير مسجل دخول، توجيه لصفحة الدخول");
    window.location.href = "index.html";
  } else {
    console.log("✅ مسجل دخول:", user.email);
    
    // عرض اسم المستخدم في الصفحة (لو فيه عنصر بالـ id="userEmail")
    const userEmailEl = document.getElementById("userEmail");
    if (userEmailEl) {
      userEmailEl.textContent = user.email;
    }
  }
});

// دالة تسجيل الخروج
window.logout = async function() {
  try {
    await signOut(auth);
    console.log("✅ تم تسجيل الخروج");
    window.location.href = "index.html";
  } catch (error) {
    console.error("❌ خطأ في تسجيل الخروج:", error);
    alert("حدث خطأ في تسجيل الخروج");
  }
};
