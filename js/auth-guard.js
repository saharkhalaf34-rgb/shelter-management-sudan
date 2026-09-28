// ============================================
// Auth Guard - حماية الصفحات + أدوات مساعدة
// Shelter Sudan - Shelter Management Platform
// ============================================

import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ====== حماية الصفحات ======
onAuthStateChanged(auth, (user) => {
  if (!user) {
    console.log("❌ غير مسجل دخول، توجيه لصفحة الدخول");
    window.location.href = "index.html";
  } else {
    console.log("✅ مسجل دخول:", user.email);
    
    // عرض اسم المستخدم في الصفحة
    const userEmailEl = document.getElementById("userEmail");
    if (userEmailEl) userEmailEl.textContent = user.email;
    
    // عرض اسم المستخدم في الهيدر
    const userNameEl = document.getElementById("userName");
    const avatarEl = document.getElementById("avatar");
    if (userNameEl) userNameEl.textContent = user.email.split("@")[0];
    if (avatarEl) avatarEl.textContent = user.email.charAt(0).toUpperCase();
  }
});

// ====== تسجيل الخروج ======
window.logout = async function() {
  if (!confirm("هل تريد تسجيل الخروج؟")) return;
  try {
    await signOut(auth);
    console.log("✅ تم تسجيل الخروج");
    window.location.href = "index.html";
  } catch (error) {
    console.error("❌ خطأ في تسجيل الخروج:", error);
    alert("حدث خطأ في تسجيل الخروج");
  }
};

// ====== فتح/إغلاق القائمة الجانبية (للموبايل) ======
window.toggleMenu = function() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.classList.toggle("open");
    console.log("📂 القائمة:", sidebar.classList.contains("open") ? "مفتوحة" : "مغلقة");
  }
};

// ====== إغلاق القائمة عند الضغط على رابط ======
document.addEventListener("click", (e) => {
  const link = e.target.closest(".sidebar-nav a");
  if (link) {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.remove("open");
  }
});
