import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Revisa tu correo');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al enviar correo');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
        <h2>Correo enviado</h2>
        <p>Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contrasena.</p>
        <Link to="/login" style={{ color: '#0f3460' }}>Volver al login</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Recuperar Contrasena</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="email" placeholder="Tu correo electronico" value={email} onChange={(e) => setEmail(e.target.value)} required
          style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem' }} />
        <button type="submit" disabled={loading}
          style={{ padding: '0.75rem', backgroundColor: '#1a1a2e', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' }}>
          {loading ? 'Enviando...' : 'Enviar enlace de recuperacion'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Link to="/login" style={{ color: '#0f3460' }}>Volver al login</Link>
      </p>
    </div>
  );
}