export default function ProductCard({ product }) {
  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '1rem',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px' }}
        />
      )}
      <h3 style={{ margin: '0.5rem 0', color: '#1a1a2e' }}>{product.name}</h3>
      <p style={{ color: '#666', fontSize: '0.9rem', minHeight: '40px' }}>
        {product.description}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#e94560' }}>
          ${product.price}
        </span>
        <span style={{
          padding: '0.25rem 0.5rem',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
          fontSize: '0.8rem',
          color: '#666'
        }}>
          {product.categoryName}
        </span>
      </div>
      <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
        Stock: {product.stock} unidades
      </p>
    </div>
  );
}