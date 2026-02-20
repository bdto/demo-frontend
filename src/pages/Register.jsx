import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import Spinner from '../components/Spinner';
import styles from './AuthForm.module.css';

function getPasswordStrength(password) {
  if (!password) return { level: 0, label: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: 'Debil', className: styles.strengthWeak };
  if (score <= 2) return { level: 2, label: 'Media', className: styles.strengthMedium };
  return { level: 3, label: 'Fuerte', className: styles.strengthStrong };
}

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const strength = useMemo(() => getPasswordStrength(form.password), [form.password]);

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
    <AuthLayout
      title="Crear cuenta"
      subtitle="Completa tus datos para registrarte"
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#ffffff">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
        </svg>
      }
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <FormInput
          label="Nombre completo"
          name="name"
          placeholder="Tu nombre"
          value={form.name}
          onChange={handleChange}
          required
          autoComplete="name"
        />
        <FormInput
          label="Correo electronico"
          type="email"
          name="email"
          placeholder="tu@ejemplo.com"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />
        <FormInput
          label="Contrasena"
          type="password"
          name="password"
          placeholder="Minimo 8 caracteres"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />

        {form.password && (
          <>
            <div className={`${styles.strengthBar} ${strength.className || ''}`}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={`${styles.strengthSegment} ${i <= strength.level ? 'active' : ''}`} />
              ))}
            </div>
            <span className={styles.strengthLabel}>{'Seguridad: '}{strength.label}</span>
          </>
        )}

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
          {loading ? <Spinner size="sm" /> : 'Registrarse'}
        </button>
      </form>

      <div className={styles.footer}>
        <span>{'Ya tienes cuenta? '}<Link to="/login">Inicia sesion</Link></span>
      </div>
    </AuthLayout>
  );
}
