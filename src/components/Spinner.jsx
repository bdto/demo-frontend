import styles from './Spinner.module.css';

export default function Spinner({ size = 'md', label, fullPage = false }) {
  return (
    <div className={`${styles.wrapper} ${fullPage ? styles.fullPage : ''}`}>
      <div className={`${styles.spinner} ${styles[size]}`} role="status" aria-label={label || 'Cargando'} />
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}
