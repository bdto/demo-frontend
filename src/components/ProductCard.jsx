import { motion } from 'framer-motion';
import styles from './ProductCard.module.css';

function getStockStatus(stock) {
  if (stock <= 0) return { label: 'Agotado', className: styles.stockOut };
  if (stock <= 5) return { label: `${stock} und.`, className: styles.stockLow };
  return { label: `${stock} und.`, className: styles.stockOk };
}

export default function ProductCard({ product, index = 0 }) {
  const stockStatus = getStockStatus(product.stock);

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className={styles.imageWrap}>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div className={styles.placeholder}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
            </svg>
          </div>
        )}
        {product.categoryName && (
          <span className={styles.categoryBadge}>{product.categoryName}</span>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>

        <div className={styles.footer}>
          <span className={styles.price}>${product.price}</span>
          <span className={`${styles.stock} ${stockStatus.className}`}>
            <span className={styles.stockDot} />
            {stockStatus.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
