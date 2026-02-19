import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#1a1a2e',
      color: 'white'
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
        Demo App
      </Link>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/products" style={{ color: '#e0e0e0', textDecoration: 'none' }}>
          Catalogo
        </Link>

        {user ? (
          <>
            {isAdmin() && (
              <Link to="/admin/products" style={{ color: '#ffd700', textDecoration: 'none' }}>
                Admin Panel
              </Link>
            )}
            <span style={{ color: '#a0a0a0' }}>Hola, {user.name}</span>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#e94560',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cerrar sesion
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#e0e0e0', textDecoration: 'none' }}>
              Iniciar sesion
            </Link>
            <Link
              to="/register"
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#0f3460',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px'
              }}
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}