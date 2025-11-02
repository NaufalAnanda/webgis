# WebGIS BPN - Peta Kerja Petugas Ukur

Aplikasi WebGIS berbasis Leaflet.js dan React.js untuk menampilkan dan mengelola layer data bidang tanah (SHP/GeoJSON) untuk petugas ukur BPN.

## 🚀 Fitur Utama

### Autentikasi
- ✅ Login wajib menggunakan akun Google (Firebase Authentication)
- ✅ Hanya user yang login dapat mengakses peta
- ✅ Sistem role: Admin dan User

### Basemap
- ✅ Google Satellite Imagery sebagai basemap utama
- ✅ Opsi OpenStreetMap sebagai alternatif
- ✅ Toggle untuk beralih antara basemap

### Manajemen Layer (Admin)
- ✅ Upload file GeoJSON (dari konversi SHP)
- ✅ Dukungan berbagai jenis layer:
  - Peta Bidang/Persil
  - LSD (Lahan Sawah Dilindungi)
  - LP2B (Lahan Pertanian Pangan Berkelanjutan)
  - RTRW / RDTR
  - ZNT (Zona Nilai Tanah)
  - Layer tambahan lainnya
- ✅ Data tersimpan di database MongoDB
- ✅ Daftar layer terorganisir dengan filter

### Tampilan Peta (User/Petugas)
- ✅ Menu "Add Data" untuk memilih layer yang ingin ditampilkan
- ✅ Popup atribut lengkap saat klik pada bidang/poligon
- ✅ Highlighting pada hover
- ✅ Warna berbeda untuk setiap jenis layer
- ✅ Pencarian bidang berdasarkan NIB, nama pemilik, atau atribut lainnya
- ✅ GPS location untuk menampilkan posisi pengguna
- ✅ Responsif dan mobile-friendly

## 🛠️ Teknologi yang Digunakan

### Frontend
- **React.js** 18.2.0 - UI Framework
- **Leaflet.js** 1.9.4 - Mapping library
- **React-Leaflet** 4.2.1 - React bindings for Leaflet
- **Material-UI** 5.15.0 - UI Components
- **Firebase Auth** - Google OAuth2 authentication
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** dengan Mongoose - Database
- **Multer** - File upload handling

## 📋 Prerequisites

Sebelum memulai, pastikan Anda sudah menginstal:
- Node.js (v14 atau lebih baru)
- MongoDB (local atau MongoDB Atlas)
- Akun Google untuk Firebase Authentication

## 🔧 Instalasi

### 1. Clone repository atau buat folder project

```bash
mkdir webgis-bpn
cd webgis-bpn
```

### 2. Install dependencies

```bash
# Install dependencies untuk root (server)
npm install

# Install dependencies untuk client
cd client
npm install
cd ..
```

### 3. Setup Firebase

