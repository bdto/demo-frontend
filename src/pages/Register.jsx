import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error('Las contrasenas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/register', form);
      const data = response.data.data;

      login(
        { name: data.name, email: data.email, role: data.role },
        data.token
      );

      toast.success('Registro exitoso');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Crear Cuenta</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input name="name" placeholder="Nombre completo" value={form.name} onChange={handleChange} required
          style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem' }} />
        <input name="email" type="email" placeholder="Correo electronico" value={form.email} onChange={handleChange} required
          style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem' }} />
        <input name="password" type="password" placeholder="Contrasena (min 8 caracteres)" value={form.password} onChange={handleChange} required
          style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem' }} />
        <input name="confirmPassword" type="password" placeholder="Confirmar contrasena" value={form.confirmPassword} onChange={handleChange} required
          style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem' }} />
        <button type="submit" disabled={loading}
          style={{ padding: '0.75rem', backgroundColor: '#1a1a2e', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Cargando...' : 'Registrarse'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Ya tienes cuenta? <Link to="/login" style={{ color: '#0f3460' }}>Inicia sesion</Link>
      </p>
    </div>
  );
}