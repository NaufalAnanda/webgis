import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  LinearProgress,
  Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import API_URL from '../config/api';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const layerTypes = [
  'LSD',
  'LP2B',
  'RTRW',
  'RDTR',
  'ZNT',
  'Garis Pantai',
  'Kawasan Hutan',
  'Batas Desa',
  'Peta Pendaftaran',
  'Peta Ajudikasi',
  'Peta Rutin'
];

function LayerUpload({ onClose, onUploadSuccess }) {
  const { userData } = useAuth();
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    tahun: ''
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Generate nama layer otomatis berdasarkan type dan tahun
  const generateLayerName = (type, tahun) => {
    if (type === 'Peta Ajudikasi' && tahun) {
      return `Peta Ajudikasi ${tahun}`;
    }
    return type;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.toLowerCase().split('.').pop();
      if (ext !== 'geojson' && ext !== 'json') {
        setError('Hanya file GeoJSON yang didukung (.geojson atau .json)');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Pilih file GeoJSON terlebih dahulu');
      return;
    }

    if (!formData.type) {
      setError('Jenis layer harus diisi');
      return;
    }

    // Validate tahun untuk Peta Ajudikasi
    if (formData.type === 'Peta Ajudikasi' && !formData.tahun) {
      setError('Tahun harus diisi untuk Peta Ajudikasi');
      return;
    }

    // Generate nama layer otomatis
    const layerName = generateLayerName(formData.type, formData.tahun);

    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('name', layerName);
    uploadData.append('type', formData.type);
    uploadData.append('description', formData.description);
    uploadData.append('createdBy', userData?.uid || '');
    if (formData.tahun) {
      uploadData.append('tahun', formData.tahun);
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      await axios.post(
        `${API_URL}/api/layers`,
        uploadData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 90) / progressEvent.total
            );
            clearInterval(progressInterval);
            setUploadProgress(progress);
          }
        }
      );

      setUploadProgress(100);
      setTimeout(() => {
        setUploading(false);
        onUploadSuccess();
      }, 500);
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.error || 'Gagal mengunggah layer. Silakan coba lagi.');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { minHeight: '400px' }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Tambah Layer Baru</Typography>
          <Button
            icon
            onClick={onClose}
            disabled={uploading}
            sx={{ minWidth: 'auto', p: 1 }}
          >
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {uploading && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Mengunggah... {uploadProgress}%
              </Typography>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </Box>
          )}

          <TextField
            fullWidth
            select
            label="Jenis Layer"
            name="type"
            value={formData.type}
            onChange={(e) => {
              handleInputChange(e);
              // Reset tahun ketika type berubah
              if (e.target.value !== 'Peta Ajudikasi') {
                setFormData(prev => ({ ...prev, tahun: '' }));
              }
            }}
            required
            margin="normal"
            disabled={uploading}
            helperText="Pilih kategori layer"
          >
            {layerTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          {formData.type === 'Peta Ajudikasi' && (
            <TextField
              fullWidth
              select
              label="Tahun"
              name="tahun"
              value={formData.tahun}
              onChange={handleInputChange}
              required
              margin="normal"
              disabled={uploading}
              helperText="Pilih tahun untuk Peta Ajudikasi"
            >
              <MenuItem value="2016">2016</MenuItem>
              <MenuItem value="2017">2017</MenuItem>
              <MenuItem value="2018">2018</MenuItem>
              <MenuItem value="2019">2019</MenuItem>
            </TextField>
          )}

          <TextField
            fullWidth
            label="Deskripsi (Opsional)"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={3}
            disabled={uploading}
          />

          <Box sx={{ mt: 2 }}>
            <input
              accept=".geojson,.json"
              style={{ display: 'none' }}
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <label htmlFor="file-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                fullWidth
                disabled={uploading}
                sx={{ py: 1.5 }}
              >
                {file ? file.name : 'Pilih File GeoJSON'}
              </Button>
            </label>
            {file && (
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                Ukuran: {(file.size / 2048 / 2048).toFixed(2)} MB
              </Typography>
            )}
          </Box>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Catatan:</strong> Pastikan file GeoJSON valid. File SHP harus dikonversi ke GeoJSON terlebih dahulu.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={uploading}>
            Batal
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={uploading || !file || !formData.type || (formData.type === 'Peta Ajudikasi' && !formData.tahun)}
          >
            {uploading ? 'Mengunggah...' : 'Unggah'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default LayerUpload;

