const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Layer = require('../models/Layer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 400 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.geojson', '.json'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only GeoJSON files are allowed'));
    }
  }
});

// Get all layers
router.get('/', async (req, res) => {
  try {
    const layers = await Layer.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(layers);
  } catch (error) {
    console.error('Get layers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get layer by ID
router.get('/:id', async (req, res) => {
  try {
    const layer = await Layer.findById(req.params.id);
    if (!layer) {
      return res.status(404).json({ error: 'Layer not found' });
    }
    res.json(layer);
  } catch (error) {
    console.error('Get layer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new layer (admin only)
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { name, type, description, createdBy } = req.body;

    if (!name || !type || !createdBy) {
      // Delete uploaded file if validation fails
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Read and parse GeoJSON to get metadata
    const geojsonData = JSON.parse(fs.readFileSync(req.file.path, 'utf8'));
    const featureCount = geojsonData.features ? geojsonData.features.length : 0;
    
    // Calculate bounds (min/max lat/lng) for metadata
    let bounds = null;
    if (geojsonData.features && geojsonData.features.length > 0) {
      let minLng = Infinity, minLat = Infinity;
      let maxLng = -Infinity, maxLat = -Infinity;
      let geometryType = geojsonData.features[0]?.geometry?.type || 'Polygon';
      
      geojsonData.features.forEach(feature => {
        if (feature.geometry) {
          // Use the first feature's geometry type
          if (!bounds) {
            geometryType = feature.geometry.type || geometryType;
          }
          
          // Extract coordinates based on geometry type
          const extractCoords = (coords) => {
            if (Array.isArray(coords)) {
              if (typeof coords[0] === 'number' && coords.length >= 2) {
                // Single coordinate [lng, lat]
                const [lng, lat] = coords;
                minLng = Math.min(minLng, lng);
                minLat = Math.min(minLat, lat);
                maxLng = Math.max(maxLng, lng);
                maxLat = Math.max(maxLat, lat);
              } else {
                // Nested array, recurse
                coords.forEach(extractCoords);
              }
            }
          };
          
          extractCoords(feature.geometry.coordinates);
        }
      });
      
      if (minLng !== Infinity && minLat !== Infinity) {
        bounds = {
          type: geometryType,
          bbox: [minLng, minLat, maxLng, maxLat] // Bounding box: [minLng, minLat, maxLng, maxLat]
        };
      }
    }

    const layer = new Layer({
      name,
      type,
      description: description || '',
      filePath: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      createdBy,
      metadata: {
        featureCount,
        bounds: bounds
      }
    });

    await layer.save();
    res.json(layer);
  } catch (error) {
    console.error('Create layer error:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Update layer (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { name, type, description } = req.body;

    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type are required' });
    }

    const layer = await Layer.findById(req.params.id);
    if (!layer) {
      return res.status(404).json({ error: 'Layer not found' });
    }

    // Update layer fields
    layer.name = name;
    layer.type = type;
    layer.description = description || '';
    
    await layer.save();
    res.json(layer);
  } catch (error) {
    console.error('Update layer error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Delete layer (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const layer = await Layer.findById(req.params.id);
    if (!layer) {
      return res.status(404).json({ error: 'Layer not found' });
    }

    // Delete file
    const filePath = path.join(__dirname, '..', layer.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Layer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Layer deleted successfully' });
  } catch (error) {
    console.error('Delete layer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

