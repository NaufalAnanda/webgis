/**
 * Script untuk fix Map.js - ganti Hutan Hijau menjadi Kawasan Hutan
 * dan sesuaikan warna sesuai Sidebar
 * 
 * Usage: node tools/fix-map-colors.js
 */

const fs = require('fs');
const path = require('path');

const mapFile = path.join(__dirname, '../client/src/components/Map.js');

let content = fs.readFileSync(mapFile, 'utf8');

// Ganti Hutan Hijau menjadi Kawasan Hutan
content = content.replace(/case 'Hutan Hijau':/g, "case 'Kawasan Hutan':");

// Update warna sesuai Sidebar
const colorUpdates = {
  "case 'LSD':": {
    old: "style = { color: '#FFFF00', fillColor: '#FFFF00', fillOpacity: 0.5 }; // Kuning",
    new: "style = { color: '#FFFF00', fillColor: '#FFFF00', fillOpacity: 0.4 }; // Kuning"
  },
  "case 'Garis Pantai':": {
    old: "style = { color: '#0000FF', fillColor: '#0000FF', fillOpacity: 0.6 }; // Biru",
    new: "style = { color: '#0000FF', fillColor: '#0000FF', fillOpacity: 0.4 }; // Biru"
  },
  "case 'Peta Rutin':": {
    old: "style = { color: '#FFFFFF', fillColor: '#FFFFFF', fillOpacity: 0.5 }; // Putih",
    new: "style = { color: '#FFFFFF', fillColor: '#FFFFFF', fillOpacity: 0.4 }; // Putih"
  }
};

// Ganti default comment
content = content.replace(/\/\/ Cream untuk Lainnya/g, '// Default style');

// Ganti layerType fallback dari 'Lainnya' menjadi null
content = content.replace(/layerInfo \? layerInfo\.type : 'Lainnya'/g, "layerInfo ? layerInfo.type : null");

fs.writeFileSync(mapFile, content, 'utf8');
console.log('✅ Map.js updated successfully!');

