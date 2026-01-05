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
    enum: [
      'LSD',
      'LP2B',
      'RTRW',
      'RDTR',
      'ZNT',
      'Garis Pantai',
      'Kawasan Hutan',      
      'Batas Desa',        
      'Peta Pendaftaran',  
      'Peta Ajudikasi',    
      'Peta Rutin'         
    ],
    default: '' 
  },
  tahun: {
    type: Number,
    required: false,
    validate: {
      validator: function(value) {
        if (this.type === 'Peta Ajudikasi') {
          return value && value >= 2016 && value <= 2019;
        }
        return true; // Untuk type lain, tahun opsional
      },
      message: 'Tahun harus diisi dan antara 2016-2019 untuk Peta Ajudikasi'
    }
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