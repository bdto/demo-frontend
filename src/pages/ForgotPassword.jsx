import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import Spinner from '../components/Spinner';
import styles from './AuthForm.module.css';

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
      <AuthLayout title="Correo enviado" subtitle="Revisa tu bandeja de entrada">
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h3 className={styles.successTitle}>Revisa tu correo</h3>
          <p className={styles.successText}>
            Hemos enviado instrucciones para restablecer tu contrasena a tu correo electronico.
          </p>
          <Link to="/login" className={styles.successLink}>
            Volver al login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Recuperar contrasena"
      subtitle="Te enviaremos un enlace para restablecer tu contrasena"
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#ffffff">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
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
        <button type="submit" disabled={loading} className={styles.btnSubmit}>
          {loading ? <Spinner size="sm" /> : 'Enviar enlace de recuperacion'}
        </button>
      </form>

      <div className={styles.footer}>
        <Link to="/login">Volver al login</Link>
      </div>
    </AuthLayout>
  );
}
