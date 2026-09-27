// ============================================
// Shelter Sudan - Main Application Logic
// Firebase Firestore + Authentication
// ============================================

import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// ============================================
// Authentication State
// ============================================

onAuthStateChanged(auth, (user) => {
  const isLoginPage = document.body.classList.contains('login-page');
  const isAppPage = document.body.hasAttribute('data-app');

  if (!user && isAppPage) {
    // Not logged in + trying to access app page
    window.location.href = 'index.html';
  } else if (user && isLoginPage) {
    // Already logged in + on login page
    window.location.href = 'dashboard.html';
  }
});

// ============================================
// Logout
// ============================================

window.logout = async function () {
  try {
    await signOut(auth);
    localStorage.removeItem('shelterLoggedIn');
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// ============================================
// Real-time Data Listeners
// ============================================

let sheltersData = [];
let familiesData = [];
let assistanceData = [];

// Shelters Listener
onSnapshot(collection(db, 'shelters'), (snapshot) => {
  sheltersData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  if (typeof window.renderShelters === 'function') window.renderShelters();
  if (typeof window.updateDashboard === 'function') window.updateDashboard();
  if (typeof window.updateReports === 'function') window.updateReports();
});

// Families Listener
onSnapshot(collection(db, 'families'), (snapshot) => {
  familiesData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  if (typeof window.renderFamilies === 'function') window.renderFamilies();
  if (typeof window.updateDashboard === 'function') window.updateDashboard();
  if (typeof window.updateReports === 'function') window.updateReports();
});

// Assistance Listener
onSnapshot(collection(db, 'assistance'), (snapshot) => {
  assistanceData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  if (typeof window.renderAssistance === 'function') window.renderAssistance();
  if (typeof window.updateDashboard === 'function') window.updateDashboard();
  if (typeof window.updateReports === 'function') window.updateReports();
});

// ============================================
// Alert Helper
// ============================================

function showAlert(message, type = 'success') {
  const alertBox = document.getElementById('alert');
  if (alertBox) {
    alertBox.textContent = message;
    alertBox.className = 'alert ' + type;
    alertBox.style.display = 'block';
    setTimeout(() => { alertBox.style.display = 'none'; }, 3000);
  }
}

// ============================================
// Shelters Functions
// ============================================

window.addShelter = async function (e) {
  e.preventDefault();
  const form = e.target;
  const data = {
    name: form.name.value.trim(),
    location: form.location.value.trim(),
    capacity: Number(form.capacity.value),
    occupancy: Number(form.occupancy.value),
    createdAt: serverTimestamp()
  };

  if (data.occupancy > data.capacity) {
    showAlert('السعة الحالية أكبر من السعة الإجمالية', 'error');
    return;
  }

  try {
    await addDoc(collection(db, 'shelters'), data);
    form.reset();
    showAlert('تم تسجيل المركز بنجاح ✅');
  } catch (error) {
    console.error('Add shelter error:', error);
    showAlert('حدث خطأ أثناء الحفظ', 'error');
  }
};

window.renderShelters = function () {
  const tbody = document.getElementById('shelterRows');
  if (!tbody) return;

  const searchInput = document.getElementById('search');
  const term = searchInput ? searchInput.value.trim().toLowerCase() : '';

  const filtered = sheltersData.filter(s =>
    (s.name + ' ' + s.location).toLowerCase().includes(term)
  );

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#888">لا توجد مراكز مسجلة</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(s => {
    const pct = s.capacity ? Math.round((s.occupancy / s.capacity) * 100) : 0;
    let statusText = 'متاح';
    let statusColor = '#1b7a3e';
    if (pct >= 90) { statusText = 'ممتلئ'; statusColor = '#c0392b'; }
    else if (pct >= 70) { statusText = 'مزدحم'; statusColor = '#e67e22'; }

    return `
      <tr>
        <td>${escapeHtml(s.name)}</td>
        <td>${escapeHtml(s.location)}</td>
        <td>${s.capacity}</td>
        <td>${s.occupancy}</td>
        <td><span style="color:${statusColor};font-weight:600">${statusText} (${pct}%)</span></td>
        <td><button onclick="deleteShelter('${s.id}')" style="background:#c0392b;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer">حذف</button></td>
      </tr>
    `;
  }).join('');
};

