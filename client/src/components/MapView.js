import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Map from './Map';
import Sidebar from './Sidebar';
import LayerUpload from './LayerUpload';
import EditLayerDialog from './EditLayerDialog';
import SearchBar from './SearchBar';
import API_URL from '../config/api';
import './MapView.css';

function MapView() {
  const navigate = useNavigate();
  const { currentUser, userData, logout } = useAuth();
  const [layers, setLayers] = useState([]);
  const [activeLayers, setActiveLayers] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [editingLayer, setEditingLayer] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    fetchLayers();
  }, []);

  const fetchLayers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/layers`);
      const data = await response.json();
      setLayers(data);
    } catch (error) {
      console.error('Error fetching layers:', error);
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleEditLayer = (layer) => {
    setEditingLayer(layer);
  };

  const handleDeleteLayer = async (layer) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus layer "${layer.name}"?\n\nFile dan data layer akan dihapus permanen.`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/layers/${layer._id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Remove from active layers if active
        setActiveLayers(prev => prev.filter(id => id !== layer._id));
        // Refresh layers list
        fetchLayers();
        alert('Layer berhasil dihapus');
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal menghapus layer');
      }
    } catch (error) {
      console.error('Delete layer error:', error);
      alert('Gagal menghapus layer. Silakan coba lagi.');
    }
  };

  const handleEditSuccess = () => {
    fetchLayers();
    setEditingLayer(null);
  };

  if (!currentUser) {
    return null;
  }

  const isAdmin = userData?.role === 'admin';

  return (
    <div className="map-view">
      <Sidebar
        layers={layers}
        activeLayers={activeLayers}
        onLayerToggle={handleLayerToggle}
        onAddData={() => setShowUpload(true)}
        currentUser={userData}
        onLogout={handleLogout}
        isAdmin={isAdmin}
        onEditLayer={handleEditLayer}
        onDeleteLayer={handleDeleteLayer}
      />
      <Map 
        activeLayers={activeLayers}
        selectedFeature={selectedFeature}
        onFeatureSelect={setSelectedFeature}
      />
      {activeLayers.length > 0 && (
        <SearchBar
          onFeatureSelect={(feature) => {
            setSelectedFeature(feature);
          }}
          activeLayers={activeLayers}
        />
      )}
      {isAdmin && showUpload && (
        <LayerUpload
          onClose={() => setShowUpload(false)}
          onUploadSuccess={() => {
            setShowUpload(false);
            fetchLayers();
          }}
        />
      )}
      {isAdmin && editingLayer && (
        <EditLayerDialog
          open={!!editingLayer}
          layer={editingLayer}
          onClose={() => setEditingLayer(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}

export default MapView;

