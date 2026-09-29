<div align="center">

# 🇸🇩 منصة إدارة مراكز الإيواء

### Shelter Management Platform for Displaced Communities in Sudan

نظام مركزي لإدارة معلومات النازحين ومراكز الإيواء وتنسيق المساعدات الإنسانية في السودان

---

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

### 🌐 [**عرض المنصة مباشرة**](https://saharkhalaf34-rgb.github.io/shelter-management-sudan/)

</div>

---

## 📖 عن المشروع

تواجه مراكز الإيواء في السودان صعوبات كبيرة في إدارة معلومات النازحين والأسر، حيث تُحفظ السجلات يدوياً أو في أماكن متفرقة، مما يصعّب تحديث البيانات ومتابعة سعة المراكز وتنسيق المساعدات الإنسانية.

**منصة إدارة مراكز الإيواء** هي حل رقمي مركزي يهدف إلى:

- 📋 تسجيل الأسر النازحة بشكل منظم
- 🏠 متابعة سعة مراكز الإيواء والإشغال الفوري
- 📦 تسجيل الاحتياجات الأساسية وتصنيفها حسب الأولوية
- 🤝 تنسيق توزيع المساعدات الإنسانية بين المنظمات
- 📈 إنتاج تقارير وإحصائيات تدعم اتخاذ القرار

---

## ✨ المميزات

| # | الميزة | الوصف |
|---|--------|-------|
| 🔐 | **تسجيل دخول آمن** | Firebase Authentication |
| 📊 | **لوحة تحكم تفاعلية** | إحصائيات ورسوم بيانية فورية |
| 🏠 | **إدارة مراكز الإيواء** | CRUD كامل + متابعة السعة |
| 👨‍👩‍👧 | **تسجيل الأسر النازحة** | CRUD + ربط الأسر بالمراكز |
| 📦 | **إدارة الاحتياجات** | CRUD + تصنيف حسب الأولوية |
| 🤝 | **تنسيق المساعدات** | CRUD + ربط المنظمات بالمستفيدين |
| 📈 | **تقارير وإحصائيات** | رسوم بيانية تفاعلية |
| 🔒 | **قواعد أمان** | Firestore Security Rules |
| 🌐 | **واجهة عربية RTL** | تصميم سوداني أصيل |

---

## 🛠️ التقنيات المستخدمة

### الواجهة الأمامية (Frontend)
- **HTML5** — هيكل الصفحات
- **CSS3** — التصميم والثيم السوداني
- **JavaScript (Vanilla)** — المنطق والتفاعل

### الواجهة الخلفية (Backend)
- **Firebase Authentication** — تسجيل الدخول الآمن
- **Cloud Firestore** — قاعدة بيانات NoSQL سحابية
- **Firestore Security Rules** — قواعد أمان البيانات

### الاستضافة
- **GitHub Pages** — استضافة الواجهة
- **Firebase Cloud** — خدمات الباك إند

---

## 📁 هيكل المشروع

```
shelter-management-sudan/
│
├── index.html              ← تسجيل الدخول
├── dashboard.html          ← لوحة التحكم
├── shelters.html           ← مراكز الإيواء
├── families.html           ← الأسر النازحة
├── needs.html              ← الاحتياجات
├── aid.html                ← المساعدات
├── reports.html            ← التقارير
│
├── css/
│   ├── style.css           ← تصميم صفحة الدخول
│   └── shared.css          ← نظام التصميم الموحد
│
├── js/
│   ├── firebase.js         ← إعدادات Firebase
│   ├── auth.js             ← منطق تسجيل الدخول
│   ├── auth-guard.js       ← حماية الصفحات + logout
│   ├── dashboard.js        ← منطق لوحة التحكم
│   ├── shelters.js         ← CRUD مراكز الإيواء
│   ├── families.js         ← CRUD الأسر
│   ├── aid.js              ← CRUD المساعدات
│   ├── needs.js            ← CRUD الاحتياجات
│   └── reports.js          ← منطق التقارير
│
├── logo.jpg                ← شعار المنصة
├── LICENSE                 ← رخصة MIT
└── README.md               ← هذا الملف
```

