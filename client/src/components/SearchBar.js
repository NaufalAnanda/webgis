import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';
import API_URL from '../config/api';

function SearchBar({ onFeatureSelect, activeLayers }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const searchFeatures = async (term) => {
    if (!term || term.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    try {
      const searchPromises = activeLayers.map(async (layerId) => {
        try {
          const response = await axios.get(`${API_URL}/api/geodata/${layerId}`);
          const geodata = response.data;
          
          if (!geodata.features) return [];
          
          const matched = geodata.features.filter(feature => {
            if (!feature.properties) return false;
            const props = Object.values(feature.properties).join(' ').toLowerCase();
            return props.includes(term.toLowerCase());
          }).map(feature => ({
            ...feature,
            layerId,
            layerName: geodata.layerInfo?.name || 'Layer'
          }));
          
          return matched;
        } catch (error) {
          console.error(`Error searching layer ${layerId}:`, error);
          return [];
        }
      });

      const allResults = await Promise.all(searchPromises);
      const flatResults = allResults.flat();
      setResults(flatResults);
      setShowResults(flatResults.length > 0);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setShowResults(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchFeatures(value);
  };

  const handleResultClick = (result) => {
    setShowResults(false);
    setSearchTerm('');
    if (onFeatureSelect) {
      onFeatureSelect(result);
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        width: { xs: 'calc(100% - 120px)', sm: '400px' },
        maxWidth: '90%'
      }}
    >
      <TextField
        fullWidth
        placeholder="Cari berdasarkan NIB, nama pemilik, atau atribut lainnya..."
        value={searchTerm}
        onChange={handleSearchChange}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{
          bgcolor: 'white',
          borderRadius: 1,
          '& .MuiOutlinedInput-root': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }
        }}
      />
      
      {showResults && results.length > 0 && (
        <Paper
          sx={{
            mt: 0.5,
            maxHeight: '300px',
            overflow: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}
        >
          <List dense>
            {results.slice(0, 10).map((result, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => handleResultClick(result)}>
                  <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <ListItemText
                    primary={
                      result.properties?.NIB ||
                      result.properties?.nama ||
                      result.properties?.name ||
                      `Fitur ${index + 1}`
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" display="block">
                          {result.layerName}
                        </Typography>
                        {Object.entries(result.properties || {})
                          .slice(0, 2)
                          .map(([key, value]) => (
                            <Typography key={key} variant="caption" display="block" color="text.secondary">
                              {key}: {String(value).substring(0, 30)}
                            </Typography>
                          ))
                        }
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}

export default SearchBar;

