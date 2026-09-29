// ============================================
// Auth Guard + Role Management
// ============================================

import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ====== متغير عام لدور المستخدم ======
window.userRole = "viewer";
window.userName = "زائر";
window.userEmail = "";

// ====== التحقق من المستخدم ======
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    console.log("❌ غير مسجل دخول");
    window.location.href = "index.html";
    return;
  }

  console.log("✅ مسجل دخول:", user.email);
  window.userEmail = user.email;

  // ====== جلب الدور من Firestore ======
  try {
    const userDoc = await getDoc(doc(db, "users", user.email));
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      window.userRole = data.role || "viewer";
      window.userName = data.name || user.email.split("@")[0];
      
      console.log("🎭 الدور:", window.userRole, "| الاسم:", window.userName);
    } else {
      console.warn("⚠️ المستخدم مش موجود في users، سيتم اعتباره viewer");
      window.userRole = "viewer";
      window.userName = user.email.split("@")[0];
    }
  } catch (error) {
    console.error("خطأ في جلب الدور:", error);
    window.userRole = "viewer";
  }

  // ====== تحديث الواجهة ======
  updateUIForRole();
});

// ====== تحديث الواجهة حسب الدور ======
function updateUIForRole() {
  // اسم المستخدم والأفاتار
  const userNameEl = document.getElementById("userName");
  const avatarEl = document.getElementById("avatar");
  if (userNameEl) userNameEl.textContent = window.userName;
  if (avatarEl) avatarEl.textContent = window.userName.charAt(0);

  // إضافة شارة الدور في الهيدر
  const userInfo = document.querySelector(".user-info");
  if (userInfo && !document.getElementById("roleBadge")) {
    const roleBadge = document.createElement("span");
    roleBadge.id = "roleBadge";
    roleBadge.style.cssText = `
      display: inline-block;
      padding: 2px 10px;
      border-radius: 50px;
      font-size: 11px;
      font-weight: 700;
      margin-right: 8px;
    `;
    
    if (window.userRole === "admin") {
      roleBadge.textContent = "مدير النظام";
      roleBadge.style.background = "rgba(210,16,52,0.15)";
      roleBadge.style.color = "#D21034";
    } else if (window.userRole === "manager") {
      roleBadge.textContent = "مشرف";
      roleBadge.style.background = "rgba(201,162,39,0.2)";
      roleBadge.style.color = "#8a6d10";
    } else {
      roleBadge.textContent = "زائر";
      roleBadge.style.background = "rgba(27,79,114,0.12)";
      roleBadge.style.color = "#1B4F72";
    }
    
    const nameDiv = userInfo.querySelector(".name");
    if (nameDiv) {
      nameDiv.parentNode.insertBefore(roleBadge, nameDiv.nextSibling);
    }
  }

  // إخفاء أزرار الإضافة لو المستخدم viewer
  if (window.userRole === "viewer") {
    document.querySelectorAll(".btn-primary, .btn-danger").forEach(btn => {
      if (btn.textContent.includes("إضافة") || btn.textContent.includes("🗑️")) {
        btn.style.display = "none";
      }
    });
  }

  // إخفاء أزرار الحذف لو المستخدم manager
  if (window.userRole === "manager") {
    document.querySelectorAll(".btn-danger").forEach(btn => {
      if (btn.textContent.includes("🗑️")) {
        btn.style.display = "none";
      }
    });
  }
}

// ====== تسجيل الخروج ======
window.logout = async function() {
  if (!confirm("هل تريد تسجيل الخروج؟")) return;
  try {
    await signOut(auth);
    window.location.href = "index.html";
  } catch (error) {
    console.error("خطأ في تسجيل الخروج:", error);
  }
};

// ====== فتح/إغلاق القائمة ======
window.toggleMenu = function() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.toggle("open");
};

// ====== إغلاق القائمة عند الضغط على رابط ======
document.addEventListener("click", (e) => {
  if (e.target.closest(".sidebar-nav a")) {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.remove("open");
  }
});

// ====== دوال مساعدة للصلاحيات ======
window.canAdd = function() {
  return window.userRole === "admin" || window.userRole === "manager";
};

window.canEdit = function() {
  return window.userRole === "admin" || window.userRole === "manager";
};

window.canDelete = function() {
  return window.userRole === "admin";
};
