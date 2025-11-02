const mongoose = require('mongoose');

const LayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Peta Bidang/Persil', 'LSD', 'LP2B', 'RTRW', 'RDTR', 'ZNT', 'Lainnya'],
    default: 'Lainnya'
  },
  description: {
    type: String,
    default: ''
  },
  filePath: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    featureCount: Number,
    bounds: {
      type: {
        type: String,
        enum: [
          'Point',
          'LineString',
          'Polygon',
          'MultiPoint',
          'MultiLineString',
          'MultiPolygon',
          'GeometryCollection'
        ],
        default: 'Polygon'
      },
      bbox: {
        type: [Number],
        default: null
      }
    }
  }
});

module.exports = mongoose.model('Layer', LayerSchema);

