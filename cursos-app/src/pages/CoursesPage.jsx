import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { request } from '../api/client';
import CourseForm from './CourseForm';
import {
  Box, Button, Typography, List, ListItem,
  ListItemText, Divider, CircularProgress
} from '@mui/material';

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
    <Box maxWidth={700} mx="auto" mt={4} px={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Cursos</Typography>
        <Button variant="outlined" color="error" onClick={logout}>
          Cerrar sesión
        </Button>
      </Box>

      <CourseForm onCourseCreated={fetchCourses} token={token} />

      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {courses.map((course, i) => (
            <Box key={course.id ?? i}>
              <ListItem>
                <ListItemText
                  primary={course.name}
                  secondary={course.description}
                />
              </ListItem>
              <Divider />
            </Box>
          ))}
        </List>
      )}
    </Box>
  );
}