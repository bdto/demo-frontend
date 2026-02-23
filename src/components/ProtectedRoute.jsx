import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <Spinner size="lg" label="Verificando acceso..." fullPage />;

  if (!user) return <Navigate to="/login" />;

  if (adminOnly && !isAdmin()) return <Navigate to="/" />;

  return children;
}
