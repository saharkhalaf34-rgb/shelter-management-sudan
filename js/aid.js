// Aid Page with CRUD
import { db, auth } from "./firebase.js";
import { 
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

let allAid = [];
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
  const tbody = document.getElementById("aidTable");
  try {
    const [aSnap, fSnap] = await Promise.all([
      getDocs(collection(db, "aid")),
      getDocs(collection(db, "families"))
    ]);

    allAid = aSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    allFamilies = fSnap.docs.map(d => d.data());

    fillFamilyOptions();
    renderAid();
    updateStats();
  } catch (error) {
    console.error("خطأ:", error);
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">حدث خطأ في التحميل</td></tr>`;
  }
}

function fillFamilyOptions() {
  const sel = document.getElementById("aFamily");
  if (!sel) return;
  sel.innerHTML = `<option value="">-- اختر الأسرة --</option>` +
    allFamilies.map(f => `<option value="${f.headName}">${f.headName}</option>`).join("");
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
      <td>
        <button class="btn btn-outline btn-sm" onclick="editAid('${a.id}')">✏️</button>
        <button class="btn btn-danger btn-sm" onclick="deleteAid('${a.id}', '${a.familyName}')">🗑️</button>
      </td>
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

window.openModal = function() {
  editingId = null;
  document.getElementById("modalTitle").textContent = "➕ إضافة مساعدة";
  document.getElementById("aidForm").reset();
  document.getElementById("modalOverlay").classList.add("active");
};

window.closeModal = function() {
  document.getElementById("modalOverlay").classList.remove("active");
};

window.editAid = function(id) {
  const a = allAid.find(x => x.id === id);
  if (!a) return;
  editingId = id;
  document.getElementById("modalTitle").textContent = "✏️ تعديل مساعدة";
  document.getElementById("aFamily").value = a.familyName || "";
  document.getElementById("aType").value = a.type || "";
  document.getElementById("aQuantity").value = a.quantity || "";
  document.getElementById("aBy").value = a.distributedBy || "";
  document.getElementById("modalOverlay").classList.add("active");
};

window.saveAid = async function(e) {
  e.preventDefault();
  const data = {
    familyName: document.getElementById("aFamily").value,
    type: document.getElementById("aType").value.trim(),
    quantity: Number(document.getElementById("aQuantity").value) || 0,
    distributedBy: document.getElementById("aBy").value.trim() || "admin"
  };

  if (!data.familyName || !data.type) {
    alert("الرجاء إدخال اسم الأسرة ونوع المساعدة");
    return;
  }

  try {
    if (editingId) {
      await updateDoc(doc(db, "aid", editingId), data);
      alert("✅ تم التعديل");
    } else {
      await addDoc(collection(db, "aid"), data);
      alert("✅ تمت الإضافة");
    }
    closeModal();
    loadAll();
  } catch (error) {
    console.error("خطأ:", error);
    alert("❌ حدث خطأ: " + error.message);
  }
};

window.deleteAid = async function(id, name) {
  if (!confirm(`حذف مساعدة "${name}"؟`)) return;
  try {
    await deleteDoc(doc(db, "aid", id));
    alert("✅ تم الحذف");
    loadAll();
  } catch (error) {
    console.error("خطأ:", error);
    alert("❌ فشل الحذف");
  }
};

document.getElementById("searchInput")?.addEventListener("input", renderAid);

loadAll();
