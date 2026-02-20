import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import styles from './Products.module.css';

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
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Catalogo de Productos</h1>
        <p className={styles.subtitle}>Encuentra lo que necesitas entre nuestra seleccion</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <button type="submit" className={styles.searchBtn}>Buscar</button>
      </form>

      {/* Category Filter Pills */}
      <div className={styles.filters}>
        <button
          onClick={() => { setSelectedCategory(''); setPage(0); setSearch(''); }}
          className={`${styles.pill} ${!selectedCategory ? styles.pillActive : ''}`}
        >
          Todas
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat.id.toString()); setPage(0); setSearch(''); }}
            className={`${styles.pill} ${selectedCategory === cat.id.toString() ? styles.pillActive : ''}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <Spinner label="Cargando productos..." />
      ) : products.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          message="No se encontraron productos con los filtros seleccionados."
        />
      ) : (
        <div className={styles.grid}>
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className={styles.pageBtn}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Anterior
          </button>
          <span className={styles.pageInfo}>
            {page + 1} de {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className={styles.pageBtn}
          >
            Siguiente
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
