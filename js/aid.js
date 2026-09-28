// Aid Page
import { db, auth } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

let allAid = [];

onAuthStateChanged(auth, (user) => {
  if (user) {
    const n = document.getElementById("userName");
    const a = document.getElementById("avatar");
    if (n) n.textContent = user.email.split("@")[0];
    if (a) a.textContent = user.email.charAt(0).toUpperCase();
  }
});

async function loadAid() {
  const tbody = document.getElementById("aidTable");
  try {
    const snap = await getDocs(collection(db, "aid"));
    if (snap.empty) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty-state">لا توجد مساعدات مسجلة بعد</td></tr>`;
      return;
    }
    allAid = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderAid();
    updateStats();
  } catch (error) {
    console.error("خطأ:", error);
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">حدث خطأ في التحميل</td></tr>`;
  }
}

function renderAid() {
  const tbody = document.getElementById("aidTable");
  const q = (document.getElementById("searchInput")?.value || "").trim().toLowerCase();

  let filtered = allAid;
  if (q) {
    filtered = allAid.filter(a =>
      (a.familyName || "").toLowerCase().includes(q) ||
      (a.type || "").toLowerCase().includes(q)
    );
  }

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">لا توجد نتائج</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map((a, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><b>${a.familyName || "—"}</b></td>
      <td><span class="badge badge-nile">${a.type || "—"}</span></td>
      <td>${a.quantity || 0}</td>
      <td>${a.distributedBy || "—"}</td>
      <td>—</td>
    </tr>
  `).join("");
}

function updateStats() {
  const total = allAid.length;
  const totalQty = allAid.reduce((a, x) => a + (Number(x.quantity) || 0), 0);
  const types = new Set(allAid.map(a => a.type)).size;
  const families = new Set(allAid.map(a => a.familyName)).size;

  const setEl = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  setEl("statTotal", total);
  setEl("statQty", totalQty);
  setEl("statTypes", types);
  setEl("statFamilies", families);
}

document.getElementById("searchInput")?.addEventListener("input", renderAid);

loadAid();
