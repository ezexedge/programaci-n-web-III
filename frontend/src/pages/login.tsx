import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateInputs = () => {
    if (!email.includes('@') || !email.includes('.')) return 'Email inválido.';
    if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Login fallido');
      }

      await response.json();
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Error durante el login');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
          <button type="submit" style={buttonStyle}>Iniciar sesión</button>
        </form>
        {error && <p style={errorStyle}>{error}</p>}
        <p>¿No tenés cuenta? <button style={linkButton} onClick={() => navigate('/signup')}>Registrate</button></p>
      </div>
    </div>
  );
}

const containerStyle = {
  fontFamily: 'Arial, sans-serif',
  backgroundColor: '#f6f7f8',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const cardStyle = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '400px',
};

const titleStyle = {
  marginBottom: '1rem',
  fontSize: '1.5rem',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const inputStyle = {
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '1rem',
};

const buttonStyle = {
  padding: '0.75rem',
  backgroundColor: '#0079d3',
  color: '#fff',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const linkButton = {
  background: 'none',
  border: 'none',
  color: '#0079d3',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const errorStyle = {
  color: 'red',
  marginTop: '1rem',
};
