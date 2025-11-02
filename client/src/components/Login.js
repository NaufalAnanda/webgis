import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

function Login() {
  const navigate = useNavigate();
  const { loginWithGoogle, currentUser } = useAuth();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (currentUser) {
      navigate('/map');
    }
  }, [currentUser, navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/map');
    } catch (error) {
      console.error('Login error:', error);
      alert('Gagal login. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            WebGIS BPN
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Peta Kerja Petugas Ukur
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />}
            onClick={handleGoogleLogin}
            disabled={loading}
            fullWidth
            sx={{ py: 1.5 }}
          >
            {loading ? 'Memproses...' : 'Login dengan Google'}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;

