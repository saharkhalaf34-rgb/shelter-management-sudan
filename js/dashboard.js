// ============================================
// Dashboard Logic - قراءة البيانات من Firestore
// Shelter Sudan - Shelter Management Platform
// ============================================

import { db, auth } from "./firebase.js";
import { 
  collection, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ====== عرض اسم المستخدم ======
onAuthStateChanged(auth, (user) => {
  if (user) {
    const userNameEl = document.getElementById("userName");
    const avatarEl = document.getElementById("avatar");
    if (userNameEl) userNameEl.textContent = user.email.split("@")[0];
    if (avatarEl) avatarEl.textContent = user.email.charAt(0).toUpperCase();
  }
});

// ====== الإحصائيات ======
async function loadStats() {
  try {
    const familiesSnap = await getDocs(collection(db, "families"));
    const sheltersSnap = await getDocs(collection(db, "shelters"));
    const aidSnap      = await getDocs(collection(db, "aid"));

    const familiesCount = familiesSnap.size;
    const sheltersCount = sheltersSnap.size;
    const aidCount      = aidSnap.size;

    let totalPeople = 0;
    familiesSnap.forEach(doc => {
      totalPeople += Number(doc.data().membersCount) || 0;
    });

    updateElement("statFamilies", familiesCount);
    updateElement("statShelters", sheltersCount);
    updateElement("statPeople", totalPeople);
    updateElement("statAid", aidCount);

    // رسم الإشغال
    renderOccupancyChart(sheltersSnap);
    // رسم المساعدات
    renderAidChart(aidSnap);
    // أحدث الأسر
    renderRecentFamilies(familiesSnap);

    console.log("✅ تم تحميل البيانات");
  } catch (error) {
    console.error("❌ خطأ:", error);
  }
}

// ====== رسم الإشغال ======
function renderOccupancyChart(snapshot) {
  const box = document.getElementById("occupancyChart");
  if (!box || snapshot.empty) return;

  let html = "";
  snapshot.forEach(doc => {
    const s = doc.data();
    const capacity = Number(s.capacity) || 0;
    const occupied = Number(s.currentOccupancy) || 0;
    const pct = capacity ? Math.min(Math.round((occupied / capacity) * 100), 100) : 0;
    const color = pct > 85 ? "red" : pct > 60 ? "gold" : "";
    html += `
      <div class="bar-row">
        <div class="bar-label">${s.name || "—"}</div>
        <div class="bar-track">
          <div class="bar-fill ${color}" style="width:${pct}%">${pct}%</div>
        </div>
      </div>`;
  });
  box.innerHTML = html;
}

// ====== رسم المساعدات ======
function renderAidChart(snapshot) {
  const box = document.getElementById("aidChart");
  if (!box || snapshot.empty) return;

  const counter = {};
  snapshot.forEach(doc => {
    const type = doc.data().type || "أخرى";
    counter[type] = (counter[type] || 0) + 1;
  });

  const entries = Object.entries(counter).sort((a,b) => b[1] - a[1]);
  const max = entries[0]?.[1] || 1;

  box.innerHTML = entries.map(([type, count]) => {
    const pct = Math.round((count / max) * 100);
    return `
      <div class="bar-row">
        <div class="bar-label">${type}</div>
        <div class="bar-track">
          <div class="bar-fill nile" style="width:${pct}%">${count}</div>
        </div>
      </div>`;
  }).join("");
}

// ====== أحدث الأسر ======
function renderRecentFamilies(snapshot) {
  const tbody = document.getElementById("recentFamiliesTable");
  if (!tbody) return;

  if (snapshot.empty) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-state">لا توجد أسر مسجلة بعد</td></tr>`;
    return;
  }

  const docs = snapshot.docs.slice(0, 5);
  let index = docs.length;
  tbody.innerHTML = docs.map(doc => {
    const f = doc.data();
    return `
      <tr>
        <td>${index--}</td>
        <td><b>${f.headName || "—"}</b></td>
        <td>${f.membersCount || 0} أفراد</td>
        <td>${f.shelterName || "—"}</td>
        <td>${f.phone || "—"}</td>
      </tr>
    `;
  }).join("");
}

// ====== دالة مساعدة ======
function updateElement(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// ====== تشغيل ======
loadStats();
