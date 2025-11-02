const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Layer = require('../models/Layer');

// Get GeoJSON data for a layer
router.get('/:id', async (req, res) => {
  try {
    const layer = await Layer.findById(req.params.id);
    if (!layer) {
      return res.status(404).json({ error: 'Layer not found' });
    }

    const filePath = path.join(__dirname, '..', layer.filePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const geojsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.json(geojsonData);
  } catch (error) {
    console.error('Get geodata error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

