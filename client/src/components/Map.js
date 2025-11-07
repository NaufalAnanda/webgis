import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import API_URL from '../config/api';
import './Map.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Google Satellite Tile Layer
const GoogleSatelliteLayer = () => {
  return (
    <TileLayer
      url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
      attribution="&copy; Google"
      maxZoom={20}
    />
  );
};

// Component to handle map bounds and location
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

// GPS Location Component
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

  return position === null ? null : (
    <Marker position={position} icon={icon}>
      <Popup>Lokasi Anda</Popup>
    </Marker>
  );
};

function Map({ activeLayers, selectedFeature, onFeatureSelect, showSearch }) {
  const [geodataMap, setGeodataMap] = React.useState({});
  const [userLocation, setUserLocation] = useState(null);
  const [showOSM, setShowOSM] = useState(false);
  const mapRef = useRef(null);
  const selectedFeatureRef = useRef(selectedFeature);
  
  // Keep ref in sync with prop
  useEffect(() => {
    selectedFeatureRef.current = selectedFeature;
  }, [selectedFeature]);

  useEffect(() => {
    // Fetch GeoJSON data for active layers
    activeLayers.forEach(async (layerId) => {
      if (!geodataMap[layerId]) {
        try {
          const response = await axios.get(`${API_URL}/api/geodata/${layerId}`);
          setGeodataMap(prev => ({
            ...prev,
            [layerId]: response.data
          }));
        } catch (error) {
          console.error(`Error fetching geodata for layer ${layerId}:`, error);
        }
      }
    });
  }, [activeLayers, geodataMap]);

  // Get user's GPS location
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
          console.error('Error getting location:', error);
          alert('Tidak dapat mengakses lokasi GPS. Pastikan izin lokasi sudah diberikan.');
        }
      );
    } else {
      alert('Browser tidak mendukung geolocation.');
    }
  };

  useEffect(() => {
    // Optionally get location on mount
    // getCurrentLocation();
  }, []);

  const getStyle = (feature, layer) => {
    const layerType = layer.options.type || 'default';
    const colors = {
      'Peta Bidang/Persil': { color: '#3388ff', fillColor: '#3388ff', fillOpacity: 0.2 },
      'LSD': { color: '#00ff00', fillColor: '#00ff00', fillOpacity: 0.3 },
      'LP2B': { color: '#ffff00', fillColor: '#ffff00', fillOpacity: 0.3 },
      'RTRW': { color: '#ff00ff', fillColor: '#ff00ff', fillOpacity: 0.2 },
      'RDTR': { color: '#ff00ff', fillColor: '#ff00ff', fillOpacity: 0.2 },
      'ZNT': { color: '#ff8800', fillColor: '#ff8800', fillOpacity: 0.3 },
      'Lainnya': { color: '#888888', fillColor: '#888888', fillOpacity: 0.2 }
    };
    return colors[layerType] || colors['Lainnya'];
  };

  const onEachFeature = (feature, layer, layerType) => {
    // Store base style in layer for reference
    const baseStyle = getStyle(feature, { options: { type: layerType } });
    layer._baseStyle = baseStyle;
    
    if (feature.properties) {
      const props = feature.properties;
      let popupContent = '<div style="max-width: 300px;">';
      popupContent += `<h3 style="margin: 0 0 10px 0; font-size: 16px;">${layerType}</h3>`;
      popupContent += '<table style="width: 100%; border-collapse: collapse;">';
      
      Object.keys(props).forEach(key => {
        if (props[key] !== null && props[key] !== undefined && props[key] !== '') {
          const value = typeof props[key] === 'object' ? JSON.stringify(props[key]) : String(props[key]);
          popupContent += `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 5px; font-weight: bold; width: 40%;">${key}:</td>
              <td style="padding: 5px;">${value}</td>
            </tr>
          `;
        }
      });
      
      popupContent += '</table></div>';
      layer.bindPopup(popupContent);
    }

    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        const baseStyle = layer._baseStyle || getStyle(feature, { options: { type: layerType } });
        // Preserve layer colors while hovering
        layer.setStyle({
          ...baseStyle,
          weight: 4,
          fillOpacity: 0.6
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        const baseStyle = layer._baseStyle || getStyle(feature, { options: { type: layerType } });
        // Check if this is the selected feature using ref to get latest value
        const currentSelected = selectedFeatureRef.current;
        const isSelected = currentSelected && 
          currentSelected.properties === feature.properties;
        // If selected, use selected style, otherwise use base style
        if (isSelected) {
          layer.setStyle({
            ...baseStyle,
            weight: 4,
            fillOpacity: 0.6
          });
        } else {
          layer.setStyle(baseStyle);
        }
      }
    });
  };

  return (
    <div className="map-container">
      <MapContainer
        center={[-6.2088, 106.8456]} // Jakarta coordinates
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        {!showOSM && <GoogleSatelliteLayer />}
        {showOSM && (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            zIndex={1}
          />
        )}
        
        <MapController 
          activeLayers={activeLayers} 
          selectedFeature={selectedFeature}
          userLocation={userLocation}
        />
        
        <LocationMarker position={userLocation ? [userLocation.lat, userLocation.lng] : null} />
        
        {activeLayers.map((layerId) => {
          const geodata = geodataMap[layerId];
          if (!geodata) return null;
          
          return (
            <GeoJSON
              key={layerId}
              data={geodata}
              style={(feature) => {
                const layerInfo = geodata.layerInfo || {};
                const isSelected = selectedFeature && 
                  selectedFeature.properties === feature.properties;
                const baseStyle = getStyle(feature, { options: { type: layerInfo.type } });
                return isSelected ? {
                  ...baseStyle,
                  weight: 4,
                  fillOpacity: 0.6
                } : baseStyle;
              }}
              onEachFeature={(feature, layer) => {
                const layerInfo = geodata.layerInfo || {};
                onEachFeature(feature, layer, layerInfo.type || 'Lainnya');
                
                if (onFeatureSelect) {
                  layer.on('click', () => {
                    onFeatureSelect(feature);
                    // Update style immediately after selection to maintain layer color
                    const baseStyle = layer._baseStyle || getStyle(feature, { options: { type: layerInfo.type } });
                    layer.setStyle({
                      ...baseStyle,
                      weight: 4,
                      fillOpacity: 0.6
                    });
                  });
                }
              }}
            />
          );
        })}
      </MapContainer>
      
      {/* Layer Switcher Control */}
      <div className="map-controls">
        <button
          className="layer-switcher-btn"
          onClick={() => setShowOSM(!showOSM)}
          title={showOSM ? "Switch to Google Satellite" : "Switch to OpenStreetMap"}
        >
          {showOSM ? "Satellite" : "Street Map"}
        </button>
        <button
          className="layer-switcher-btn"
          onClick={getCurrentLocation}
          title="Tampilkan Lokasi Saya (GPS)"
        >
          📍 GPS
        </button>
      </div>
    </div>
  );
}

export default Map;

