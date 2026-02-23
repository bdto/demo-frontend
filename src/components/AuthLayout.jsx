import { motion } from 'framer-motion';
import styles from './AuthLayout.module.css';

export default function AuthLayout({ title, subtitle, icon, children }) {
  return (
    <div className={styles.container}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className={styles.header}>
          {icon && (
            <div className={styles.iconWrap}>
              {icon}
            </div>
          )}
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {children}
      </motion.div>
    </div>
  );
}
