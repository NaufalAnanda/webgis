import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import API_URL from '../config/api';
import './Map.css';

// Fix icon marker leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Layer Google Satellite
const GoogleSatelliteLayer = () => {
  return (
    <TileLayer
      url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
      attribution="&copy; Google"
      maxZoom={20}
    />
  );
};

// Komponen Pengontrol Peta
const MapController = ({ activeLayers, selectedFeature, userLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (activeLayers.length > 0) {
      map.invalidateSize();
    }
  }, [activeLayers, map]);

  useEffect(() => {
    if (selectedFeature && selectedFeature.geometry) {
      const layer = L.geoJSON(selectedFeature);
      map.fitBounds(layer.getBounds(), { padding: [50, 50] });
    }
  }, [selectedFeature, map]);

  useEffect(() => {
    if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 15);
    }
  }, [userLocation, map]);

  return null;
};

// Marker Lokasi GPS
const LocationMarker = ({ position }) => {
  if (!position) return null;
  const icon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
  });
  return (
    <Marker position={position} icon={icon}>
      <Popup>Lokasi Anda</Popup>
    </Marker>
  );
};

// --- KOMPONEN UTAMA MAP ---
// PENTING: Tambahkan prop 'layers' di sini
function Map({ layers, activeLayers, selectedFeature, onFeatureSelect }) {
  const [geodataMap, setGeodataMap] = useState({});
  const [userLocation, setUserLocation] = useState(null);
  const [showOSM, setShowOSM] = useState(false);
  const mapRef = useRef(null);
  const selectedFeatureRef = useRef(selectedFeature);
  
  useEffect(() => {
    selectedFeatureRef.current = selectedFeature;
  }, [selectedFeature]);

  // Fetch GeoJSON
  useEffect(() => {
    activeLayers.forEach(async (layerId) => {
      if (!geodataMap[layerId]) {
        try {
          const response = await axios.get(`${API_URL}/api/geodata/${layerId}`);
          setGeodataMap(prev => ({ ...prev, [layerId]: response.data }));
        } catch (error) {
          console.error(`Error fetching geodata for layer ${layerId}:`, error);
        }
      }
    });
  }, [activeLayers, geodataMap]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error loc:', error);
          alert('Gagal mengambil lokasi GPS.');
        }
      );
    } else {
      alert('Browser tidak mendukung geolocation.');
    }
  };

  // --- SKEMA WARNA (Sesuai Request) ---
  const getStyle = (feature, type) => {
    // Default Style (Cream)
    let style = { color: '#FFFDD0', fillColor: '#FFFDD0', fillOpacity: 0.4, weight: 2 };

    switch (type) {
      case 'LSD':
        style = { color: '#FFFF00', fillColor: '#FFFF00', fillOpacity: 0.5 }; // Kuning
        break;
      case 'LP2B':
        style = { color: '#FF0000', fillColor: '#FF0000', fillOpacity: 0.4 }; // Merah
        break;
      case 'Peta Pendaftaran':
        style = { color: '#9C27B0', fillColor: '#9C27B0', fillOpacity: 0.4 }; // Ungu
        break;
      case 'Batas Desa':
        style = { color: '#808080', fillColor: '#808080', fillOpacity: 0.4 }; // Abu
        break;
      case 'Hutan Hijau':
        style = { color: '#008000', fillColor: '#008000', fillOpacity: 0.4 }; // Hijau
        break;
      case 'Garis Pantai':
        style = { color: '#0000FF', fillColor: '#0000FF', fillOpacity: 0.6 }; // Biru
        break;
      case 'RTRW':
        style = { color: '#FFA500', fillColor: '#FFA500', fillOpacity: 0.4 }; // Oranye Terang
        break;
      case 'ZNT':
        style = { color: '#00FFFF', fillColor: '#00FFFF', fillOpacity: 0.4 }; // Cyan
        break;
      case 'RDTR':
        style = { color: '#FF4500', fillColor: '#FF4500', fillOpacity: 0.4 }; // Oranye Gelap
        break;
      case 'Peta Ajudikasi':
        style = { color: '#8B4513', fillColor: '#8B4513', fillOpacity: 0.4 }; // Coklat
        break;
      case 'Peta Rutin':
        style = { color: '#FFFFFF', fillColor: '#FFFFFF', fillOpacity: 0.5 }; // Putih
        break;
      default:
        // Cream untuk Lainnya
        style = { color: '#FFFDD0', fillColor: '#FFFDD0', fillOpacity: 0.4 }; 
        break;
    }
    return style;
  };

  const onEachFeature = (feature, layer, type) => {
    // Simpan style dasar agar bisa dikembalikan setelah hover
    const baseStyle = getStyle(feature, type);
    layer._baseStyle = baseStyle;
    
    // Popup Info
    if (feature.properties) {
      const props = feature.properties;
      let popupContent = `<div style="max-width:250px"><h3>${type}</h3><table>`;
      Object.keys(props).forEach(key => {
        if (props[key]) {
          popupContent += `<tr><td><b>${key}</b></td><td>${props[key]}</td></tr>`;
        }
      });
      popupContent += '</table></div>';
      layer.bindPopup(popupContent);
    }

    // Hover Effect
    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({ weight: 4, fillOpacity: 0.7 });
      },
      mouseout: (e) => {
        const l = e.target;
        // Cek apakah fitur ini sedang dipilih
        const isSelected = selectedFeatureRef.current && selectedFeatureRef.current.properties === feature.properties;
        if (!isSelected) {
          l.setStyle(l._baseStyle);
        }
      },
      click: () => {
        if (onFeatureSelect) onFeatureSelect(feature);
      }
    });
  };

  return (
    <div className="map-container">
      <MapContainer center={[-6.2088, 106.8456]} zoom={12} style={{ height: '100%', width: '100%' }} ref={mapRef}>
        {!showOSM && <GoogleSatelliteLayer />}
        {showOSM && (
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="OpenStreetMap" />
        )}
        
        <MapController activeLayers={activeLayers} selectedFeature={selectedFeature} userLocation={userLocation} />
        <LocationMarker position={userLocation ? [userLocation.lat, userLocation.lng] : null} />
        
        {/* RENDER LAYERS */}
        {activeLayers.map((layerId) => {
          const geodata = geodataMap[layerId];
          if (!geodata) return null;

          // PENTING: Cari info layer (termasuk TYPE) dari props 'layers'
          const layerInfo = layers.find(l => l._id === layerId);
          const layerType = layerInfo ? layerInfo.type : 'Lainnya';

          return (
            <GeoJSON
              key={layerId}
              data={geodata}
              style={(feature) => {
                const isSelected = selectedFeature && selectedFeature.properties === feature.properties;
                const style = getStyle(feature, layerType);
                
                // Jika dipilih, pertebal garis
                if (isSelected) {
                  return { ...style, weight: 5, fillOpacity: 0.7, color: '#00FFFF' }; // Highlight color
                }
                return style;
              }}
              onEachFeature={(feature, layer) => onEachFeature(feature, layer, layerType)}
            />
          );
        })}
      </MapContainer>
      
      <div className="map-controls">
        <button className="layer-switcher-btn" onClick={() => setShowOSM(!showOSM)}>
          {showOSM ? "Satellite" : "Street Map"}
        </button>
        <button className="layer-switcher-btn" onClick={getCurrentLocation}>📍 GPS</button>
      </div>
    </div>
  );
}

export default Map;