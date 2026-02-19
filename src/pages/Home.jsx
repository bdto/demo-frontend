import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.error('Error cargando categorias:', err));
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#1a1a2e' }}>Bienvenido a Demo App</h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Explora nuestro catalogo de productos</p>
      </div>

      <h2 style={{ marginBottom: '1.5rem', color: '#1a1a2e' }}>Categorias</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/products?category=${category.id}`}
            style={{
              textDecoration: 'none',
              padding: '2rem',
              backgroundColor: '#1a1a2e',
              color: 'white',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <h3 style={{ marginBottom: '0.5rem' }}>{category.name}</h3>
            <p style={{ color: '#a0a0a0', fontSize: '0.9rem' }}>{category.description}</p>
            <span style={{ marginTop: '1rem', display: 'inline-block', color: '#ffd700' }}>
              {category.productCount} productos
            </span>
          </Link>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link
          to="/products"
          style={{
            display: 'inline-block',
            padding: '0.75rem 2rem',
            backgroundColor: '#e94560',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '1.1rem'
          }}
        >
          Ver todos los productos
        </Link>
      </div>
    </div>
  );
}