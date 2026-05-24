import { useState } from 'react';
import { request } from '../api/client';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';

export default function CourseForm({ onCourseCreated, token }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [credits, setCredits] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const body = { name, description, code, credits: parseInt(credits) };
      console.log('Enviando:', JSON.stringify(body));
      await request('/api/courses', {
        method: 'POST',
        body: JSON.stringify({
          name,
          description,
          code,
          credits: parseInt(credits),
        }),
      }, token);
      setSuccess('Curso creado exitosamente');
      setName('');
      setDescription('');
      setCode('');
      setCredits('');
      if (onCourseCreated) onCourseCreated();
    } catch (err) {
      setError(err.message || 'Error al crear el curso');
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" mb={2}>Agregar curso</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
        <TextField label="Nombre del curso" value={name}
          onChange={(e) => setName(e.target.value)} required fullWidth />
        <TextField label="Descripción" value={description}
          onChange={(e) => setDescription(e.target.value)} multiline rows={2} fullWidth />
        <TextField label="Código (ej: CS101)" value={code}
          onChange={(e) => setCode(e.target.value)} required fullWidth />
        <TextField label="Créditos" value={credits} type="number"
          onChange={(e) => setCredits(e.target.value)} required fullWidth />
        <Button type="submit" variant="contained">Crear curso</Button>
      </Box>
    </Paper>
  );
}