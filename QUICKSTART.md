# Quick Start Guide - WebGIS BPN

## 🚀 Instalasi Cepat (5 Menit)

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Setup Environment Variables

**Root `.env`:**
```env
MONGODB_URI=mongodb://localhost:27017/webgis-bpn
PORT=5000
```

**Client `.env`:**
```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
REACT_APP_FIREBASE_PROJECT_ID=your_project_id_here
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
REACT_APP_FIREBASE_APP_ID=your_app_id_here
REACT_APP_API_URL=http://localhost:5000
```

### 3. Start MongoDB

**Local:**
```bash
# Windows (jika MongoDB service belum running)
net start MongoDB

# Mac/Linux
mongod
```

**Atau gunakan MongoDB Atlas** (cloud, gratis):
- Daftar di https://www.mongodb.com/cloud/atlas
- Buat cluster
- Copy connection string ke `MONGODB_URI`

### 4. Setup Firebase (5 menit)

1. Kunjungi https://console.firebase.google.com/
2. Buat project baru atau gunakan yang sudah ada
3. Klik **Authentication** > **Get Started**
4. Enable **Google** sign-in method
5. Klik **Project Settings** (icon gear) > **General**
6. Scroll ke "Your apps" > **Web app** (icon </>)
7. Copy config ke client `.env`

### 5. Jalankan Aplikasi

```bash
npm run dev
```

Aplikasi akan berjalan di:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

### 6. Login dan Test

1. Buka http://localhost:3000
2. Klik "Login dengan Google"
3. Pilih akun Google
4. Setelah login, Anda akan di-redirect ke peta

## 📤 Upload Layer Pertama

### Convert SHP ke GeoJSON

**Opsi 1: Online (Mudah)**
1. Kunjungi https://mapshaper.org/
2. Drag & drop file SHP (semua file .shp, .shx, .dbf, .prj)
3. Klik **Export** > pilih **GeoJSON**
4. Download file

**Opsi 2: Command Line**
```bash
# Install GDAL (jika belum ada)
# Windows: download dari https://trac.osgeo.org/osgeo4w/
# Mac: brew install gdal
# Linux: sudo apt-get install gdal-bin

ogr2ogr -f GeoJSON output.geojson input.shp
```

### Upload di Aplikasi

1. Login sebagai admin (email yang mengandung "admin" atau ubah role di MongoDB)
2. Klik tombol **"Add Data"**
3. Isi form:
   - Nama Layer: "Peta Bidang Contoh"
   - Jenis Layer: "Peta Bidang/Persil"
   - Pilih file GeoJSON
4. Klik **"Unggah"**
5. Setelah berhasil, layer akan muncul di sidebar
6. Klik layer untuk menampilkannya di peta

## 🎯 Fitur Utama

### Untuk User:
- ✅ Login dengan Google
- ✅ Tampilkan layer dari menu "Add Data"
- ✅ Klik pada bidang untuk melihat atribut
- ✅ Pencarian bidang berdasarkan NIB/nama
- ✅ GPS location
- ✅ Toggle basemap (Google Satellite / OpenStreetMap)

### Untuk Admin:
- ✅ Semua fitur user
- ✅ Upload layer baru (GeoJSON)
- ✅ Kelola daftar layer

## 🐛 Troubleshooting

### Error: Cannot connect to MongoDB
- Pastikan MongoDB running (local) atau connection string benar (Atlas)
- Check `.env` file sudah benar

### Error: Firebase auth tidak bekerja
- Pastikan Firebase config sudah benar
- Check Google Sign-In sudah di-enable di Firebase Console
- Check browser console untuk error detail

### Layer tidak muncul di peta
- Check layer sudah diaktifkan (ada centang di sidebar)
- Check browser console untuk errors
- Pastikan GeoJSON format valid

### Upload gagal
- Check ukuran file (max 50MB)
- Pastikan format file GeoJSON (.geojson atau .json)
- Check server/uploads folder ada dan writable

## 📚 Next Steps

- Lihat [README.md](README.md) untuk dokumentasi lengkap
- Lihat [DEPLOYMENT.md](DEPLOYMENT.md) untuk panduan deployment
- Customize warna layer di `client/src/components/Map.js`
- Tambahkan fitur sesuai kebutuhan

## 💡 Tips

1. **Test dengan data kecil dulu** sebelum upload file besar
2. **Validasi GeoJSON** di https://geojson.io/ sebelum upload
3. **Gunakan MongoDB Atlas** untuk production (gratis tier tersedia)
4. **Backup database** secara rutin
5. **Monitor file size** - file besar bisa lambat di-load

## 🆘 Butuh Bantuan?

- Check error di browser console (F12)
- Check server logs
- Pastikan semua dependencies terinstall
- Verify environment variables sudah benar

