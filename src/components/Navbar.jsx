import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/login');
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo} onClick={closeMobile}>
        Demo<span className={styles.logoAccent}>App</span>
      </Link>

      {/* Desktop Navigation */}
      <div className={styles.desktopNav}>
        <Link to="/products" className={styles.navLink}>Catalogo</Link>

        {user ? (
          <>
            {isAdmin() && (
              <Link to="/admin/products" className={`${styles.navLink} ${styles.navLinkAdmin}`}>
                Admin Panel
              </Link>
            )}
            <div className={styles.userSection}>
              <span className={styles.userName}>{'Hola, '}{user.name}</span>
              <button onClick={handleLogout} className={styles.btnLogout}>
                Cerrar sesion
              </button>
            </div>
          </>
        ) : (
          <div className={styles.authBtns}>
            <Link to="/login" className={styles.btnLogin}>Iniciar sesion</Link>
            <Link to="/register" className={styles.btnRegister}>Registrarse</Link>
          </div>
        )}
      </div>

      {/* Hamburger Button */}
      <button
        className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? 'Cerrar menu' : 'Abrir menu'}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileOverlay}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/products" className={styles.mobileLink} onClick={closeMobile}>
              Catalogo
            </Link>

            {user ? (
              <>
                {isAdmin() && (
                  <Link
                    to="/admin/products"
                    className={`${styles.mobileLink} ${styles.mobileLinkAdmin}`}
                    onClick={closeMobile}
                  >
                    Admin Panel
                  </Link>
                )}
                <div className={styles.mobileDivider} />
                <span className={styles.mobileUserName}>{'Hola, '}{user.name}</span>
                <button onClick={handleLogout} className={styles.mobileBtnLogout}>
                  Cerrar sesion
                </button>
              </>
            ) : (
              <>
                <div className={styles.mobileDivider} />
                <Link to="/login" className={styles.mobileBtnLogin} onClick={closeMobile}>
                  Iniciar sesion
                </Link>
                <Link to="/register" className={styles.mobileBtnRegister} onClick={closeMobile}>
                  Registrarse
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
