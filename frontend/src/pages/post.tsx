// src/components/Post.tsx
import React from 'react';

interface PostProps {
  title: string;
  description: string;
  image?: string;
  email: string;
  currentUserEmail: string;
  currentUserRole: string;
  onDelete: () => void;
}

const Post: React.FC<PostProps> = ({
  title,
  description,
  image,
  email,
  currentUserEmail,
  currentUserRole,
  onDelete
}) => {
  const canDelete = currentUserEmail === email || currentUserRole === 'admin';

  return (
    <div style={postContainerStyle}>
      <div style={postHeaderStyle}>
        <h3 style={postTitleStyle}>{title}</h3>
        {canDelete && (
          <button onClick={onDelete} style={deleteButtonStyle}>Eliminar</button>
        )}
      </div>
      <p style={postDescriptionStyle}>{description}</p>
      {image && (
        <div style={imageContainerStyle}>
          <img
            src={`http://localhost:3003/images/${image}`}
            alt={title}
            style={postImageStyle}
          />
        </div>
      )}
      <p style={postFooterStyle}>Publicado por u/{email.split('@')[0]}</p>
    </div>
  );
};

// Estilos más parecidos a Reddit
const postContainerStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  padding: '1rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  marginBottom: '1.5rem',
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px',
  lineHeight: 1.5,
};

const postHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const postTitleStyle = {
  margin: 0,
  fontSize: '16px',
  fontWeight: 600,
  color: '#1a1a1b',
};

const postDescriptionStyle = {
  margin: '0.5rem 0',
  color: '#1c1c1c',
};

const postFooterStyle = {
  color: '#878a8c',
  fontSize: '12px',
  marginTop: '0.75rem',
};

const postImageStyle = {
  maxWidth: '100%',
  maxHeight: '350px',
  objectFit: 'cover' as const,
  borderRadius: '4px',
  marginTop: '0.5rem',
};

const imageContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  borderRadius: '4px',
};

const deleteButtonStyle = {
  backgroundColor: '#d93a00',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '4px 10px',
  fontSize: '12px',
  cursor: 'pointer',
};

export default Post;
