// Shelters Page with CRUD + Role-Based Permissions
import { db, auth } from "./firebase.js";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let allShelters = [];
let editingId = null;

// ====== تحميل المراكز ======
async function loadShelters() {
  const tbody = document.getElementById("sheltersTable");
  try {
    const snap = await getDocs(collection(db, "shelters"));
    if (snap.empty) {
      tbody.innerHTML = `<tr><td colspan="8" class="empty-state">لا توجد مراكز. اضغط "إضافة مركز" للبدء</td></tr>`;
      updateStats();
      return;
    }
    allShelters = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderShelters();
    updateStats();
  } catch (error) {
    console.error("خطأ:", error);
    tbody.innerHTML = `<tr><td colspan="8" class="empty-state">حدث خطأ في التحميل</td></tr>`;
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
    tbody.innerHTML = `<tr><td colspan="8" class="empty-state">لا توجد نتائج</td></tr>`;
    return;
  }

  const canEdit = window.canEdit ? window.canEdit() : false;
  const canDelete = window.canDelete ? window.canDelete() : false;

  tbody.innerHTML = filtered.map((s, i) => {
    const cap = Number(s.capacity) || 0;
    const occ = Number(s.currentOccupancy) || 0;
    const pct = cap ? Math.min(Math.round((occ / cap) * 100), 100) : 0;
    const cls = pct > 85 ? "full" : pct > 60 ? "warn" : "ok";
    const badge = pct > 85 ? "badge-red" : pct > 60 ? "badge-gold" : "badge-green";
    const status = pct > 85 ? "ممتلئ" : pct > 60 ? "شبه ممتلئ" : "متاح";

    // أزرار الإجراءات حسب الصلاحيات
    let actions = "";
    if (canEdit) {
      actions += `<button class="btn btn-outline btn-sm" onclick="editShelter('${s.id}')">✏️</button> `;
    }
    if (canDelete) {
      actions += `<button class="btn btn-danger btn-sm" onclick="deleteShelter('${s.id}', '${s.name}')">🗑️</button>`;
    }
    if (!actions) {
      actions = `<span style="color:#999; font-size:12px;">👁️ عرض فقط</span>`;
    }

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
        <td>${actions}</td>
      </tr>`;
  }).join("");
}

// ====== الإحصائيات ======
function updateStats() {
  const totalCap = allShelters.reduce((a, s) => a + (Number(s.capacity) || 0), 0);
  const totalOcc = allShelters.reduce((a, s) => a + (Number(s.currentOccupancy) || 0), 0);

  setEl("totalShelters", allShelters.length);
  setEl("totalCapacity", totalCap);
  setEl("totalOccupied", totalOcc);
  setEl("totalAvailable", Math.max(totalCap - totalOcc, 0));
}

function setEl(id, v) {
  const e = document.getElementById(id);
  if (e) e.textContent = v;
}

// ====== نافذة الإضافة/التعديل ======
window.openModal = function() {
  if (window.canAdd && !window.canAdd()) {
    alert("⚠️ ليس لديك صلاحية الإضافة");
    return;
  }
  editingId = null;
  document.getElementById("modalTitle").textContent = "➕ إضافة مركز جديد";
  document.getElementById("shelterForm").reset();
  document.getElementById("modalOverlay").classList.add("active");
};

window.closeModal = function() {
  document.getElementById("modalOverlay").classList.remove("active");
};

window.editShelter = function(id) {
  if (window.canEdit && !window.canEdit()) {
    alert("⚠️ ليس لديك صلاحية التعديل");
    return;
  }
  const s = allShelters.find(x => x.id === id);
  if (!s) return;
  editingId = id;
  document.getElementById("modalTitle").textContent = "✏️ تعديل مركز";
  document.getElementById("sName").value = s.name || "";
  document.getElementById("sLocation").value = s.location || "";
  document.getElementById("sCapacity").value = s.capacity || "";
  document.getElementById("sOccupancy").value = s.currentOccupancy || "";
  document.getElementById("modalOverlay").classList.add("active");
};

// ====== حفظ (إضافة أو تعديل) ======
window.saveShelter = async function(e) {
  e.preventDefault();

  // فحص الصلاحيات
  if (editingId && window.canEdit && !window.canEdit()) {
    alert("⚠️ ليس لديك صلاحية التعديل");
    return;
  }
  if (!editingId && window.canAdd && !window.canAdd()) {
    alert("⚠️ ليس لديك صلاحية الإضافة");
    return;
  }

  const data = {
    name: document.getElementById("sName").value.trim(),
    location: document.getElementById("sLocation").value.trim(),
    capacity: Number(document.getElementById("sCapacity").value) || 0,
    currentOccupancy: Number(document.getElementById("sOccupancy").value) || 0,
    status: "active"
  };

  if (!data.name || !data.location) {
    alert("الرجاء إدخال اسم المركز والموقع");
    return;
  }

  try {
    if (editingId) {
      await updateDoc(doc(db, "shelters", editingId), data);
      alert("✅ تم التعديل بنجاح");
    } else {
      await addDoc(collection(db, "shelters"), data);
      alert("✅ تمت الإضافة بنجاح");
    }
    closeModal();
    loadShelters();
  } catch (error) {
    console.error("خطأ:", error);
    alert("❌ حدث خطأ: " + error.message);
  }
};

// ====== حذف ======
window.deleteShelter = async function(id, name) {
  if (window.canDelete && !window.canDelete()) {
    alert("⚠️ ليس لديك صلاحية الحذف");
    return;
  }
  if (!confirm(`هل تريد حذف "${name}"؟`)) return;
  try {
    await deleteDoc(doc(db, "shelters", id));
    alert("✅ تم الحذف");
    loadShelters();
  } catch (error) {
    console.error("خطأ:", error);
    alert("❌ حدث خطأ في الحذف");
  }
};

// ====== البحث ======
document.getElementById("searchInput")?.addEventListener("input", renderShelters);

// ====== إعادة الرسم عند تغيّر الدور ======
window.addEventListener("roleReady", () => {
  renderShelters();
});

// ====== تشغيل ======
loadShelters();
