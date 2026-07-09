# Motion Core Admin App

![Motion Core](https://img.shields.io/badge/Motion%20Core-Cyan-%2306b6d4)

Aplikasi Android untuk mengakses **Motion Core Admin Panel** dengan cepat.

## 🚀 Install Cepat (Tanpa Build APK)

Buka Chrome Android → buka **[https://adminpanel.motioncore.workers.dev/](https://adminpanel.motioncore.workers.dev/)** → tap **"Add to Home Screen"** di menu Chrome.

Sudah PWA-ready: icon, manifest, standalone mode.

## 📱 Build APK (Native Android App)

### Opsi 1: GitHub Actions (Mudah)

1. Buka [Expo Dashboard](https://expo.dev) → Login akun **revan9868**
2. Settings → Access Tokens → **Create token** → copy token
3. Buka repo GitHub: https://github.com/revan9868/motion-core-admin-app
4. Settings → Secrets and variables → Actions → **New repository secret**
   - Name: `EXPO_TOKEN`
   - Value: token dari Expo
5. Actions → **Build Android APK** → Run workflow
6. Download APK dari artifacts (≈30 menit)

### Opsi 2: Build Lokal

1. Install Node.js + Android Studio + SDK
2. Jalankan `BUILD_APK.bat` (double-click)
3. Pilih opsi EAS Build

## 🔧 Struktur Project

```
motion-core-admin/
├── App.js                    ← Main app
├── src/
│   ├── config.js             ← URL admin panel
│   ├── screens/
│   │   ├── LoginScreen.js    ← PIN + Biometric
│   │   └── AdminWebScreen.js ← WebView wrapper
│   └── services/
│       └── SecureStore.js    ← Keystore storage
├── app.json                  ← Expo config
├── eas.json                  ← EAS Build config
└── .github/workflows/        ← CI/CD build
```

## ✨ Fitur

- ✅ Biometric login (fingerprint/face)
- ✅ PIN auto-save di Android Keystore
- ✅ Auto-fill PIN ke admin panel
- ✅ Pull-to-refresh
- ✅ Error handling + retry
- ✅ Progress bar loading
- ✅ Android back button support
- ✅ Dark theme (Motion Core Cyan)

## 🔗 Links

- **Admin Panel**: https://adminpanel.motioncore.workers.dev/
- **Worker API**: https://adminpanel.motioncore.workers.dev/api/admin/
- **GitHub**: https://github.com/revan9868/motion-core-admin-app
