// Families Page with CRUD + Role-Based Permissions
import { db } from "./firebase.js";
import { 
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let allFamilies = [];
let allShelters = [];
let editingId = null;

// ====== تحميل البيانات ======
async function loadAll() {
  const tbody = document.getElementById("familiesTable");
  try {
    const [fSnap, sSnap] = await Promise.all([
      getDocs(collection(db, "families")),
      getDocs(collection(db, "shelters"))
    ]);

    allFamilies = fSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    allShelters = sSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    fillShelterOptions();
    renderFamilies();
    updateStats();
  } catch (error) {
    console.error("خطأ:", error);
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">حدث خطأ في التحميل</td></tr>`;
  }
}

// ====== تعبئة قائمة المراكز ======
function fillShelterOptions() {
  const sel = document.getElementById("fShelter");
  if (!sel) return;
  sel.innerHTML = `<option value="">-- اختر المركز --</option>` +
    allShelters.map(s => `<option value="${s.name}">${s.name}</option>`).join("");
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
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">لا توجد نتائج</td></tr>`;
    return;
  }

  const canEdit = window.canEdit ? window.canEdit() : false;
  const canDelete = window.canDelete ? window.canDelete() : false;

  tbody.innerHTML = filtered.map((f, i) => {
    let actions = "";
    if (canEdit) {
      actions += `<button class="btn btn-outline btn-sm" onclick="editFamily('${f.id}')">✏️</button> `;
    }
    if (canDelete) {
      actions += `<button class="btn btn-danger btn-sm" onclick="deleteFamily('${f.id}', '${f.headName}')">🗑️</button>`;
    }
    if (!actions) {
      actions = `<span style="color:#999; font-size:12px;">👁️ عرض فقط</span>`;
    }

    return `
      <tr>
        <td>${i + 1}</td>
        <td><b>${f.headName || "—"}</b></td>
        <td>${f.membersCount || 0} أفراد</td>
        <td>${f.shelterName || "—"}</td>
        <td>${f.phone || "—"}</td>
        <td>${actions}</td>
      </tr>
    `;
  }).join("");
}

// ====== الإحصائيات ======
function updateStats() {
  const total = allFamilies.length;
  const people = allFamilies.reduce((a, f) => a + (Number(f.membersCount) || 0), 0);
  const avg = total ? Math.round(people / total) : 0;
  const shelters = new Set(allFamilies.map(f => f.shelterName)).size;

  const setEl = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  setEl("statFamilies", total);
  setEl("statPeople", people);
  setEl("statAvg", avg);
  setEl("statSheltersWithFamilies", shelters);
}

// ====== نافذة الإضافة/التعديل ======
window.openModal = function() {
  if (window.canAdd && !window.canAdd()) {
    alert("⚠️ ليس لديك صلاحية الإضافة");
    return;
  }
  editingId = null;
  document.getElementById("modalTitle").textContent = "➕ إضافة أسرة جديدة";
  document.getElementById("familyForm").reset();
  document.getElementById("modalOverlay").classList.add("active");
};

window.closeModal = function() {
  document.getElementById("modalOverlay").classList.remove("active");
};

window.editFamily = function(id) {
  if (window.canEdit && !window.canEdit()) {
    alert("⚠️ ليس لديك صلاحية التعديل");
    return;
  }
  const f = allFamilies.find(x => x.id === id);
  if (!f) return;
  editingId = id;
  document.getElementById("modalTitle").textContent = "✏️ تعديل أسرة";
  document.getElementById("fHead").value = f.headName || "";
  document.getElementById("fMembers").value = f.membersCount || "";
  document.getElementById("fShelter").value = f.shelterName || "";
  document.getElementById("fPhone").value = f.phone || "";
  document.getElementById("modalOverlay").classList.add("active");
};

// ====== حفظ ======
window.saveFamily = async function(e) {
  e.preventDefault();

  if (editingId && window.canEdit && !window.canEdit()) {
    alert("⚠️ ليس لديك صلاحية التعديل");
    return;
  }
  if (!editingId && window.canAdd && !window.canAdd()) {
    alert("⚠️ ليس لديك صلاحية الإضافة");
    return;
  }

  const data = {
    headName: document.getElementById("fHead").value.trim(),
    membersCount: Number(document.getElementById("fMembers").value) || 0,
    shelterName: document.getElementById("fShelter").value,
    phone: document.getElementById("fPhone").value.trim()
  };

  if (!data.headName || !data.shelterName) {
    alert("الرجاء إدخال اسم رب الأسرة واختيار المركز");
    return;
  }

  try {
    if (editingId) {
      await updateDoc(doc(db, "families", editingId), data);
      alert("✅ تم التعديل بنجاح");
    } else {
      await addDoc(collection(db, "families"), data);
      alert("✅ تمت الإضافة بنجاح");
    }
    closeModal();
    loadAll();
  } catch (error) {
    console.error("خطأ:", error);
    alert("❌ حدث خطأ: " + error.message);
  }
};

// ====== حذف ======
window.deleteFamily = async function(id, name) {
  if (window.canDelete && !window.canDelete()) {
    alert("⚠️ ليس لديك صلاحية الحذف");
    return;
  }
  if (!confirm(`هل تريد حذف أسرة "${name}"؟`)) return;
  try {
    await deleteDoc(doc(db, "families", id));
    alert("✅ تم الحذف");
    loadAll();
  } catch (error) {
    console.error("خطأ:", error);
    alert("❌ حدث خطأ في الحذف");
  }
};

document.getElementById("searchInput")?.addEventListener("input", renderFamilies);

// ====== إعادة الرسم عند تغيّر الدور ======
window.addEventListener("roleReady", () => {
  renderFamilies();
});

// ====== تشغيل ======
loadAll();
