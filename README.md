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
- 🔐 إدارة صلاحيات متعددة المستويات للمستخدمين

---

## ✨ المميزات

| # | الميزة | الوصف |
|---|--------|-------|
| 🔐 | **تسجيل دخول آمن** | Firebase Authentication |
| 👥 | **نظام صلاحيات (RBAC)** | 3 أدوار: Admin / Manager / Viewer |
| 📊 | **لوحة تحكم تفاعلية** | إحصائيات ورسوم بيانية فورية |
| 🏠 | **إدارة مراكز الإيواء** | CRUD كامل + متابعة السعة |
| 👨‍👩‍👧 | **تسجيل الأسر النازحة** | CRUD + ربط الأسر بالمراكز |
| 📦 | **إدارة الاحتياجات** | CRUD + تصنيف حسب الأولوية |
| 🤝 | **تنسيق المساعدات** | CRUD + ربط المنظمات بالمستفيدين |
| 📈 | **تقارير وإحصائيات** | رسوم بيانية تفاعلية |
| 🔒 | **قواعد أمان** | Firestore Security Rules |
| 🌐 | **واجهة عربية RTL** | تصميم سوداني أصيل |

---

## 👥 نظام الصلاحيات (RBAC)

النظام يدعم **3 أدوار** بمستويات صلاحيات مختلفة:

| الدور | ➕ إضافة | ✏️ تعديل | 🗑️ حذف | 📊 عرض |
|-------|---------|---------|---------|--------|
| 🔴 **Admin** | ✅ | ✅ | ✅ | ✅ |
| 🟡 **Manager** | ✅ | ✅ | ❌ | ✅ |
| 🔵 **Viewer** | ❌ | ❌ | ❌ | ✅ |

### 📋 بيانات الدخول التجريبية:

| الدور | البريد الإلكتروني | كلمة المرور |
|------|-------------------|-------------|
| 🔴 **Admin** | `admin@shelter.com` | `123456` |
| 🟡 **Manager** | `manager@shelter.com` | `123456` |
| 🔵 **Viewer** | `viewer@shelter.com` | `123456` |

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
- **Role-Based Access Control** — إدارة الصلاحيات

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
│   ├── auth-guard.js       ← حماية الصفحات + إدارة الصلاحيات
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

### Collection: `users` ⭐ (جديد)
```
{
  email: "admin@shelter.com",           // string
  role: "admin",                        // string (admin/manager/viewer)
  name: "مدير النظام"                   // string
}
```

> **ملاحظة:** الـ Document ID في `users` هو نفس الإيميل لسهولة البحث.

---

## 🚀 كيفية الاستخدام

### 1️⃣ فتح المنصة

اذهب إلى:
```
https://saharkhalaf34-rgb.github.io/shelter-management-sudan/
```

### 2️⃣ تسجيل الدخول

استخدم أحد الحسابات التجريبية (انظر [نظام الصلاحيات](#-نظام-الصلاحيات-rbac))

### 3️⃣ ابدأ بالترتيب

1. **أضف مراكز الإيواء** أولاً (من صفحة "مراكز الإيواء")
2. **سجّل الأسر النازحة** وربطها بالمراكز
3. **أضف الاحتياجات** الأساسية للأسر
4. **سجّل المساعدات** القادمة من المنظمات
5. **راجع التقارير** والإحصائيات

> **💡 نصيحة:** استخدم حساب **Admin** للتجربة الكاملة.

---

## 🔒 الأمان

النظام يطبّق **3 طبقات من الحماية**:

### الطبقة 1: Firebase Authentication
- كلمات مرور مشفّرة
- جلسات آمنة

### الطبقة 2: Firestore Security Rules
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

### الطبقة 3: Role-Based Access Control
- فحص الدور عند كل عملية
- إخفاء الأزرار غير المصرح بها
- منع العمليات غير المصرح بها في الكود

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

- [ ] **نظام صلاحيات متقدم** — إضافة أدوار مخصصة
- [ ] **تطبيق موبايل (PWA)** — للاستخدام الميداني
- [ ] **خرائط تفاعلية** — لمواقع المراكز
- [ ] **إشعارات فورية** — Firebase Cloud Messaging
- [ ] **تصدير Excel/PDF** — للتقارير
- [ ] **تكامل مع UNHCR APIs** — لاستيراد بيانات النزوح
- [ ] **دعم اللغتين** — العربية والإنجليزية
- [ ] **سجل النشاطات (Audit Log)** — لتتبع كل عملية
- [ ] **نسخ احتياطي تلقائي** — للبيانات

---

## 📸 لقطات من المنصة

> أضف صور من الصفحات الرئيسية هنا
> (Dashboard / Shelters / Families / Reports)

---

## 👥 فريق العمل

**جامعة الأحفاد للبنات** — كلية العلوم الإدارية  
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

⭐ إذا أعجبك المشروع، لا تنسَ إضافة نجمة على المستودع!

</div>
