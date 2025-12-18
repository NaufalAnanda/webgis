import React, { useState } from 'react';
import {
  Drawer, Box, Typography, Button, List, ListItem, ListItemButton,
  ListItemText, IconButton, Chip, Divider, Avatar, Menu, MenuItem,
  FormControl, Select, InputLabel
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './Sidebar.css';

// SKEMA WARNA BARU
const layerTypeColors = {
  'LSD': '#FFFF00',              // Kuning
  'LP2B': '#FF0000',             // Merah
  'Peta Pendaftaran': '#9C27B0', // Ungu
  'Batas Desa': '#808080',       // Abu
  'Hutan Hijau': '#008000',      // Hijau (Baru)
  'Garis Pantai': '#0000FF',     // Biru
  'RTRW': '#FFA500',             // Oranye Terang
  'ZNT': '#00FFFF',              // Cyan
  'RDTR': '#FF4500',             // Oranye Gelap (Orange Red)
  'Peta Ajudikasi': '#8B4513',   // Coklat
  'Peta Rutin': '#FFFFFF',       // Putih
  'Lainnya': '#FFFDD0'
};

function Sidebar({
  layers, activeLayers, onLayerToggle, onAddData,
  currentUser, onLogout, isAdmin, onEditLayer, onDeleteLayer
}) {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterType, setFilterType] = useState('all');

  const filteredLayers = filterType === 'all'
    ? layers
    : layers.filter(layer => layer.type === filterType);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Helper untuk mendapatkan warna text (agar kontras dengan background chip)
  const getTextColor = (hexColor) => {
    // Putih dan Cream butuh teks hitam, sisanya teks putih
    if (hexColor === '#FFFFFF' || hexColor === '#FFFDD0' || hexColor === '#FFFF00') return '#000000';
    return '#FFFFFF';
  };

  return (
    <>
      {!open && (
        <IconButton
          className="sidebar-toggle"
          onClick={() => setOpen(true)}
          sx={{ position: 'fixed', left: 10, top: 10, zIndex: 1000, bgcolor: 'white', boxShadow: 2 }}
        >
          <MenuIcon />
        </IconButton>
      )}
      
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        variant="persistent"
        PaperProps={{
          sx: { width: { xs: '280px', sm: '320px' }, top: 0, height: '100vh', position: 'relative' }
        }}
      >
        <Box className="sidebar-content">
          <Box className="sidebar-header">
            <Typography variant="h6">WebGIS BPN</Typography>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ display: { xs: 'flex', sm: 'none' } }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />

          {/* User Info */}
          <Box className="user-section">
            <Avatar src={currentUser?.photoURL} sx={{ width: 40, height: 40 }}>
              {currentUser?.displayName?.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1, ml: 1 }}>
              <Typography variant="body2" fontWeight="bold">{currentUser?.displayName || 'User'}</Typography>
              <Typography variant="caption" color="text.secondary">{currentUser?.email}</Typography>
              {isAdmin && <Chip label="Admin" size="small" color="primary" sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }} />}
            </Box>
            <IconButton size="small" onClick={handleMenuOpen}><MenuIcon /></IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={() => { handleMenuClose(); onLogout(); }}>
                <LogoutIcon sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
          <Divider sx={{ my: 1 }} />

          {isAdmin && (
            <Box sx={{ p: 2 }}>
              <Button variant="contained" fullWidth startIcon={<AddIcon />} onClick={onAddData} sx={{ mb: 2 }}>
                Add Data
              </Button>
            </Box>
          )}

          <Box sx={{ p: 2, pt: isAdmin ? 0 : 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter Layer</InputLabel>
              <Select value={filterType} label="Filter Layer" onChange={(e) => setFilterType(e.target.value)}>
                <MenuItem value="all">Semua Layer</MenuItem>
                {Object.keys(layerTypeColors).map(type => (
                   <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Divider />

          <Box className="layer-list-container">
            <Typography variant="subtitle2" sx={{ p: 2, pb: 1, fontWeight: 'bold' }}>
              Daftar Layer ({filteredLayers.length})
            </Typography>
            <List dense>
              {filteredLayers.length === 0 ? (
                <ListItem><ListItemText primary="Tidak ada layer" /></ListItem>
              ) : (
                filteredLayers.map((layer) => {
                  const color = layerTypeColors[layer.type] || layerTypeColors['Lainnya'];
                  return (
                    <ListItem 
                      key={layer._id} 
                      disablePadding
                      secondaryAction={isAdmin ? (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEditLayer(layer); }} sx={{ color: 'primary.main' }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDeleteLayer(layer); }} sx={{ color: 'error.main' }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ) : null}
                    >
                      <ListItemButton onClick={() => onLayerToggle(layer._id)} selected={activeLayers.includes(layer._id)}>
                        <Box sx={{ mr: 1 }}>
                          {activeLayers.includes(layer._id) ? (
                            <CheckCircleIcon sx={{ color: color }} />
                          ) : (
                            <RadioButtonUncheckedIcon />
                          )}
                        </Box>
                        <ListItemText
                          primary={layer.name}
                          secondary={
                            <Box>
                              <Chip
                                label={layer.type}
                                size="small"
                                sx={{
                                  height: 18, fontSize: '0.65rem', mb: 0.5,
                                  bgcolor: color,
                                  color: getTextColor(color),
                                  border: color === '#FFFFFF' ? '1px solid #ccc' : 'none'
                                }}
                              />
                              <Typography variant="caption" display="block" color="text.secondary">
                                {layer.metadata?.featureCount || 0} fitur
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })
              )}
            </List>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

export default Sidebar;