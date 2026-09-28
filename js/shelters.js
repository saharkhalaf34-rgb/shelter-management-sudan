// ============================================
// Shelters Page Logic - قراءة المراكز من Firestore
// Shelter Sudan - Shelter Management Platform
// ============================================

import { db, auth } from "./firebase.js";
import { 
  collection, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ====== اسم المستخدم ======
onAuthStateChanged(auth, (user) => {
  if (user) {
    const userNameEl = document.getElementById("userName");
    const avatarEl = document.getElementById("avatar");
    if (userNameEl) userNameEl.textContent = user.email.split("@")[0];
    if (avatarEl) avatarEl.textContent = user.email.charAt(0).toUpperCase();
  }
});

// ====== متغير عام ======
let allShelters = [];

// ====== تحميل البيانات من Firestore ======
async function loadShelters() {
  const tbody = document.getElementById("sheltersTable");
  try {
    const snap = await getDocs(collection(db, "shelters"));
    
    if (snap.empty) {
      tbody.innerHTML = `<tr><td colspan="7" class="empty-state">
        <div class="icon">📭</div>
        لا توجد مراكز مسجلة بعد
      </td></tr>`;
      return;
    }

    allShelters = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderShelters();
    updateStats();
  } catch (error) {
    console.error("❌ خطأ في التحميل:", error);
    tbody.innerHTML = `<tr><td colspan="7" class="empty-state">حدث خطأ في تحميل البيانات</td></tr>`;
  }
}

// ====== عرض الجدول ======
function renderShelters() {
  const tbody = document.getElementById("sheltersTable");
  const q = (document.getElementById("searchInput")?.value || "").trim().toLowerCase();

  let filtered = allShelters;
  if (q) {
    filtered = allShelters.filter(s =>
      (s.name || "").toLowerCase().includes(q) ||
      (s.location || "").toLowerCase().includes(q)
    );
  }

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-state">
      <div class="icon">📭</div>
      لا توجد نتائج مطابقة
    </td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map((s, i) => {
    const cap = Number(s.capacity) || 0;
    const occ = Number(s.currentOccupancy) || 0;
    const pct = cap ? Math.min(Math.round((occ / cap) * 100), 100) : 0;
    const cls = pct > 85 ? "full" : pct > 60 ? "warn" : "ok";
    const badge = pct > 85 ? "badge-red" : pct > 60 ? "badge-gold" : "badge-green";
    const status = pct > 85 ? "ممتلئ" : pct > 60 ? "شبه ممتلئ" : "متاح";

    return `
      <tr>
        <td>${i + 1}</td>
        <td><b>${s.name || "—"}</b></td>
        <td>${s.location || "—"}</td>
        <td>${cap}</td>
        <td>${occ}</td>
        <td>
          <div class="capacity-bar">
            <div class="capacity-fill ${cls}" style="width:${pct}%"></div>
          </div>
          <div class="capacity-text">${pct}%</div>
        </td>
        <td><span class="badge ${badge}">${status}</span></td>
      </tr>`;
  }).join("");
}

// ====== الإحصائيات ======
function updateStats() {
  const totalCap = allShelters.reduce((a, s) => a + (Number(s.capacity) || 0), 0);
  const totalOcc = allShelters.reduce((a, s) => a + (Number(s.currentOccupancy) || 0), 0);

  updateEl("totalShelters", allShelters.length);
  updateEl("totalCapacity", totalCap);
  updateEl("totalOccupied", totalOcc);
  updateEl("totalAvailable", Math.max(totalCap - totalOcc, 0));
}

function updateEl(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// ====== البحث ======
document.getElementById("searchInput")?.addEventListener("input", renderShelters);

// ====== تشغيل ======
loadShelters();
