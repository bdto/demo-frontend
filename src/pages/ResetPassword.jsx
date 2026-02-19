import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error('Las contrasenas no coinciden');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, ...form });
      toast.success('Contrasena restablecida. Inicia sesion.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al restablecer');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{ maxWidth: '400px', margin: '4rem auto', textAlign: 'center' }}>
        <h2>Token invalido</h2>
        <p>El enlace de recuperacion no es valido o ha expirado.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Nueva Contrasena</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input name="newPassword" type="password" placeholder="Nueva contrasena (min 8 caracteres)" value={form.newPassword} onChange={handleChange} required
          style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem' }} />
        <input name="confirmPassword" type="password" placeholder="Confirmar contrasena" value={form.confirmPassword} onChange={handleChange} required
          style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem' }} />
        <button type="submit" disabled={loading}
          style={{ padding: '0.75rem', backgroundColor: '#1a1a2e', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' }}>
          {loading ? 'Guardando...' : 'Restablecer contrasena'}
        </button>
      </form>
    </div>
  );
}