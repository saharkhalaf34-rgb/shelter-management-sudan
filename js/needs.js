// Needs Page
import { db, auth } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

let allNeeds = [];

onAuthStateChanged(auth, (user) => {
  if (user) {
    const n = document.getElementById("userName");
    const a = document.getElementById("avatar");
    if (n) n.textContent = user.email.split("@")[0];
    if (a) a.textContent = user.email.charAt(0).toUpperCase();
  }
});

async function loadNeeds() {
  const tbody = document.getElementById("needsTable");
  try {
    const snap = await getDocs(collection(db, "needs"));
    if (snap.empty) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty-state">لا توجد احتياجات مسجلة بعد</td></tr>`;
      return;
    }
    allNeeds = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderNeeds();
    updateStats();
  } catch (error) {
    console.error("خطأ:", error);
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">حدث خطأ في التحميل</td></tr>`;
  }
}

function renderNeeds() {
  const tbody = document.getElementById("needsTable");
  const q = (document.getElementById("searchInput")?.value || "").trim().toLowerCase();

  let filtered = allNeeds;
  if (q) {
    filtered = allNeeds.filter(x =>
      (x.familyName || "").toLowerCase().includes(q) ||
      (x.type || "").toLowerCase().includes(q) ||
      (x.priority || "").toLowerCase().includes(q)
    );
  }

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">لا توجد نتائج</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map((x, i) => {
    const p = x.priority || "";
    const badge = p === "عالية" ? "badge-red" : p === "متوسطة" ? "badge-gold" : "badge-green";
    return `
      <tr>
        <td>${i + 1}</td>
        <td><b>${x.familyName || "—"}</b></td>
        <td>${x.type || "—"}</td>
        <td><span class="badge ${badge}">${p || "—"}</span></td>
        <td>${x.quantity || 0}</td>
        <td>—</td>
      </tr>
    `;
  }).join("");
}

function updateStats() {
  const total = allNeeds.length;
  const totalQty = allNeeds.reduce((a, x) => a + (Number(x.quantity) || 0), 0);
  const high = allNeeds.filter(x => x.priority === "عالية").length;
  const types = new Set(allNeeds.map(x => x.type)).size;

  const setEl = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  setEl("statTotal", total);
  setEl("statQty", totalQty);
  setEl("statHigh", high);
  setEl("statTypes", types);
}

document.getElementById("searchInput")?.addEventListener("input", renderNeeds);

loadNeeds();
