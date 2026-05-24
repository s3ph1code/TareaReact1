import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { request } from '../api/client';
import CourseForm from './CourseForm';
import {
  Box, Button, Typography, Card, CardContent,
  Chip, CircularProgress, Stack
} from '@mui/material';
import { School as SchoolIcon, Logout as LogoutIcon, MenuBook as MenuBookIcon } from '@mui/icons-material';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout, token } = useAuth();

  const fetchCourses = async () => {
    try {
      const data = await request('/api/courses', {}, token);
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchCourses();
  }, [token]);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0e8ff 0%, #f5f4f8 60%)' }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #aa3bff, #7c1fd4)',
          px: 4, py: 2.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 12px rgba(170,59,255,0.25)',
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <SchoolIcon sx={{ color: '#fff', fontSize: 28 }} />
          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
            Gestión de Cursos
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={logout}
          startIcon={<LogoutIcon />}
          sx={{
            color: '#fff',
            borderColor: 'rgba(255,255,255,0.5)',
            '&:hover': { borderColor: '#fff', background: 'rgba(255,255,255,0.1)' },
          }}
        >
          Cerrar sesión
        </Button>
      </Box>

      <Box maxWidth={760} mx="auto" px={3} py={4}>
        <CourseForm onCourseCreated={fetchCourses} token={token} />

        <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
          {loading ? '' : `${courses.length} curso${courses.length !== 1 ? 's' : ''} registrado${courses.length !== 1 ? 's' : ''}`}
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress sx={{ color: '#aa3bff' }} />
          </Box>
        ) : courses.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            py={8}
            gap={2}
            sx={{ color: 'text.disabled' }}
          >
            <MenuBookIcon sx={{ fontSize: 56 }} />
            <Typography variant="body1">No hay cursos registrados aún</Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {courses.map((course, i) => (
              <Card key={course.id ?? i} elevation={2} sx={{ transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 6 } }}>
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
                    <Box flex={1} minWidth={0}>
                      <Typography variant="subtitle1" fontWeight={700} noWrap>
                        {course.name}
                      </Typography>
                      {course.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {course.description}
                        </Typography>
                      )}
                    </Box>
                    <Box display="flex" gap={1} flexShrink={0}>
                      {course.code && (
                        <Chip label={course.code} size="small" variant="outlined" color="primary" />
                      )}
                      {course.credits != null && (
                        <Chip label={`${course.credits} créditos`} size="small" sx={{ background: '#f0e8ff', color: '#7c1fd4', fontWeight: 600 }} />
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}