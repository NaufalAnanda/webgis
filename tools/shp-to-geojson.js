/**
 * Helper script to convert SHP files to GeoJSON
 * Requires: npm install -g shapefile
 * Or use: npm install shapefile
 * 
 * Usage:
 * node tools/shp-to-geojson.js input.shp output.geojson
 */

const shapefile = require('shapefile');
const fs = require('fs');
const path = require('path');

const inputFile = process.argv[2];
const outputFile = process.argv[3];

if (!inputFile || !outputFile) {
  console.error('Usage: node shp-to-geojson.js <input.shp> <output.geojson>');
  process.exit(1);
}

async function convert() {
  try {
    console.log(`Reading ${inputFile}...`);
    
    // Read shapefile
    const source = await shapefile.open(inputFile);
    const features = [];
    
    let result = await source.read();
    while (!result.done) {
      features.push(result.value);
      result = await source.read();
    }
    
    // Create GeoJSON
    const geojson = {
      type: 'FeatureCollection',
      features: features
    };
    
    // Write to file
    fs.writeFileSync(outputFile, JSON.stringify(geojson, null, 2));
    
    console.log(`✅ Converted ${features.length} features to ${outputFile}`);
  } catch (error) {
    console.error('Error converting file:', error);
    process.exit(1);
  }
}

convert();

