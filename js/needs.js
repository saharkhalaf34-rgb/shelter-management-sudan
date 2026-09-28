// Needs Page with CRUD
import { db, auth } from "./firebase.js";
import { 
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

let allNeeds = [];
let allFamilies = [];
let editingId = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    const n = document.getElementById("userName");
    const a = document.getElementById("avatar");
    if (n) n.textContent = user.email.split("@")[0];
    if (a) a.textContent = user.email.charAt(0).toUpperCase();
  }
});

async function loadAll() {
  const tbody = document.getElementById("needsTable");
  try {
    const [nSnap, fSnap] = await Promise.all([
      getDocs(collection(db, "needs")),
      getDocs(collection(db, "families"))
    ]);

    allNeeds = nSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    allFamilies = fSnap.docs.map(d => d.data());

    fillFamilyOptions();
    renderNeeds();
    updateStats();
  } catch (error) {
    console.error("خطأ:", error);
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">حدث خطأ في التحميل</td></tr>`;
  }
}

function fillFamilyOptions() {
  const sel = document.getElementById("nFamily");
  if (!sel) return;
  sel.innerHTML = `<option value="">-- اختر الأسرة --</option>` +
    allFamilies.map(f => `<option value="${f.headName}">${f.headName}</option>`).join("");
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
        <td>
          <button class="btn btn-outline btn-sm" onclick="editNeed('${x.id}')">✏️</button>
          <button class="btn btn-danger btn-sm" onclick="deleteNeed('${x.id}', '${x.familyName}')">🗑️</button>
        </td>
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

window.openModal = function() {
  editingId = null;
  document.getElementById("modalTitle").textContent = "➕ إضافة احتياج";
  document.getElementById("needForm").reset();
  document.getElementById("modalOverlay").classList.add("active");
};

window.closeModal = function() {
  document.getElementById("modalOverlay").classList.remove("active");
};

window.editNeed = function(id) {
  const x = allNeeds.find(y => y.id === id);
  if (!x) return;
  editingId = id;
  document.getElementById("modalTitle").textContent = "✏️ تعديل احتياج";
  document.getElementById("nFamily").value = x.familyName || "";
  document.getElementById("nType").value = x.type || "";
  document.getElementById("nPriority").value = x.priority || "";
  document.getElementById("nQuantity").value = x.quantity || "";
  document.getElementById("modalOverlay").classList.add("active");
};

window.saveNeed = async function(e) {
  e.preventDefault();
  const data = {
    familyName: document.getElementById("nFamily").value,
    type: document.getElementById("nType").value.trim(),
    priority: document.getElementById("nPriority").value,
    quantity: Number(document.getElementById("nQuantity").value) || 0
  };

  if (!data.familyName || !data.type || !data.priority) {
    alert("الرجاء إدخال جميع الحقول المطلوبة");
    return;
  }

  try {
    if (editingId) {
      await updateDoc(doc(db, "needs", editingId), data);
      alert("✅ تم التعديل");
    } else {
      await addDoc(collection(db, "needs"), data);
      alert("✅ تمت الإضافة");
    }
    closeModal();
    loadAll();
  } catch (error) {
    console.error("خطأ:", error);
    alert("❌ حدث خطأ: " + error.message);
  }
};

window.deleteNeed = async function(id, name) {
  if (!confirm(`حذف احتياج "${name}"؟`)) return;
  try {
    await deleteDoc(doc(db, "needs", id));
    alert("✅ تم الحذف");
    loadAll();
  } catch (error) {
    console.error("خطأ:", error);
    alert("❌ فشل الحذف");
  }
};

document.getElementById("searchInput")?.addEventListener("input", renderNeeds);

loadAll();
