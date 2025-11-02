# 🚀 Panduan Hosting Gratis WebGIS BPN

Panduan lengkap untuk deploy aplikasi WebGIS BPN secara **gratis** menggunakan layanan cloud gratis.

## 📋 Opsi Deployment Gratis

### **Rekomendasi:**
- **Frontend**: Vercel (gratis, unlimited)
- **Backend**: Railway (gratis tier) atau Render (gratis tier)
- **Database**: MongoDB Atlas (gratis 512MB)

---

## 🎯 Metode 1: Vercel + Railway + MongoDB Atlas (Recommended)

### **Frontend ke Vercel**

#### 1. Persiapan
```bash
# Pastikan sudah di folder project
cd client
npm run build
```

#### 2. Deploy via Vercel Dashboard

1. **Daftar di Vercel**: https://vercel.com/signup
   - Bisa login dengan GitHub

2. **Push code ke GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/webgis-bpn.git
   git push -u origin main
   ```

3. **Import Project di Vercel**:
   - Login ke Vercel
   - Klik **"Add New Project"**
   - Pilih repository dari GitHub
   - **Root Directory**: pilih `client`
   - **Framework Preset**: React
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

4. **Tambahkan Environment Variables**:
   ```
   REACT_APP_FIREBASE_API_KEY=your_firebase_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_API_URL=https://your-backend.railway.app
   ```
   **⚠️ Penting**: Update `REACT_APP_API_URL` dengan URL backend setelah deploy backend!

5. **Deploy!**
   - Klik **Deploy**
   - Tunggu build selesai
   - Dapat URL: `https://your-app.vercel.app`

---

### **Backend ke Railway**

#### 1. Persiapan
Buat file `Procfile` di root folder:
```
web: node server/index.js
```

Atau buat `ecosystem.config.js` untuk PM2 (optional):
```javascript
module.exports = {
  apps: [{
    name: 'webgis-backend',
    script: 'server/index.js',
    instances: 1,
    autorestart: true,
    watch: false
  }]
};
```

#### 2. Deploy via Railway

1. **Daftar di Railway**: https://railway.app
   - Login dengan GitHub

2. **Buat Project Baru**:
   - Klik **"New Project"**
   - Pilih **"Deploy from GitHub repo"**
   - Pilih repository Anda

3. **Setup Service**:
   - Railway akan detect Node.js otomatis
   - **Root Directory**: biarkan kosong (root project)
   - **Start Command**: `node server/index.js`

4. **Tambahkan Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/webgis-bpn
   PORT=5000
   NODE_ENV=production
   ```
   **⚠️ Penting**: Gunakan MongoDB Atlas connection string!

5. **Setup MongoDB Atlas**:
   - Daftar: https://www.mongodb.com/cloud/atlas
   - Buat **Free Cluster** (M0)
   - **Create Database User**
   - **Network Access**: Add IP `0.0.0.0/0` (allow all untuk development)
   - **Get Connection String**: Copy connection string ke Railway env vars

6. **Deploy!**
   - Railway akan otomatis deploy
   - Dapat URL: `https://your-app.railway.app`
   - **Copy URL ini** dan update ke Vercel env var `REACT_APP_API_URL`

---

### **MongoDB Atlas Setup**

1. **Buat Account**: https://www.mongodb.com/cloud/atlas/register
2. **Create Free Cluster**:
   - Pilih **AWS** atau **Google Cloud**
   - Region: pilih yang terdekat (misal: Singapore)
   - **M0 Sandbox** (free)
3. **Security Setup**:
   - **Database Access**: Create user
   - **Network Access**: Add IP `0.0.0.0/0` (untuk development)
