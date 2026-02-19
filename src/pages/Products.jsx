import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryId || '');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.data));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url;
      if (search.trim()) {
        url = `/products/search?keyword=${search}&page=${page}&size=12`;
      } else if (selectedCategory) {
        url = `/products/category/${selectedCategory}?page=${page}&size=12`;
      } else {
        url = `/products?page=${page}&size=12&sort=name,asc`;
      }

      const response = await api.get(url);
      const data = response.data.data;
      setProducts(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchProducts();
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem', color: '#1a1a2e' }}>Catalogo de Productos</h1>

      {/* Barra de busqueda */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '200px', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem' }}
        />
        <button type="submit" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#1a1a2e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Buscar
        </button>
      </form>

      {/* Filtro por categoria */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => { setSelectedCategory(''); setPage(0); setSearch(''); }}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: !selectedCategory ? '#1a1a2e' : '#f0f0f0',
            color: !selectedCategory ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Todas
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat.id.toString()); setPage(0); setSearch(''); }}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: selectedCategory === cat.id.toString() ? '#1a1a2e' : '#f0f0f0',
              color: selectedCategory === cat.id.toString() ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid de productos */}
      {loading ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Cargando...</p>
      ) : products.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No se encontraron productos</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Paginacion */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
          <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
            style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', backgroundColor: page === 0 ? '#f9f9f9' : 'white' }}>
            Anterior
          </button>
          <span style={{ padding: '0.5rem 1rem', color: '#666' }}>
            Pagina {page + 1} de {totalPages}
          </span>
          <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
            style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', backgroundColor: page >= totalPages - 1 ? '#f9f9f9' : 'white' }}>
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}