// ============================================
// Families Page Logic - قراءة الأسر من Firestore
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
let allFamilies = [];

// ====== تحميل البيانات ======
async function loadFamilies() {
  const tbody = document.getElementById("familiesTable");
  try {
    const snap = await getDocs(collection(db, "families"));
    
    if (snap.empty) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty-state">
        <div class="icon">📭</div>
        لا توجد أسر مسجلة بعد
      </td></tr>`;
      return;
    }

    allFamilies = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderFamilies();
    updateStats();
  } catch (error) {
    console.error("❌ خطأ:", error);
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">حدث خطأ في تحميل البيانات</td></tr>`;
  }
}

// ====== عرض الجدول ======
function renderFamilies() {
  const tbody = document.getElementById("familiesTable");
  const q = (document.getElementById("searchInput")?.value || "").trim().toLowerCase();

  let filtered = allFamilies;
  if (q) {
    filtered = allFamilies.filter(f =>
      (f.headName || "").toLowerCase().includes(q) ||
      (f.shelterName || "").toLowerCase().includes(q) ||
      (f.phone || "").includes(q)
    );
  }

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">
      <div class="icon">📭</div>
      لا توجد نتائج مطابقة
    </td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map((f, i) => {
    const count = Number(f.membersCount) || 0;
    return `
      <tr>
        <td>${i + 1}</td>
        <td><b>${f.headName || "—"}</b></td>
        <td><span class="badge badge-nile">${count} أفراد</span></td>
        <td>${f.shelterName || "—"}</td>
        <td>${f.phone || "—"}</td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="alert('قريباً')">👁️</button>
        </td>
      </tr>`;
  }).join("");
}

// ====== الإحصائيات ======
function updateStats() {
  const totalFamilies = allFamilies.length;
  const totalPeople = allFamilies.reduce((a, f) => a + (Number(f.membersCount) || 0), 0);
  const avgSize = totalFamilies ? Math.round(totalPeople / totalFamilies) : 0;

  updateEl("statFamilies", totalFamilies);
  updateEl("statPeople", totalPeople);
  updateEl("statAvg", avgSize);
  updateEl("statSheltersWithFamilies", new Set(allFamilies.map(f => f.shelterName)).size);
}

function updateEl(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// ====== البحث ======
document.getElementById("searchInput")?.addEventListener("input", renderFamilies);

// ====== تشغيل ======
loadFamilies();
