// src/pages/Home.tsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Post from './post';

interface Task {
  _id: string;
  title: string;
  description: string;
  image?: string;
  email: string;
}

export default function Home() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const validateSession = async () => {
    try {
      console.log('🟡 Validando sesión...');
      const res = await fetch('http://localhost:8000/auth/me', {
        credentials: 'include',
      });

      console.log('🔵 Estado de respuesta:', res.status);

      if (!res.ok) throw new Error('No autorizado');

      const data = await res.json();
      console.log('🟢 Usuario autenticado:', data);

      setUsername(data.currentUser.username);
      setEmail(data.currentUser.email);
      setRole(data.currentUser.role);
    } catch (err) {
      console.warn('❌ No hay sesión activa o cookie inválida');
      setUsername('');
      setEmail('');
      setRole('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateSession();
    fetchTasks();
  }, []);

  useEffect(() => {
    if (location.state?.fromLogin) {
      validateSession();
    }
  }, [location.state]);

  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:8000/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Error al obtener tareas:', err);
    }
  };

  const handleSubmitPost = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);

      if (fileInputRef.current?.files?.[0]) {
        formData.append('image', fileInputRef.current.files[0]);
      }

      const res = await fetch('http://localhost:8000/tasks', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al crear post');
      }

      const newTask = await res.json();
      setTasks(prev => [newTask, ...prev]);

      setTitle('');
      setDescription('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setShowModal(false);
    } catch (err: any) {
      console.error('Error al crear post:', err);
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/tasks/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('No se pudo eliminar la tarea');

      setTasks(prev => prev.filter(task => task._id !== id));
    } catch (err) {
      console.error('Error al eliminar tarea:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      navigate('/login');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      setError('Error al cerrar sesión');
    }
  };

  if (loading) return <p style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>Cargando...</p>;

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          {username ? `Bienvenido, ${username}` : 'Bienvenido a la plataforma'}
        </h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {!username ? (
            <button style={btnStyle} onClick={() => navigate('/login')}>Iniciar sesión</button>
          ) : (
            <>
              <button style={btnStyle} onClick={() => setShowModal(true)}>Crear Post</button>
              <button style={{ ...btnStyle, backgroundColor: '#d93a00' }} onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </header>


      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>Nuevo Post</h2>
            <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Descripción del post..." style={{ ...inputStyle, resize: 'vertical' }} />
            <input type="file" accept="image/*" ref={fileInputRef} style={inputStyle} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button style={{ ...btnStyle, backgroundColor: '#e5e5e5', color: '#000' }} onClick={() => setShowModal(false)}>Cancelar</button>
              <button style={btnStyle} onClick={handleSubmitPost}>Enviar</button>
            </div>
          </div>
        </div>
      )}

      {tasks.map(task => (
        <Post
          key={task._id}
          title={task.title}
          description={task.description}
          image={task.image}
          email={task.email}
          currentUserEmail={email}
          currentUserRole={role}
          onDelete={() => handleDelete(task._id)}
        />
      ))}

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
    </div>
  );
}

const containerStyle = {
  padding: '2rem',
  fontFamily: 'Arial, sans-serif',
  backgroundColor: '#f6f7f8',
  minHeight: '100vh',
  color: '#1c1c1c'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  padding: '1rem 2rem',
  borderRadius: '8px',
  marginBottom: '2rem',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
};

const btnStyle = {
  backgroundColor: '#0079d3',
  color: '#fff',
  border: 'none',
  padding: '0.6rem 1rem',
  borderRadius: '9999px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '0.95rem',
};

const inputStyle = {
  padding: '10px',
  fontSize: '1rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
};

const modalOverlayStyle = {
  position: 'fixed' as const,
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyle = {
  background: '#fff',
  padding: '20px',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '1rem',
  width: '400px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
};
