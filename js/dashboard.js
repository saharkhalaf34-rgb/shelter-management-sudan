// ============================================
// Dashboard Logic - قراءة البيانات من Firestore
// Shelter Sudan - Shelter Management Platform
// ============================================

import { db } from "./firebase.js";
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ===== تحميل الإحصائيات =====
async function loadStats() {
  try {
    // عدد الأسر
    const familiesSnap = await getDocs(collection(db, "families"));
    const familiesCount = familiesSnap.size;

    // عدد المراكز
    const sheltersSnap = await getDocs(collection(db, "shelters"));
    const sheltersCount = sheltersSnap.size;

    // إجمالي النازحين (مجموع membersCount)
    let totalPeople = 0;
    familiesSnap.forEach(doc => {
      totalPeople += doc.data().membersCount || 0;
    });

    // إجمالي السعة
    let totalCapacity = 0;
    sheltersSnap.forEach(doc => {
      totalCapacity += doc.data().capacity || 0;
    });

    // إجمالي المساعدات
    const aidSnap = await getDocs(collection(db, "aid"));
    const aidCount = aidSnap.size;

    // تحديث الصفحة
    updateElement("statFamilies", familiesCount);
    updateElement("statShelters", sheltersCount);
    updateElement("statPeople", totalPeople);
    updateElement("statCapacity", totalCapacity);
    updateElement("statAid", aidCount);

    console.log("📊 الإحصائيات:", {
      familiesCount, sheltersCount, totalPeople, totalCapacity, aidCount
    });
  } catch (error) {
    console.error("❌ خطأ في تحميل الإحصائيات:", error);
  }
}

// ===== تحميل أحدث الأسر =====
async function loadRecentFamilies() {
  try {
    const q = query(
      collection(db, "families"),
      limit(5)
    );
    const snapshot = await getDocs(q);

    const tbody = document.getElementById("recentFamiliesBody");
    if (!tbody) {
      console.warn("⚠️ عنصر recentFamiliesBody غير موجود");
      return;
    }

    if (snapshot.empty) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">لا توجد بيانات</td></tr>`;
      return;
    }

    let index = 1;
    tbody.innerHTML = snapshot.docs.map(doc => {
      const f = doc.data();
      return `
        <tr>
          <td>${index++}</td>
          <td><b>${f.headName || "-"}</b></td>
          <td>${f.membersCount || 0} أفراد</td>
          <td>${f.shelterName || "-"}</td>
          <td>${f.phone || "-"}</td>
        </tr>
      `;
    }).join("");
  } catch (error) {
    console.error("❌ خطأ في تحميل الأسر:", error);
  }
}

// ===== دالة مساعدة =====
function updateElement(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// ===== تشغيل عند التحميل =====
loadStats();
loadRecentFamilies();
