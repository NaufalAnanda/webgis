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
  'Kawasan Hutan',      // Baru
  'Batas Desa',        // Baru
  'Peta Pendaftaran',  // Baru
  'Peta Ajudikasi',    // Baru
  'Peta Rutin'         // Baru
];

function EditLayerDialog({ open, layer, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    type: '', // Default diubah ke nilai valid pertama
    description: '',
    tahun: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Generate nama layer otomatis berdasarkan type dan tahun
  const generateLayerName = (type, tahun) => {
    if (type === 'Peta Ajudikasi' && tahun) {
      return `Peta Ajudikasi ${tahun}`;
    }
    return type;
  };

  useEffect(() => {
    if (layer && open) {
      setFormData({
        type: layer.type || '', 
        description: layer.description || '',
        tahun: layer.tahun ? layer.tahun.toString() : ''
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

    setLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/api/layers/${layer._id}`,
        {
          ...formData,
          name: layerName
        }
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
            disabled={loading}
            helperText="Pilih jenis layer yang sesuai"
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
              disabled={loading}
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
            disabled={loading || !formData.type || (formData.type === 'Peta Ajudikasi' && !formData.tahun)}
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditLayerDialog;