import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { request } from '../api/client';
import {
  Box, Button, TextField, Typography, Paper, Alert
} from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      login(data.token);
      navigate('/courses');
    } catch (err) {
      setError(err.message || 'Credenciales inválidas');
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ background: 'linear-gradient(135deg, #f0e8ff 0%, #f5f4f8 60%)' }}
    >
      <Paper elevation={4} sx={{ width: 380, overflow: 'hidden' }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #aa3bff, #7c1fd4)',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <SchoolIcon sx={{ color: '#fff', fontSize: 40 }} />
          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
            Gestión de Cursos
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Ingresa tus credenciales para continuar
          </Typography>
        </Box>

        <Box sx={{ p: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2.5}>
            <TextField
              label="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 0.5 }}>
              Iniciar sesión
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}