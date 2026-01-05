/**
 * Script untuk update nama semua layer di database
 * - Update nama layer sesuai dengan jenis layer
 * - Untuk Peta Ajudikasi: nama = "Peta Ajudikasi {tahun}"
 * - Untuk layer lain: nama = type (jenis layer)
 * - Ganti "Hutan Hijau" menjadi "Kawasan Hutan" jika ada
 * 
 * Usage: node tools/update-layer-names.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Layer = require('../server/models/Layer');

// Generate nama layer berdasarkan type dan tahun
function generateLayerName(type, tahun) {
  if (type === 'Peta Ajudikasi' && tahun) {
    return `Peta Ajudikasi ${tahun}`;
  }
  return type;
}

async function updateLayerNames() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/webgis-bpn';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Get all layers
    const layers = await Layer.find({});
    console.log(`\n📊 Found ${layers.length} layers to update\n`);

    let updatedCount = 0;
    let renamedCount = 0;

    for (const layer of layers) {
      let updated = false;
      let newType = layer.type;
      let newName = layer.name;

      // Update type: "Hutan Hijau" -> "Kawasan Hutan"
      if (layer.type === 'Hutan Hijau') {
        newType = 'Kawasan Hutan';
        updated = true;
        renamedCount++;
        console.log(`🔄 Renaming type: "${layer.type}" -> "Kawasan Hutan"`);
      }

      // Generate nama baru berdasarkan type dan tahun
      const generatedName = generateLayerName(newType, layer.tahun);

      // Update nama jika berbeda
      if (layer.name !== generatedName) {
        newName = generatedName;
        updated = true;
        console.log(`✏️  Updating name: "${layer.name}" -> "${generatedName}"`);
      }

      // Update layer jika ada perubahan
      if (updated) {
        layer.type = newType;
        layer.name = newName;
        await layer.save();
        updatedCount++;
      }
    }

    console.log(`\n✅ Update completed!`);
    console.log(`   - ${updatedCount} layers updated`);
    console.log(`   - ${renamedCount} layers renamed from "Hutan Hijau" to "Kawasan Hutan"`);

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating layers:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

updateLayerNames();