4. **Get Connection String**:
   - Klik **Connect** → **Connect your application**
   - Copy connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/webgis-bpn?retryWrites=true&w=majority`

---

## 🎯 Metode 2: Vercel + Render + MongoDB Atlas

### **Backend ke Render** (Alternatif Railway)

1. **Daftar di Render**: https://render.com
2. **New Web Service**:
   - Connect GitHub repo
   - **Root Directory**: biarkan kosong
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
3. **Environment Variables**: sama seperti Railway
4. **Free Plan**: 
   - ✅ Gratis selamanya
   - ⚠️ Sleep setelah 15 menit tidak aktif (wake up saat ada request)

---

## 🔧 Konfigurasi CORS

Setelah deploy, update CORS di backend:

**File: `server/index.js`**

```javascript
app.use(cors({
  origin: [
    'https://your-app.vercel.app',  // URL Vercel Anda
    'http://localhost:3000'         // Untuk development
  ],
  credentials: true
}));
```

---

## 📝 Checklist Deployment

### ✅ Frontend (Vercel)
- [ ] Code sudah di-push ke GitHub
- [ ] Project di-import ke Vercel
- [ ] Environment variables sudah di-set
- [ ] Build berhasil
- [ ] URL frontend sudah didapat

### ✅ Backend (Railway/Render)
- [ ] Project di-import ke Railway/Render
- [ ] Environment variables sudah di-set
- [ ] MongoDB Atlas connection string sudah benar
- [ ] Deploy berhasil
- [ ] URL backend sudah didapat
- [ ] Update `REACT_APP_API_URL` di Vercel

### ✅ MongoDB Atlas
- [ ] Cluster sudah dibuat
- [ ] Database user sudah dibuat
- [ ] Network access sudah di-set (0.0.0.0/0)
- [ ] Connection string sudah di-copy ke backend env

### ✅ Firebase
- [ ] Project Firebase sudah dibuat
- [ ] Google Authentication sudah di-enable
- [ ] Authorized domains sudah ditambahkan:
   - `localhost`
   - `your-app.vercel.app`
   - (di Firebase Console → Authentication → Settings → Authorized domains)

---

## 🔐 Update Firebase Authorized Domains

Setelah deploy frontend:

1. Buka **Firebase Console**
2. Pilih project Anda
3. **Authentication** → **Settings** → **Authorized domains**
4. **Add domain**: masukkan URL Vercel Anda
   - Contoh: `your-app.vercel.app`
5. **Save**

---

## 📤 Upload Folder Setup

Untuk production, pertimbangkan:

1. **Gunakan Cloud Storage** (disarankan):
   - Google Cloud Storage
   - AWS S3
   - Cloudinary

2. **Atau gunakan Railway/Render Persistent Storage**:
   - Railway: Mount volume untuk `/server/uploads`
   - Render: Gunakan disk storage

3. **Update `.gitignore`**:
   ```
   server/uploads/*
   !server/uploads/.gitkeep
   ```

---

## 🆓 Biaya & Limit Gratis

### **Vercel**
- ✅ Unlimited deployments
- ✅ Unlimited bandwidth
- ✅ Custom domain (opsional, gratis)
- ⚠️ Build time: 45 menit/bulan (cukup untuk development)

### **Railway**
- ✅ $5 credit gratis/bulan
- ✅ Bisa upgrade untuk lebih banyak resource
- ⚠️ Mungkin perlu upgrade jika traffic tinggi

### **Render**
- ✅ Gratis selamanya
- ✅ Unlimited deployments
- ⚠️ Sleep setelah 15 menit idle (wake up otomatis saat ada request)
- ⚠️ Build timeout: 10 menit

### **MongoDB Atlas**
- ✅ 512MB storage gratis
- ✅ Shared cluster (M0)
- ⚠️ Bisa upgrade jika butuh lebih banyak storage

---

## 🚀 Quick Start Deployment

### Langkah Cepat (15 menit):

1. **Setup MongoDB Atlas** (5 menit)
   - Buat cluster gratis
   - Dapat connection string

2. **Deploy Backend ke Railway** (5 menit)
   - Import repo
   - Set env vars (MONGODB_URI)
   - Deploy

3. **Deploy Frontend ke Vercel** (5 menit)
   - Import repo (folder client)
   - Set env vars (Firebase + API_URL backend)
   - Deploy

4. **Update Firebase** (2 menit)
   - Add authorized domain (URL Vercel)

---

## 🔍 Troubleshooting

### Frontend tidak bisa connect ke backend?
- ✅ Cek CORS settings di backend
- ✅ Pastikan `REACT_APP_API_URL` sudah benar di Vercel
- ✅ Redeploy frontend setelah update env vars

### MongoDB connection error?
- ✅ Pastikan IP sudah di-whitelist (0.0.0.0/0)
- ✅ Pastikan username/password benar
- ✅ Pastikan connection string format benar

### Upload file gagal?
- ✅ Cek disk space di Railway/Render
- ✅ Pertimbangkan gunakan cloud storage
- ✅ Cek file size limit (100MB sudah di-set)

### Firebase auth tidak bekerja di production?
- ✅ Pastikan authorized domain sudah ditambahkan
- ✅ Pastikan Firebase config sudah benar
- ✅ Clear browser cache

---

## 📚 Referensi

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com

---

## 💡 Tips

1. **Custom Domain** (Opsional):
   - Vercel: tambahkan custom domain gratis
   - Update Firebase authorized domains dengan custom domain

2. **Monitoring**:
   - Gunakan Railway/Render logs untuk monitor backend
   - Vercel analytics untuk monitor frontend

3. **Backup**:
   - Backup MongoDB secara rutin
   - Export data penting secara manual

4. **Performance**:
   - Enable Vercel CDN (otomatis)
   - Optimize GeoJSON files (gunakan mapshaper untuk simplify)

---

## 🎉 Selesai!

Setelah semua setup, aplikasi Anda akan:
- ✅ Online dan bisa diakses publik
- ✅ URL: `https://your-app.vercel.app`
- ✅ Gratis selamanya (dengan limit yang reasonable)

Selamat deploy! 🚀

