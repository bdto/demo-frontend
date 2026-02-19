import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const emptyForm = { name: '', description: '', price: '', stock: '', categoryId: '', imageUrl: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    api.get('/categories').then((res) => setCategories(res.data.data));
  }, []);

  const fetchProducts = async () => {
    const res = await api.get('/products?page=0&size=100&sort=name,asc');
    setProducts(res.data.data.content);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        categoryId: parseInt(form.categoryId)
      };

      if (editing) {
        await api.put(`/admin/products/${editing}`, payload);
        toast.success('Producto actualizado');
      } else {
        await api.post('/admin/products', payload);
        toast.success('Producto creado');
      }

      setForm(emptyForm);
      setEditing(null);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock?.toString() || '0',
      categoryId: product.categoryId.toString(),
      imageUrl: product.imageUrl || '',
    });
    setEditing(product.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Eliminar este producto?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success('Producto eliminado');
      fetchProducts();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditing(null);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', color: '#1a1a2e' }}>Admin - Gestion de Productos</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
        padding: '1.5rem',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required
          style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }} />
        <input name="description" placeholder="Descripcion" value={form.description} onChange={handleChange}
          style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }} />
        <input name="price" type="number" step="0.01" placeholder="Precio" value={form.price} onChange={handleChange} required
          style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }} />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange}
          style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }} />
        <select name="categoryId" value={form.categoryId} onChange={handleChange} required
          style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}>
          <option value="">Seleccionar categoria</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <input name="imageUrl" placeholder="URL de imagen (opcional)" value={form.imageUrl} onChange={handleChange}
          style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }} />

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" disabled={loading}
            style={{ flex: 1, padding: '0.75rem', backgroundColor: editing ? '#e94560' : '#1a1a2e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {loading ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}
          </button>
          {editing && (
            <button type="button" onClick={handleCancel}
              style={{ padding: '0.75rem 1rem', backgroundColor: '#666', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Tabla */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
          <thead>
            <tr style={{ backgroundColor: '#1a1a2e', color: 'white' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Nombre</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Precio</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Stock</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Categoria</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.75rem' }}>{product.id}</td>
                <td style={{ padding: '0.75rem' }}>{product.name}</td>
                <td style={{ padding: '0.75rem' }}>${product.price}</td>
                <td style={{ padding: '0.75rem' }}>{product.stock}</td>
                <td style={{ padding: '0.75rem' }}>{product.categoryName}</td>
                <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEdit(product)}
                    style={{ padding: '0.4rem 0.8rem', backgroundColor: '#0f3460', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(product.id)}
                    style={{ padding: '0.4rem 0.8rem', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}