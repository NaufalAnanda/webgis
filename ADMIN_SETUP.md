# 🔐 Panduan Setup Admin untuk WebGIS BPN

## 📍 Lokasi File Konfigurasi Admin

Konfigurasi admin berada di: **`server/routes/auth.js`**

## 🔑 Cara Menentukan Email Admin

Ada **2 cara** untuk membuat user menjadi admin:

### Cara 1: Whitelist Email (Recommended)

Edit file `server/routes/auth.js`, cari bagian:

```javascript
const ADMIN_EMAILS = [
  // Tambahkan email admin di sini
];
```

Tambahkan email admin Anda, contoh:

```javascript
const ADMIN_EMAILS = [
  'admin@bpn.go.id',
  'superadmin@bpn.go.id',
  'petugas.ukur@bpn.go.id',
  'john.doe@example.com'
];
```

**Keuntungan:**
- ✅ Lebih aman dan terstruktur
- ✅ Kontrol penuh terhadap siapa yang jadi admin
- ✅ Tidak bergantung pada kata "admin" di email

### Cara 2: Email Mengandung Kata "admin" (Otomatis)

Jika email mengandung kata "admin" (case-insensitive), otomatis jadi admin.

Contoh email yang jadi admin:
- `admin@example.com` ✅
- `administrator@bpn.go.id` ✅
- `admin.bpn@gmail.com` ✅
- `superadmin@example.com` ✅

**Kelemahan:**
- ⚠️ Siapa saja yang emailnya mengandung "admin" jadi admin
- ⚠️ Kurang fleksibel

## 📝 Cara Update Admin untuk User yang Sudah Login

Jika user sudah pernah login dan ingin diubah jadi admin:

### Opsi 1: Update via MongoDB (Direct)

```javascript
// Buka MongoDB shell atau MongoDB Compass
use webgis-bpn
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

### Opsi 2: Update via MongoDB Compass

1. Buka MongoDB Compass
2. Connect ke database `webgis-bpn`
3. Buka collection `users`
4. Cari user yang ingin diubah
5. Edit field `role` menjadi `admin`
6. Save

### Opsi 3: Edit Kode (Temporary)

Edit `server/routes/auth.js`, pada bagian user yang sudah ada, uncomment baris:

```javascript
user.role = isAdminEmail(email) ? 'admin' : user.role;
```

Setelah user login lagi, role akan ter-update. Setelah itu comment lagi baris tersebut.

## ✅ Verifikasi Admin

Setelah setup, cara verifikasi user adalah admin:

1. Login dengan email yang sudah di-set sebagai admin
2. Cek di sidebar - seharusnya muncul badge **"Admin"**
3. Cek tombol **"Add Data"** - harus muncul di sidebar
4. Upload layer - harus bisa membuka dialog upload

## 🔍 Troubleshooting

### User sudah login tapi tidak jadi admin?

1. **User sudah pernah login sebelum di-set sebagai admin:**
   - Role sudah tersimpan di database
   - Solusi: Update role di MongoDB (lihat Opsi di atas)

2. **Email tidak sesuai dengan whitelist:**
   - Pastikan email di `ADMIN_EMAILS` tepat (case-insensitive, tapi lebih baik sama persis)
   - Restart server setelah edit `auth.js`

3. **Server belum di-restart:**
   - Setelah edit `server/routes/auth.js`, restart server:
     ```bash
     npm run dev
     ```

## 📋 Contoh Setup Lengkap

**File: `server/routes/auth.js`**

```javascript
const ADMIN_EMAILS = [
  'admin@bpn.go.id',
  'superadmin@bpn.go.id',
  'kepala.bidang@bpn.go.id',
  'petugas.ukur1@bpn.go.id',
  'petugas.ukur2@bpn.go.id'
];
```

Setelah setup, user dengan email di atas akan otomatis jadi admin saat pertama kali login.

## 🛡️ Security Note

- **Jangan commit** file `auth.js` dengan email admin ke repository public
- Gunakan environment variables untuk production
- Pertimbangkan menggunakan MongoDB untuk manage admin list (lebih fleksibel)

## 🚀 Production Recommendation

Untuk production, disarankan:

1. Simpan admin emails di database (collection `admin_emails`)
2. Atau gunakan environment variables
3. Atau integrasikan dengan sistem autentikasi yang lebih robust

Ingin saya buatkan versi yang lebih secure dengan database? Let me know!