---

## 🗄️ بنية قاعدة البيانات (Firestore)

### Collection: `shelters`
```
{
  name: "مركز الإيواء - الخرطوم",     // string
  location: "الخرطوم",                  // string
  capacity: 500,                        // number
  currentOccupancy: 320,                // number
  status: "active"                      // string
}
```

### Collection: `families`
```
{
  headName: "محمد أحمد علي",           // string
  membersCount: 5,                      // number
  shelterName: "مركز الإيواء - الخرطوم", // string
  phone: "0912345678"                   // string
}
```

### Collection: `aid`
```
{
  familyName: "محمد أحمد علي",         // string
  type: "سلة غذائية",                  // string
  quantity: 2,                          // number
  distributedBy: "admin"                // string
}
```

### Collection: `needs`
```
{
  familyName: "محمد أحمد علي",         // string
  type: "غذاء",                         // string
  priority: "عالية",                    // string
  quantity: 2                           // number
}
```

---

## 🚀 كيفية الاستخدام

### 1️⃣ فتح المنصة

اذهب إلى:
```
https://saharkhalaf34-rgb.github.io/shelter-management-sudan/
```

### 2️⃣ تسجيل الدخول

| الحقل | القيمة |
|------|--------|
| البريد الإلكتروني | `admin@shelter.com` |
| كلمة المرور | `123456` |

### 3️⃣ ابدأ بالترتيب

1. **أضف مراكز الإيواء** أولاً (من صفحة "مراكز الإيواء")
2. **سجّل الأسر النازحة** وربطها بالمراكز
3. **أضف الاحتياجات** الأساسية للأسر
4. **سجّل المساعدات** القادمة من المنظمات
5. **راجع التقارير** والإحصائيات

---

## 🔒 الأمان

- ✅ **تسجيل دخول بـ Firebase Authentication**
- ✅ **Firestore Security Rules:**
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if request.auth != null;
      }
    }
  }
  ```
- ✅ **حماية كل الصفحات الداخلية** — أي حد مش مسجل، يترجّع لصفحة الدخول تلقائياً

---

## 🎨 الثيم السوداني

المنصة مستوحاة من ألوان العلم السوداني:

| اللون | الكود | الاستخدام |
|------|------|-----------|
| 🔴 أحمر | `#D21034` | أزرار مهمة، تنبيهات |
| ⚪ أبيض | `#FFFFFF` | خلفيات |
| ⚫ أسود | `#111111` | نصوص |
| 🟢 أخضر | `#007229` | نجاح، تأكيدات |
| 🏜️ ذهبي | `#C9A227` | لمسات وأنيق |
| 🌊 أزرق النيل | `#1B4F72` | العناوين والشريط الجانبي |

---

## 🔮 التطوير المستقبلي

- [ ] نظام صلاحيات متعدد المستويات (Admin / Manager / Viewer)
- [ ] تطبيق موبايل (PWA)
- [ ] خرائط تفاعلية للمراكز
- [ ] إشعارات فورية (Firebase Cloud Messaging)
- [ ] تصدير Excel/PDF للتقارير
- [ ] تكامل مع المنظمات الدولية (UNHCR APIs)
- [ ] دعم اللغتين العربية والإنجليزية

---

## 👥 فريق العمل

**جامعة الأحفاد للبنات** — كلية الدراسات الإدارية  
**تخصص:** نظم المعلومات الإدارية (MIS)

| الاسم | الرقم الجامعي |
|------|---------------|
| رزان محمد تاج السر زيد | 201800179 |
| سحر خلف الله كوكو أحمد | 201800686 |
| سارة عبدالله منا موسى | 201800742 |

---

## 📄 الترخيص

هذا المشروع مرخّص تحت [MIT License](LICENSE)

---

<div align="center">

### 🇸🇩 صُنع بحب من أجل السودان

**"نحو إدارة أفضل للمعلومات الإنسانية"**

</div>