window.deleteShelter = async function (id) {
  if (!confirm('هل أنت متأكد من الحذف؟')) return;
  try {
    await deleteDoc(doc(db, 'shelters', id));
    showAlert('تم الحذف بنجاح');
  } catch (error) {
    console.error(error);
    showAlert('فشل الحذف', 'error');
  }
};

// ============================================
// Families Functions
// ============================================

window.addFamily = async function (e) {
  e.preventDefault();
  const form = e.target;
  const data = {
    head: form.head.value.trim(),
    members: Number(form.members.value),
    shelter: form.shelter.value,
    phone: form.phone ? form.phone.value.trim() : '',
    needs: form.needs ? form.needs.value.trim() : '',
    createdAt: serverTimestamp()
  };

  try {
    await addDoc(collection(db, 'families'), data);
    form.reset();
    showAlert('تم تسجيل الأسرة بنجاح ✅');
  } catch (error) {
    console.error(error);
    showAlert('حدث خطأ', 'error');
  }
};

window.renderFamilies = function () {
  const tbody = document.getElementById('familyRows');
  if (!tbody) return;

  // Populate shelter dropdown
  const shelterSelect = document.querySelector('select[name="shelter"]');
  if (shelterSelect && sheltersData.length) {
    const currentVal = shelterSelect.value;
    shelterSelect.innerHTML = '<option value="">اختر المركز</option>' +
      sheltersData.map(s => `<option value="${escapeHtml(s.name)}">${escapeHtml(s.name)}</option>`).join('');
    if (currentVal) shelterSelect.value = currentVal;
  }

  const searchInput = document.getElementById('search');
  const term = searchInput ? searchInput.value.trim().toLowerCase() : '';

  const filtered = familiesData.filter(f =>
    ((f.head || '') + ' ' + (f.shelter || '') + ' ' + (f.needs || '')).toLowerCase().includes(term)
  );

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#888">لا توجد أسر مسجلة</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(f => `
    <tr>
      <td>${escapeHtml(f.head)}</td>
      <td>${f.members}</td>
      <td>${escapeHtml(f.shelter || '-')}</td>
      <td>${escapeHtml(f.needs || '-')}</td>
      <td><button onclick="deleteFamily('${f.id}')" style="background:#c0392b;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer">حذف</button></td>
    </tr>
  `).join('');
};

window.deleteFamily = async function (id) {
  if (!confirm('هل أنت متأكد من الحذف؟')) return;
  try {
    await deleteDoc(doc(db, 'families', id));
    showAlert('تم الحذف بنجاح');
  } catch (error) {
    showAlert('فشل الحذف', 'error');
  }
};

// ============================================
// Assistance Functions
// ============================================

window.addAssistance = async function (e) {
  e.preventDefault();
  const form = e.target;
  const data = {
    beneficiary: form.beneficiary.value.trim(),
    type: form.type.value,
    details: form.details ? form.details.value.trim() : '',
    date: new Date().toISOString().slice(0, 10),
    status: 'مكتمل',
    createdAt: serverTimestamp()
  };

  try {
    await addDoc(collection(db, 'assistance'), data);
    form.reset();
    showAlert('تم تسجيل المساعدة بنجاح ✅');
  } catch (error) {
    showAlert('حدث خطأ', 'error');
  }
};

window.renderAssistance = function () {
  const tbody = document.getElementById('assistanceRows');
  if (!tbody) return;

  const searchInput = document.getElementById('search');
  const term = searchInput ? searchInput.value.trim().toLowerCase() : '';

  const filtered = assistanceData.filter(a =>
    ((a.beneficiary || '') + ' ' + (a.type || '')).toLowerCase().includes(term)
  );

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#888">لا توجد مساعدات مسجلة</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(a => `
    <tr>
      <td>${escapeHtml(a.beneficiary)}</td>
      <td>${escapeHtml(a.type)}</td>
      <td>${escapeHtml(a.details || '-')}</td>
      <td>${escapeHtml(a.date || '-')}</td>
      <td>${escapeHtml(a.status || '-')}</td>
    </tr>
  `).join('');
};

// ============================================
// Dashboard Functions
// ============================================

window.updateDashboard = function () {
  const totalShelters = document.getElementById('totalShelters');
  if (!totalShelters) return;

  const totalCapacity = sheltersData.reduce((a, s) => a + (s.capacity || 0), 0);
  const totalOccupancy = sheltersData.reduce((a, s) => a + (s.occupancy || 0), 0);
  const availableCapacity = totalCapacity - totalOccupancy;
  const occupancyRate = totalCapacity ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;

  totalShelters.textContent = sheltersData.length;
  const totalFamilies = document.getElementById('totalFamilies');
  if (totalFamilies) totalFamilies.textContent = familiesData.length;

  const availableCap = document.getElementById('availableCapacity');
  if (availableCap) availableCap.textContent = availableCapacity;

  const assistanceReq = document.getElementById('assistanceRequests');
  if (assistanceReq) assistanceReq.textContent = assistanceData.length;

  const occRate = document.getElementById('occupancyRate');
  if (occRate) occRate.textContent = occupancyRate + '%';

  const occBar = document.getElementById('occBar');
  if (occBar) occBar.style.width = Math.min(occupancyRate, 100) + '%';

  // Recent assistance
  const recentRows = document.getElementById('recentRows');
  if (recentRows) {
    const recent = assistanceData.slice(0, 5);
    if (recent.length === 0) {
      recentRows.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#888">لا توجد بيانات</td></tr>';
    } else {
      recentRows.innerHTML = recent.map(a => `
        <tr>
          <td>${escapeHtml(a.beneficiary)}</td>
          <td>${escapeHtml(a.type)}</td>
          <td>${escapeHtml(a.date || '-')}</td>
          <td>${escapeHtml(a.status || '-')}</td>
        </tr>
      `).join('');
    }
  }
};

// ============================================
// Reports Functions
// ============================================

window.updateReports = function () {
  const occRate = document.getElementById('occupancyRate');
  if (!occRate) return;

  const totalCapacity = sheltersData.reduce((a, s) => a + (s.capacity || 0), 0);
  const totalOccupancy = sheltersData.reduce((a, s) => a + (s.occupancy || 0), 0);
  const rate = totalCapacity ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;

  occRate.textContent = rate + '%';

  const reportBar = document.getElementById('reportBar');
  if (reportBar) reportBar.style.width = Math.min(rate, 100) + '%';

  const familyCount = document.getElementById('familyCount');
  if (familyCount) familyCount.textContent = familiesData.length;

  const assistanceCount = document.getElementById('assistanceCount');
  if (assistanceCount) assistanceCount.textContent = assistanceData.length;

  const shelterCount = document.getElementById('shelterCount');
  if (shelterCount) shelterCount.textContent = sheltersData.length;

  const beneficiaries = document.getElementById('beneficiaries');
  if (beneficiaries) beneficiaries.textContent = familiesData.reduce((a, f) => a + (f.members || 0), 0);
};

// ============================================
// Utilities
// ============================================

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

// ============================================
// Initial render on page load
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.renderShelters === 'function') window.renderShelters();
  if (typeof window.renderFamilies === 'function') window.renderFamilies();
  if (typeof window.renderAssistance === 'function') window.renderAssistance();
  if (typeof window.updateDashboard === 'function') window.updateDashboard();
  if (typeof window.updateReports === 'function') window.updateReports();
});