1. Buat project di [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication dengan Google Provider
3. Dapatkan Firebase config dari Project Settings > General > Your apps
4. Salin `.env.example` menjadi `.env` di root dan `client/.env`:
   - Root `.env` untuk MongoDB connection
   - `client/.env` untuk Firebase config

**Root `.env`:**
```
MONGODB_URI=mongodb://localhost:27017/webgis-bpn
PORT=5000
```

**Client `.env`:**
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 4. Setup MongoDB

**Opsi 1: MongoDB Local**
```bash
# Install MongoDB lokal atau gunakan MongoDB Atlas (cloud)
# Pastikan MongoDB berjalan di localhost:27017
```

**Opsi 2: MongoDB Atlas (Recommended untuk production)**
- Buat akun di [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Buat cluster baru
- Dapatkan connection string
- Update `MONGODB_URI` di `.env`

### 5. Setup Admin User

Untuk membuat user sebagai admin, edit field `role` di MongoDB menjadi `'admin'` atau gunakan email yang mengandung 'admin' saat registrasi pertama kali (otomatis).

## 🚀 Menjalankan Aplikasi

### Development Mode

Jalankan server dan client secara bersamaan:

```bash
npm run dev
```

Atau jalankan secara terpisah:

```bash
# Terminal 1 - Backend Server
npm run server

# Terminal 2 - Frontend Client
npm run client
```

Aplikasi akan berjalan di:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Production Build

```bash
# Build React app
npm run build

# Server akan serve static files dari client/build
# Atau deploy terpisah:
# - Frontend: Vercel
# - Backend: Heroku, Railway, atau VPS
```

## 📁 Struktur Project

```
webgis-bpn/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Map.js
│   │   │   ├── MapView.js
│   │   │   ├── Sidebar.js
│   │   │   ├── Login.js
│   │   │   ├── LayerUpload.js
│   │   │   └── SearchBar.js
│   │   ├── contexts/      # Context providers
│   │   │   └── AuthContext.js
│   │   ├── config/        # Configuration
│   │   │   └── firebase.js
│   │   └── App.js
│   └── package.json
├── server/                 # Express backend
│   ├── models/           # Mongoose models
│   │   ├── Layer.js
│   │   └── User.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── layers.js
│   │   └── geodata.js
│   ├── uploads/          # Uploaded GeoJSON files
│   └── index.js          # Server entry point
├── .env                   # Environment variables (server)
├── .gitignore
└── package.json
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/verify` - Verify user dan create/update user record

### Layers
- `GET /api/layers` - Get all active layers
- `GET /api/layers/:id` - Get layer by ID
- `POST /api/layers` - Create new layer (admin only, requires file upload)
- `DELETE /api/layers/:id` - Delete layer (admin only)

### Geodata
- `GET /api/geodata/:id` - Get GeoJSON data for a layer

## 📤 Mengunggah Layer

### Konversi SHP ke GeoJSON

Sebelum mengunggah, file SHP harus dikonversi ke GeoJSON terlebih dahulu. Beberapa tools yang bisa digunakan:

1. **Online Converter:**
   - [mapshaper.org](https://mapshaper.org/)
   - [ogre.adc4gis.com](https://ogre.adc4gis.com/)

2. **Command Line (GDAL/OGR2OGR):**
   ```bash
   ogr2ogr -f GeoJSON output.geojson input.shp
   ```

3. **Python (Fiona/GeoPandas):**
   ```python
   import geopandas as gpd
   gdf = gpd.read_file('input.shp')
   gdf.to_file('output.geojson', driver='GeoJSON')
   ```

### Upload melalui UI

1. Login sebagai admin
2. Klik tombol "Add Data"
3. Isi form:
   - Nama Layer
   - Jenis Layer
   - Deskripsi (opsional)
   - Pilih file GeoJSON
4. Klik "Unggah"

## 🚢 Deployment

### Frontend ke Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   cd client
   vercel
   ```

3. Setup environment variables di Vercel dashboard:
   - Semua `REACT_APP_*` variables

### Backend ke Heroku/Railway/VPS

**Heroku:**
```bash
heroku create webgis-bpn-api
heroku addons:create mongolab
git push heroku main
```

**Railway:**
- Connect GitHub repo
- Setup MongoDB Atlas connection string
- Deploy automatically

**Environment Variables untuk Production:**
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Port untuk server (biasanya otomatis)

### Update API URL

Setelah deploy backend, update API URL di `client/src/components/MapView.js`, `Map.js`, dan `LayerUpload.js`:

```javascript
// Ganti localhost:5000 dengan production URL
const API_URL = process.env.REACT_APP_API_URL || 'https://your-api.herokuapp.com';
```

## 📱 Fitur Mobile

Aplikasi sudah responsive dan dapat digunakan di perangkat mobile dengan fitur:
- Sidebar yang dapat di-toggle
- Touch-friendly controls
- GPS location support
- Optimized map controls

## 🐛 Troubleshooting

### Problem: Firebase Auth tidak bekerja
- Pastikan Firebase config sudah benar di `.env`
- Pastikan Google Sign-In sudah di-enable di Firebase Console
- Check browser console untuk error messages

### Problem: File upload gagal
- Pastikan file format GeoJSON valid
- Check ukuran file (max 50MB)
- Pastikan server/uploads folder ada dan writable

### Problem: Layer tidak muncul di peta
- Check apakah layer aktif di sidebar
- Check browser console untuk errors
- Pastikan GeoJSON valid dan memiliki features

### Problem: MongoDB connection error
- Pastikan MongoDB running (local) atau connection string benar (Atlas)
- Check firewall settings untuk MongoDB Atlas

## 📝 Catatan

- File SHP harus dikonversi ke GeoJSON sebelum upload
- Untuk production, gunakan MongoDB Atlas atau hosted database
- Pastikan CORS settings di backend sesuai dengan frontend URL
- Google Satellite tiles mungkin memiliki usage limits untuk production

## 📄 License

ISC

## 👤 Author

Dibuat untuk keperluan peta kerja petugas ukur BPN.

## 🙏 Acknowledgments

- Leaflet.js untuk mapping library
- Firebase untuk authentication
- Material-UI untuk UI components

