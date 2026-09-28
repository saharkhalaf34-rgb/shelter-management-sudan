// Families Page with CRUD
import { db, auth } from "./firebase.js";
import { 
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

let allFamilies = [];
let allShelters = [];
let editingId = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    const n = document.getElementById("userName");
    const a = document.getElementById("avatar");
    if (n) n.textContent = user.email.split("@")[0];
    if (a) a.textContent = user.email.charAt(0).toUpperCase();
  }
});

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

  tbody.innerHTML = filtered.map((f, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><b>${f.headName || "—"}</b></td>
      <td>${f.membersCount || 0} أفراد</td>
      <td>${f.shelterName || "—"}</td>
      <td>${f.phone || "—"}</td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="editFamily('${f.id}')">✏️</button>
        <button class="btn btn-danger btn-sm" onclick="deleteFamily('${f.id}', '${f.headName}')">🗑️</button>
      </td>
    </tr>
  `).join("");
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
  editingId = null;
  document.getElementById("modalTitle").textContent = "➕ إضافة أسرة جديدة";
  document.getElementById("familyForm").reset();
  document.getElementById("modalOverlay").classList.add("active");
};

window.closeModal = function() {
  document.getElementById("modalOverlay").classList.remove("active");
};

window.editFamily = function(id) {
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

loadAll();
