import { useState } from 'react';
import { request } from '../api/client';
import { Box, Button, TextField, Typography, Paper, Alert, Collapse } from '@mui/material';
import { AddCircleOutlined as AddCircleOutlineIcon } from '@mui/icons-material';

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
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box display="flex" alignItems="center" gap={1} mb={2.5}>
        <AddCircleOutlineIcon color="primary" />
        <Typography variant="h6">Agregar curso</Typography>
      </Box>

      <Collapse in={!!error}>
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>
      </Collapse>
      <Collapse in={!!success}>
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>
      </Collapse>

      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Nombre del curso"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={2}
          fullWidth
        />
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
          <TextField
            label="Código (ej: CS101)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <TextField
            label="Créditos"
            value={credits}
            type="number"
            inputProps={{ min: 1 }}
            onChange={(e) => setCredits(e.target.value)}
            required
          />
        </Box>
        <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-end', px: 4 }}>
          Crear curso
        </Button>
      </Box>
    </Paper>
  );
}