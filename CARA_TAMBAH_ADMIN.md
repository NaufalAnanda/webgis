# 📝 Cara Menambahkan Admin Baru

## 🎯 Metode 1: Tambahkan ke Whitelist (Untuk User Baru)

Cara ini untuk user yang **belum pernah login** atau **baru akan login**.

### Langkah-langkah:

1. **Buka file** `server/routes/auth.js`

2. **Cari bagian** `ADMIN_EMAILS` (sekitar baris 7):

```javascript
const ADMIN_EMAILS = [
  'naufalananda79@gmail.com'
  // Tambahkan email admin di sini
];
```

3. **Tambahkan email admin baru**, contoh:

```javascript
const ADMIN_EMAILS = [
  'naufalananda79@gmail.com',
  'admin.baru@example.com',        // ← Email admin baru 1
  'petugas.ukur@bpn.go.id',        // ← Email admin baru 2
  'supervisor@example.com'         // ← Email admin baru 3
];
```

4. **Restart server**:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

5. **User baru login** → Otomatis jadi admin! ✅

---

## 🔄 Metode 2: Update Role di Database (Untuk User yang Sudah Login)

Jika user **sudah pernah login** sebelumnya, role sudah tersimpan di database. Perlu di-update manual.

### Opsi A: Menggunakan MongoDB Compass (GUI - Recommended)

1. **Install MongoDB Compass** (jika belum ada):
   - Download: https://www.mongodb.com/try/download/compass

2. **Connect ke database**:
   - Connection string: `mongodb://localhost:27017/webgis-bpn`
   - Atau gunakan connection string dari `.env` jika pakai MongoDB Atlas

3. **Buka collection `users`**

4. **Cari user yang ingin jadi admin**:
   - Filter by email: `{ email: "email.user@gmail.com" }`

5. **Edit document**:
   - Klik pada document user
   - Edit field `role` dari `"user"` menjadi `"admin"`
   - Klik **Update**

6. **Selesai!** User sekarang jadi admin.

---

### Opsi B: Menggunakan MongoDB Shell (Command Line)

1. **Buka terminal** dan jalankan MongoDB shell:
   ```bash
   mongosh
   # Atau jika pakai MongoDB versi lama: mongo
   ```

2. **Connect ke database**:
   ```javascript
   use webgis-bpn
   ```

3. **Update role user**:
   ```javascript
   db.users.updateOne(
     { email: "email.user@gmail.com" },
     { $set: { role: "admin" } }
   )
   ```

4. **Verifikasi** (optional):
   ```javascript
   db.users.findOne({ email: "email.user@gmail.com" })
   ```
   Pastikan field `role` sudah menjadi `"admin"`

---

### Opsi C: Menggunakan Kode (Temporary - Auto Update)

Edit file `server/routes/auth.js`, pada bagian user yang sudah ada (sekitar baris 59), pastikan kode ini **tidak di-comment**:

```javascript
} else {
  // User sudah ada - update lastLogin dan role jika berubah
  user.lastLogin = new Date();
  // Update role jika email ada di whitelist admin
  const shouldBeAdmin = isAdminEmail(email);
  if (shouldBeAdmin && user.role !== 'admin') {
    user.role = 'admin';  // ← Pastikan baris ini aktif
  }
  await user.save();
}
```

**Langkah:**
1. Tambahkan email ke `ADMIN_EMAILS` (Metode 1)
2. Pastikan kode di atas aktif (tidak di-comment)
3. User login lagi → Role akan otomatis ter-update
4. Setelah berhasil, bisa comment lagi kode tersebut jika mau

---

## ✅ Verifikasi Admin

Setelah menambahkan admin:

1. **Login dengan email admin baru**
2. **Cek di sidebar** - harus muncul badge **"Admin"**
3. **Cek tombol** - harus muncul:
   - Tombol **"Add Data"**
   - Tombol **Edit** dan **Delete** di setiap layer

---

## 📋 Contoh Lengkap

### Tambahkan 3 Admin Baru:

**File: `server/routes/auth.js`**

```javascript
const ADMIN_EMAILS = [
  'naufalananda79@gmail.com',      // Admin yang sudah ada
  'kepala.bidang@bpn.go.id',       // Admin baru 1
  'petugas.ukur1@bpn.go.id',       // Admin baru 2
  'supervisor.ukur@bpn.go.id'      // Admin baru 3
];
```

Setelah restart server, semua email di atas akan jadi admin saat login.

---

## 🔍 Troubleshooting

### User sudah ditambahkan tapi tidak jadi admin?

1. **Cek apakah email sudah ada di `ADMIN_EMAILS`**
2. **Cek apakah server sudah di-restart** setelah edit
3. **Jika user sudah pernah login**, gunakan Metode 2 untuk update database

### User tidak muncul sebagai admin setelah login?

1. **Cek MongoDB** - pastikan field `role` = `"admin"`
2. **Clear browser cache** dan login lagi
3. **Cek console** untuk error

### Ingin hapus admin?

1. **Hapus email dari `ADMIN_EMAILS`** di `auth.js`
2. **Atau update di MongoDB**: `db.users.updateOne({ email: "..." }, { $set: { role: "user" } })`

---

## 💡 Tips

- **Gunakan Metode 1** untuk user baru (lebih mudah)
- **Gunakan Metode 2** untuk user yang sudah ada
- **Backup database** sebelum update manual
- **Dokumentasikan** email admin yang sudah ditambahkan

---

## 🆘 Butuh Bantuan?

Jika masih bermasalah:
1. Cek file `server/routes/auth.js` - pastikan syntax benar
2. Cek MongoDB - pastikan database terhubung
3. Cek server logs - lihat error di console

