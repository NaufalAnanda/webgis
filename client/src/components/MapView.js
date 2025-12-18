import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, CircularProgress, Alert } from '@mui/material';
import Sidebar from './Sidebar';
import Map from './Map';
import LayerUpload from './LayerUpload';
import EditLayerDialog from './EditLayerDialog';
import SearchBar from './SearchBar'; 
import { useAuth } from '../contexts/AuthContext';
import API_URL from '../config/api';

function MapView() {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  
  // --- STATE MANAGEMENT ---
  const [layers, setLayers] = useState([]);
  const [activeLayers, setActiveLayers] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedLayerToEdit, setSelectedLayerToEdit] = useState(null);
  
  // --- FETCH DATA ---
  const fetchLayers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/layers`);
      setLayers(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching layers:', err);
      setError('Gagal mengambil data layer.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLayers();
  }, []);

  // --- HANDLERS ---
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Gagal logout:", error);
      alert("Gagal logout, silakan coba lagi.");
    }
  };

  const handleLayerToggle = (layerId) => {
    setActiveLayers(prev => {
      if (prev.includes(layerId)) {
        return prev.filter(id => id !== layerId);
      } else {
        return [...prev, layerId];
      }
    });
  };

  const handleUploadSuccess = () => {
    fetchLayers();
    setShowUploadDialog(false);
  };

  const handleEditLayer = (layer) => {
    setSelectedLayerToEdit(layer);
    setShowEditDialog(true);
  };

  const handleEditSuccess = () => {
    fetchLayers();
    setShowEditDialog(false);
    setSelectedLayerToEdit(null);
  };

  const handleDeleteLayer = async (layer) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus layer "${layer.name}"?`)) {
      try {
        await axios.delete(`${API_URL}/api/layers/${layer._id}`);
        setActiveLayers(prev => prev.filter(id => id !== layer._id));
        fetchLayers();
      } catch (err) {
        alert('Gagal menghapus layer');
      }
    }
  };

  const handleFeatureSelect = (feature) => {
    setSelectedFeature(feature);
  };

  // --- RENDER ---
  if (loading && layers.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      <Sidebar
        layers={layers}
        activeLayers={activeLayers}
        onLayerToggle={handleLayerToggle}
        onAddData={() => setShowUploadDialog(true)}
        currentUser={currentUser}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        onEditLayer={handleEditLayer}
        onDeleteLayer={handleDeleteLayer}
      />

      <main style={{ flexGrow: 1, position: 'relative' }}>
        {error && (
          <Alert severity="error" sx={{ position: 'absolute', top: 10, right: 10, zIndex: 9999 }}>
            {error}
          </Alert>
        )}

        {/* --- TAMBAHAN: SEARCH BAR DI SINI --- */}
        <SearchBar 
          activeLayers={activeLayers} 
          onFeatureSelect={handleFeatureSelect} 
        />

        <Map
          layers={layers}
          activeLayers={activeLayers}
          selectedFeature={selectedFeature}
          onFeatureSelect={handleFeatureSelect}
        />
      </main>

      {showUploadDialog && (
        <LayerUpload
          onClose={() => setShowUploadDialog(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}

      {showEditDialog && selectedLayerToEdit && (
        <EditLayerDialog
          open={showEditDialog}
          layer={selectedLayerToEdit}
          onClose={() => setShowEditDialog(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}

export default MapView;