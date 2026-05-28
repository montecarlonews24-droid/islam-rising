# Islam Rising — PWA

نبض العبادة اليومية 🌙

## الملفات

```
islam-rising-pwa/
├── index.html      ← الصفحة الرئيسية
├── App.jsx         ← كامل كود التطبيق
├── manifest.json   ← إعدادات PWA
├── sw.js           ← Service Worker (offline)
├── icons/          ← الأيقونات (أضفها يدوياً)
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-144.png
│   ├── icon-152.png
│   ├── icon-192.png
│   ├── icon-384.png
│   └── icon-512.png
└── screenshots/    ← صور المتجر (أضفها يدوياً)
    ├── screen1.png
    └── screen2.png
```

## خطوات الرفع على GitHub Pages

### ١. أنشئ Repository
- اذهب إلى github.com
- New Repository
- الاسم: `islam-rising`
- Public ✅

### ٢. ارفع الملفات
```
ارفع كل الملفات من هذا المجلد
```

### ٣. فعّل GitHub Pages
- Settings → Pages
- Source: Deploy from branch
- Branch: main / (root)
- Save

### ٤. الرابط سيكون
```
https://[اسمك].github.io/islam-rising/
```

## الأيقونات

استخدم ملف `islam-rising-icon.jsx` لتوليد الأيقونة
ثم حوّلها لأحجام مختلفة عبر:
- https://realfavicongenerator.net
- https://maskable.app (للـ maskable icons)

## Median.co — APK

بعد رفع GitHub Pages:
1. اذهب إلى median.co
2. Enter URL: رابط GitHub Pages
3. App Name: Islam Rising
4. Generate APK
5. ارفع على Google Play

## متغيرات مهمة في App.jsx

```javascript
// Anthropic API — SENTINEL AI
// يعمل تلقائياً في بيئة Claude artifacts
// للإنتاج: أضف API key في Median.co environment variables

// window.storage
// يعمل تلقائياً في Claude artifacts
// للإنتاج مع Median.co: يحتاج إلى Firebase أو Supabase
```

## Leaderboard في الإنتاج

`window.storage` يعمل فقط في Claude artifacts.
للإنتاج الحقيقي استبدله بـ:

```javascript
// Firebase Realtime Database (مجاني حتى حد معين)
import { getDatabase, ref, set, get } from "firebase/database";
```

---

**الاسم:** Islam Rising
**الإصدار:** 1.0.0
**الترخيص:** خاص
