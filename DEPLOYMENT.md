# Panduan Deployment WebGIS BPN

## 📋 Persiapan

### 1. Setup Firebase
1. Buat project baru di [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** > **Sign-in method** > **Google**
3. Dapatkan Firebase config dari **Project Settings** > **General** > **Your apps**
4. Copy config ke file `.env` di client

### 2. Setup MongoDB
**Opsi A: MongoDB Atlas (Recommended)**
1. Daftar di [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Buat cluster baru (gratis tersedia)
3. Whitelist IP address (0.0.0.0/0 untuk production atau IP server)
4. Buat database user
5. Dapatkan connection string

**Opsi B: MongoDB Local (Development)**
- Install MongoDB di local machine
- Connection string: `mongodb://localhost:27017/webgis-bpn`

## 🚀 Deployment Frontend ke Vercel

### Metode 1: Vercel CLI
```bash
cd client
npm install -g vercel
vercel login
vercel
```

### Metode 2: Vercel Dashboard
1. Push code ke GitHub
2. Login ke [Vercel](https://vercel.com)
3. Import project dari GitHub
4. Set root directory ke `client`
5. Set build command: `npm run build`
6. Set output directory: `build`
7. Add environment variables:
   - `REACT_APP_FIREBASE_API_KEY`
   - `REACT_APP_FIREBASE_AUTH_DOMAIN`
   - `REACT_APP_FIREBASE_PROJECT_ID`
   - `REACT_APP_FIREBASE_STORAGE_BUCKET`
   - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
   - `REACT_APP_FIREBASE_APP_ID`
   - `REACT_APP_API_URL` (URL backend production)

## 🖥️ Deployment Backend

### Opsi 1: Railway
1. Daftar di [Railway](https://railway.app)
2. New Project > Deploy from GitHub
3. Select repository
4. Add environment variables:
   - `MONGODB_URI`
   - `PORT` (auto-set)
   - `NODE_ENV=production`
5. Set start command: `node server/index.js`

### Opsi 2: Heroku
```bash
# Install Heroku CLI
npm install -g heroku-cli

# Login
heroku login

# Create app
heroku create webgis-bpn-api

# Add MongoDB Atlas
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Opsi 3: DigitalOcean / VPS
1. Setup Ubuntu server
2. Install Node.js dan MongoDB
3. Clone repository
4. Install dependencies
5. Setup PM2 atau systemd service
6. Setup Nginx sebagai reverse proxy
7. Setup SSL dengan Let's Encrypt

### Opsi 4: AWS / Google Cloud / Azure
- Follow platform-specific deployment guides
- Use managed MongoDB service (Atlas recommended)
- Setup load balancer if needed

## 🔧 Konfigurasi CORS

Pastikan backend mengizinkan request dari domain frontend:

```javascript
// server/index.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-app.vercel.app',
  credentials: true
}));
```

## 📝 Checklist Deployment

### Frontend
- [ ] Firebase config sudah di-set
- [ ] API URL backend sudah benar
- [ ] Build berhasil tanpa error
- [ ] Environment variables sudah di-set di Vercel
- [ ] Domain sudah dikonfigurasi (jika custom domain)

### Backend
- [ ] MongoDB connection string sudah benar
- [ ] CORS sudah dikonfigurasi
- [ ] Environment variables sudah di-set
- [ ] Upload folder (`server/uploads`) writable
- [ ] Server bisa diakses dari public
- [ ] Port sudah dikonfigurasi dengan benar

### Testing
- [ ] Login dengan Google berhasil
- [ ] Layer bisa di-fetch dari API
- [ ] Upload layer berhasil (admin)
- [ ] Map menampilkan layer dengan benar
- [ ] Popup atribut muncul saat klik
- [ ] Search berfungsi
- [ ] GPS location berfungsi

## 🔐 Security Considerations

1. **Environment Variables**: Jangan commit `.env` file
2. **MongoDB**: Gunakan strong password dan whitelist IP
3. **Firebase**: Restrict domain di Firebase Console
4. **CORS**: Hanya izinkan domain production
5. **File Upload**: Validasi file type dan size
6. **Rate Limiting**: Pertimbangkan untuk menambahkan rate limiting

## 📊 Monitoring

- Setup error tracking (Sentry, LogRocket)
- Monitor MongoDB Atlas metrics
- Monitor Vercel analytics
- Setup alerts untuk server downtime

## 🆘 Troubleshooting

### Frontend tidak bisa connect ke backend
- Check CORS settings
- Verify API URL di environment variables
- Check browser console untuk errors

### Upload gagal
- Verify upload folder permissions
- Check file size limits
- Verify MongoDB connection

### Map tidak menampilkan layer
- Check GeoJSON format valid
- Check API response di Network tab
- Verify layer sudah diaktifkan di sidebar

## 📞 Support

Untuk pertanyaan atau issues, buat issue di repository atau hubungi tim development.

