import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { request } from '../api/client';
import {
  Box, Button, TextField, Typography, Paper, Alert
} from '@mui/material';

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
      console.log('Respuesta del login:', data);
      login(data.token);
      navigate('/courses');
    } catch (err) {
      setError(err.message || 'Credenciales inválidas');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={3} sx={{ p: 4, width: 360 }}>
        <Typography variant="h5" mb={2}>Iniciar sesión</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
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
          <Button type="submit" variant="contained" fullWidth>
            Entrar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}