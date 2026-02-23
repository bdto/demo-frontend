import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import Spinner from '../components/Spinner';
import styles from './AuthForm.module.css';

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
      <AuthLayout title="Enlace invalido" subtitle="El enlace de recuperacion no es valido o ha expirado">
        <div className={styles.errorCard}>
          <div className={styles.errorIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h3 className={styles.errorTitle}>Token invalido</h3>
          <p className={styles.errorText}>
            El enlace de recuperacion no es valido o ha expirado. Solicita uno nuevo.
          </p>
          <Link to="/forgot-password" className={styles.successLink}>
            Solicitar nuevo enlace
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Nueva contrasena"
      subtitle="Ingresa y confirma tu nueva contrasena"
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#ffffff">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
        </svg>
      }
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <FormInput
          label="Nueva contrasena"
          type="password"
          name="newPassword"
          placeholder="Minimo 8 caracteres"
          value={form.newPassword}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />
        <FormInput
          label="Confirmar contrasena"
          type="password"
          name="confirmPassword"
          placeholder="Repite tu contrasena"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />
        <button type="submit" disabled={loading} className={styles.btnSubmit}>
          {loading ? <Spinner size="sm" /> : 'Restablecer contrasena'}
        </button>
      </form>
    </AuthLayout>
  );
}
