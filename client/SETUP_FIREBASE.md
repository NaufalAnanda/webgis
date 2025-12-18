# 🔥 Setup Firebase Configuration

## Error: `auth/invalid-api-key`

Error ini terjadi karena Firebase configuration belum di-set. Ikuti langkah berikut:

## 📋 Langkah-langkah Setup Firebase

### 1. Buat Project Firebase (jika belum ada)

1. Kunjungi [Firebase Console](https://console.firebase.google.com/)
2. Klik **"Add project"** atau pilih project yang sudah ada
3. Isi nama project (misal: "webgis-bpn")
4. Ikuti wizard sampai selesai

### 2. Enable Google Authentication

1. Di Firebase Console, klik **Authentication** di menu kiri
2. Klik **"Get started"** (jika pertama kali)
3. Klik tab **"Sign-in method"**
4. Klik **Google**
5. Toggle **Enable** menjadi ON
6. Isi **Project support email** (bisa gunakan email Anda)
7. Klik **Save**

### 3. Dapatkan Firebase Config

1. Klik **⚙️ (Settings/Gear icon)** di menu kiri
2. Pilih **"Project settings"**
3. Scroll ke bawah ke bagian **"Your apps"**
4. Klik icon **</> (Web)** untuk menambahkan web app
5. Isi **App nickname** (misal: "WebGIS BPN")
6. **JANGAN** centang "Also set up Firebase Hosting" (kecuali jika diperlukan)
7. Klik **"Register app"**
8. Copy config yang muncul, contoh:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "webgis-bpn.firebaseapp.com",
     projectId: "webgis-bpn",
     storageBucket: "webgis-bpn.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456"
   };
   ```

### 4. Buat File `.env` di Folder `client/`

1. Buat file baru dengan nama `.env` di folder `client/`
2. Copy-paste berikut dan isi dengan nilai dari Firebase config:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_FIREBASE_AUTH_DOMAIN=webgis-bpn.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=webgis-bpn
REACT_APP_FIREBASE_STORAGE_BUCKET=webgis-bpn.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
REACT_APP_API_URL=http://localhost:5000
```

**⚠️ PENTING:**
- Ganti semua nilai dengan data dari Firebase Console Anda
- Jangan ada spasi sebelum/tidak ada `=` setelah nama variabel
- Jangan ada tanda kutip (`"` atau `'`)

### 5. Restart Development Server

Setelah membuat file `.env`:

1. **Stop** server yang sedang berjalan (Ctrl+C)
2. **Start ulang** dengan:
   ```bash
   npm run dev
   ```

React akan otomatis load environment variables dari `.env`.

## ✅ Verifikasi Setup

Setelah restart, jika berhasil:
- Tidak ada error di console
- Halaman login muncul
- Tombol "Login dengan Google" bisa diklik

## 🔍 Troubleshooting

### Masih error `invalid-api-key`?
- ✅ Pastikan file `.env` ada di folder `client/` (bukan root)
- ✅ Pastikan tidak ada spasi di sekitar `=`
- ✅ Pastikan nilai sudah diisi (bukan `your_api_key`)
- ✅ Restart server setelah membuat/ubah `.env`
- ✅ Cek browser console untuk error detail

### File `.env` tidak terbaca?
- Pastikan nama file tepat `.env` (bukan `.env.txt`)
- Di Windows, file mungkin tersembunyi, pastikan "Show hidden files" aktif
- Cek apakah file benar-benar di `client/.env`

### Google Sign-In tidak muncul?
- Pastikan Google Authentication sudah di-enable di Firebase Console
- Cek browser console untuk error
- Pastikan domain sudah di-whitelist di Firebase (localhost otomatis diizinkan untuk development)

## 📝 Contoh File `.env` Lengkap

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_FIREBASE_AUTH_DOMAIN=webgis-bpn.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=webgis-bpn
REACT_APP_FIREBASE_STORAGE_BUCKET=webgis-bpn.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Backend API URL
REACT_APP_API_URL=http://localhost:5000
```

## 🆘 Masih Bermasalah?

1. Cek `client/src/config/firebase.js` - pastikan tidak ada typo
2. Clear browser cache dan reload
3. Cek Firebase Console - pastikan project aktif
4. Cek Network tab di browser DevTools - lihat apakah request ke Firebase berhasil iyh

