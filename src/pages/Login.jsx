import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import Spinner from '../components/Spinner';
import styles from './AuthForm.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data.data;

      login(
        { name: data.name, email: data.email, role: data.role },
        data.token
      );

      toast.success('Login exitoso');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Bienvenido de vuelta"
      subtitle="Ingresa tus credenciales para acceder a tu cuenta"
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#ffffff">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      }
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <FormInput
          label="Correo electronico"
          type="email"
          name="email"
          placeholder="tu@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <FormInput
          label="Contrasena"
          type="password"
          name="password"
          placeholder="Ingresa tu contrasena"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <button type="submit" disabled={loading} className={styles.btnSubmit}>
          {loading ? <Spinner size="sm" /> : 'Iniciar Sesion'}
        </button>
      </form>

      <div className={styles.footer}>
        <Link to="/forgot-password">{'Olvidaste tu contrasena?'}</Link>
        <span>{'No tienes cuenta? '}<Link to="/register">Registrate</Link></span>
      </div>
    </AuthLayout>
  );
}
