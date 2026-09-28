// Reports Page
import { db, auth } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    const n = document.getElementById("userName");
    const a = document.getElementById("avatar");
    if (n) n.textContent = user.email.split("@")[0];
    if (a) a.textContent = user.email.charAt(0).toUpperCase();
  }
});

let shelters = [], families = [], aid = [], needs = [];

async function loadAll() {
  try {
    const [s, f, a, n] = await Promise.all([
      getDocs(collection(db, "shelters")),
      getDocs(collection(db, "families")),
      getDocs(collection(db, "aid")),
      getDocs(collection(db, "needs"))
    ]);

    shelters = s.docs.map(d => d.data());
    families = f.docs.map(d => d.data());
    aid = a.docs.map(d => d.data());
    needs = n.docs.map(d => d.data());

    renderAll();
  } catch (e) {
    console.error("خطأ:", e);
  }
}

function renderAll() {
  // الإحصائيات العامة
  const totalShelters = shelters.length;
  const totalCapacity = shelters.reduce((a, s) => a + (Number(s.capacity) || 0), 0);
  const totalOccupied = shelters.reduce((a, s) => a + (Number(s.currentOccupancy) || 0), 0);
  const occupancyPct = totalCapacity ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

  const totalFamilies = families.length;
  const totalPeople = families.reduce((a, f) => a + (Number(f.membersCount) || 0), 0);
  const avgFamily = totalFamilies ? Math.round(totalPeople / totalFamilies) : 0;

  const totalAid = aid.length;
  const totalAidQty = aid.reduce((a, x) => a + (Number(x.quantity) || 0), 0);

  const totalNeeds = needs.length;
  const highNeeds = needs.filter(x => x.priority === "عالية").length;

  setEl("rShelters", totalShelters);
  setEl("rCapacity", totalCapacity);
  setEl("rOccupied", totalOccupied);
  setEl("rOccupancyPct", occupancyPct + "%");
  setEl("rFamilies", totalFamilies);
  setEl("rPeople", totalPeople);
  setEl("rAvg", avgFamily);
  setEl("rAid", totalAid);
  setEl("rAidQty", totalAidQty);
  setEl("rNeeds", totalNeeds);
  setEl("rHighNeeds", highNeeds);

  // أعلى المراكز إشغالاً
  const topShelters = [...shelters]
    .map(s => ({
      name: s.name || "—",
      pct: (Number(s.capacity) || 0) ? Math.round((Number(s.currentOccupancy) / Number(s.capacity)) * 100) : 0
    }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);

  const topBox = document.getElementById("topShelters");
  if (topBox) {
    topBox.innerHTML = topShelters.map(s => {
      const cls = s.pct > 85 ? "red" : s.pct > 60 ? "gold" : "nile";
      return `
        <div class="bar-row">
          <div class="bar-label">${s.name}</div>
          <div class="bar-track">
            <div class="bar-fill ${cls}" style="width:${s.pct}%">${s.pct}%</div>
          </div>
        </div>`;
    }).join("");
  }

  // توزيع الأسر حسب المراكز
  const famByShelter = {};
  families.forEach(f => {
    const key = f.shelterName || "غير محدد";
    famByShelter[key] = (famByShelter[key] || 0) + 1;
  });
  const famEntries = Object.entries(famByShelter).sort((a, b) => b[1] - a[1]);
  const maxFam = famEntries[0]?.[1] || 1;

  const famBox = document.getElementById("familiesChart");
  if (famBox) {
    famBox.innerHTML = famEntries.map(([name, count]) => {
      const pct = Math.round((count / maxFam) * 100);
      return `
        <div class="bar-row">
          <div class="bar-label">${name}</div>
          <div class="bar-track">
            <div class="bar-fill nile" style="width:${pct}%">${count}</div>
          </div>
        </div>`;
    }).join("");
  }

  // أنواع المساعدات
  const aidTypes = {};
  aid.forEach(x => {
    const k = x.type || "أخرى";
    aidTypes[k] = (aidTypes[k] || 0) + 1;
  });
  const aidEntries = Object.entries(aidTypes).sort((a, b) => b[1] - a[1]);
  const maxAid = aidEntries[0]?.[1] || 1;

  const aidBox = document.getElementById("aidChart");
  if (aidBox) {
    aidBox.innerHTML = aidEntries.map(([type, count]) => {
      const pct = Math.round((count / maxAid) * 100);
      return `
        <div class="bar-row">
          <div class="bar-label">${type}</div>
          <div class="bar-track">
            <div class="bar-fill gold" style="width:${pct}%">${count}</div>
          </div>
        </div>`;
    }).join("");
  }

  // أنواع الاحتياجات
  const needTypes = {};
  needs.forEach(x => {
    const k = x.type || "أخرى";
    needTypes[k] = (needTypes[k] || 0) + 1;
  });
  const needEntries = Object.entries(needTypes).sort((a, b) => b[1] - a[1]);
  const maxNeed = needEntries[0]?.[1] || 1;

  const needBox = document.getElementById("needsChart");
  if (needBox) {
    needBox.innerHTML = needEntries.map(([type, count]) => {
      const pct = Math.round((count / maxNeed) * 100);
      return `
        <div class="bar-row">
          <div class="bar-label">${type}</div>
          <div class="bar-track">
            <div class="bar-fill red" style="width:${pct}%">${count}</div>
          </div>
        </div>`;
    }).join("");
  }
}

function setEl(id, v) {
  const e = document.getElementById(id);
  if (e) e.textContent = v;
}

loadAll();
