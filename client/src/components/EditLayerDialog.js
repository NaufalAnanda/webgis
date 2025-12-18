import React, { useState, useEffect } from 'react';
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
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';
import API_URL from '../config/api';

// Update jenis layer sesuai Database
const layerTypes = [
  'LSD',
  'LP2B',
  'RTRW',
  'RDTR',
  'ZNT',
  'Garis Pantai',      // Baru
  'Hutan Hijau',      // Baru
  'Batas Desa',        // Baru
  'Peta Pendaftaran',  // Baru
  'Peta Ajudikasi',    // Baru
  'Peta Rutin'         // Baru
];

function EditLayerDialog({ open, layer, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    type: '', // Default diubah ke nilai valid pertama
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (layer && open) {
      setFormData({
        name: layer.name || '',
        // Jika data lama masih 'Lainnya', select akan kosong memaksa user memilih tipe baru yang valid
        type: layer.type || 'Peta Bidang/Persil', 
        description: layer.description || ''
      });
      setError('');
    }
  }, [layer, open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Nama layer harus diisi');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/api/layers/${layer._id}`,
        formData
      );

      setLoading(false);
      if (onSuccess) {
        onSuccess(response.data);
      }
      onClose();
    } catch (error) {
      console.error('Update layer error:', error);
      setError(error.response?.data?.error || 'Gagal mengupdate layer. Silakan coba lagi.');
      setLoading(false);
    }
  };

  if (!layer) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Edit Layer</Typography>
          <Button
            icon="true"
            onClick={onClose}
            disabled={loading}
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

          <TextField
            fullWidth
            label="Nama Layer"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            margin="normal"
            disabled={loading}
          />

          <TextField
            fullWidth
            select
            label="Jenis Layer"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
            margin="normal"
            disabled={loading}
            helperText="Pilih jenis layer yang sesuai"
          >
            {layerTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Deskripsi (Opsional)"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={3}
            disabled={loading}
          />

          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              File: {layer.fileName} ({(layer.fileSize / 1024 / 1024).toFixed(2)} MB)
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              Fitur: {layer.metadata?.featureCount || 0}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading || !formData.name}
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditLayerDialog;