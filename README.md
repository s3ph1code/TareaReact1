# Taller React

**Miembros:** Kevin Cifuentes, Joseph Cardenas, Faiber Piedrahíta

---

## Descripción

Aplicación web SPA (Single Page Application) que permite iniciar sesión con autenticación JWT, listar cursos y crear nuevos cursos. Consume una API REST desarrollada en Spring Boot.

---

## Requisitos previos

- Node.js 18 o superior
- Java 17
- Gradle

---

## Estructura del proyecto

```
TareaReact1/
├── auth/               # Backend Spring Boot
└── cursos-app/         # Frontend React
```

---

## Cómo ejecutar

### 1. Backend (Spring Boot)

```bash
cd auth
./gradlew bootRun
```

Esperar hasta ver:
```
Started AuthApplication in X seconds
```

El backend queda disponible en: `http://localhost:8080/auth`

### 2. Frontend (React)

```bash
cd cursos-app
npm install
npm run dev
```

La aplicación queda disponible en: `http://localhost:5173`

---

## Credenciales de prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| admin | admin123 | ADMIN |
| profesor | prof123 | PROFESSOR |
| estudiante | est123 | STUDENT |

---

## Funcionalidades

### Login
- Ingresar a `http://localhost:5173`
- Escribir usuario y contraseña
- Al iniciar sesión correctamente, el token JWT se guarda en `localStorage` y se redirige a `/courses`

### Lista de cursos
- Se carga automáticamente al entrar a `/courses`
- Muestra nombre y descripción de cada curso

### Crear curso
- Llenar el formulario con: nombre, descripción, código y créditos
- Todos los campos son obligatorios excepto descripción
- Al crear, el curso aparece inmediatamente en la lista

### Cerrar sesión
- Botón "Cerrar sesión" en la parte superior derecha
- Elimina el token y redirige al login

### Persistencia de sesión
- Al recargar la página (F5), si el token sigue vigente, no se pide login de nuevo

---

## Endpoints de la API

| Método | URL | Descripción | Auth |
|---|---|---|---|
| POST | `/auth/api/auth/login` | Iniciar sesión | No |
| GET | `/auth/api/courses` | Listar cursos | Sí |
| POST | `/auth/api/courses` | Crear curso | Sí |

---

## Cambios realizados en el backend

El backend fue entregado con algunos problemas que impidieron su funcionamiento correcto con el frontend. A continuación se describen los cambios necesarios:

### 1. `CustomUserDetailsService.java` — Corrección de authorities
El método `loadUserByUsername` agregaba el prefijo `ROLE_` a cada permiso del usuario:
```java
// Antes (incorrecto)
new SimpleGrantedAuthority("ROLE_" + permission.getName())

// Después (correcto)
new SimpleGrantedAuthority(permission.getName())
```
Esto causaba que Spring Security no reconociera los permisos al validar el token JWT, resultando en un error 403 en todos los endpoints protegidos.

### 2. `CourseServiceImp.java` — Manejo de teacher nulo
Al crear un curso sin profesor asignado, el mapper de MapStruct generaba un objeto `User` vacío (con `id = null`) para el campo `teacher`. Hibernate intentaba persistir este objeto vacío y lanzaba una excepción `TransientObjectException`.

Se agregó un `else` para limpiar el teacher cuando no se envía:
```java
// Antes
if (c.getTeacher() != null && c.getTeacher().getId() != null) {
    // buscar profesor...
}

// Después
if (c.getTeacher() != null && c.getTeacher().getId() != null) {
    // buscar profesor...
} else {
    c.setTeacher(null);
}
```

### 3. `GlobalExceptionHandler.java` — Nuevo archivo
Se agregó un manejador global de excepciones para que los errores de validación (400) devuelvan una respuesta JSON con CORS habilitado, en lugar de redirigir al endpoint `/error` de Thymeleaf que no tenía cabeceras CORS configuradas.

### 4. `CourseController.java` — Nuevo archivo
El backend no incluía un controlador REST para cursos. Solo existían controladores de vistas Thymeleaf. Se creó `CourseController.java` en el paquete `co.icesi.auth.api` implementando la interfaz `CourseApi` ya existente.
