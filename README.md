<<<<<<< HEAD
# Trabajo Práctico Final – Programación Web III

Esta aplicación web está inspirada en Reddit y simula una plataforma donde los usuarios pueden publicar contenido, visualizar posteos y gestionar imágenes.

---

## 🧠 Descripción General

La app sigue una **arquitectura de microservicios orientada a contenedores**, integrando múltiples tecnologías modernas. Los servicios se comunican mediante **Kong API Gateway**, permitiendo una estructura escalable y mantenible.

Los roles disponibles son:

- **Suscriptor**: puede ver contenido.
- **Administrador**: puede crear y eliminar publicaciones, además de acceder a opciones especiales.

---

## 🎯 Funcionalidades principales

- Autenticación con JWT
- Gestión de tareas (posteos tipo Reddit)
- Subida y visualización de imágenes
- Frontend responsivo en React
- Comunicación entre microservicios a través de Kong

---

## 🧱 Arquitectura

![arquitectura](./image.png)

| Componente     | Tecnología              | Descripción                             |
|----------------|-------------------------|-----------------------------------------|
| API Gateway    | Kong                    | Controlador de entrada y enrutamiento   |
| Auth Service   | Node.js + TypeScript    | Manejo de usuarios y JWT (PostgreSQL)   |
| Tasks Service  | Node.js + JavaScript    | Post tipo Reddit (MongoDB)              |
| Imagestore     | Go                      | Subida de imágenes (almacenamiento local) |
| Frontend       | React + Vite            | Interfaz de usuario                     |

---

## 🖥️ URLs del frontend

Una vez levantado el proyecto:

- 🌐 **Frontend web**: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Usuario demo para login

Para iniciar sesión como **administrador**, usá:

```bash
📧 Email:    admin@example.com
🔐 Contraseña: 123456
=======
# ..

![Diagrama de Arquitectura](https://raw.githubusercontent.com/ezexedge/programaci-n-web-III/dev/image.png)

>>>>>>> 263b2a9a28ceef9e4f85a52eacfeae95506bfc3f
