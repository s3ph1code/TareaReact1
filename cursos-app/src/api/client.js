const API_URL = 'http://localhost:8080/auth';

export async function request(path, options = {}, token = null) {
  const t = token || localStorage.getItem('token');

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 204) return null;

  if (!response.ok) {
    let message = 'Error en la petición';
    try {
      const text = await response.text();
      message = text || message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}