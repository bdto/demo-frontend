import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import toast from 'react-hot-toast';
import FormInput from '../components/FormInput';
import Spinner from '../components/Spinner';
import ConfirmModal from '../components/ConfirmModal';
import styles from './AdminProducts.module.css';

const emptyForm = { name: '', description: '', price: '', stock: '', categoryId: '', imageUrl: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/admin/products/${deleteTarget}`);
      toast.success('Producto eliminado');
      fetchProducts();
    } catch (error) {
      toast.error('Error al eliminar');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditing(null);
  };

  return (
    <div className={styles.page}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className={styles.title}>
          Gestion de Productos
          <span className={styles.badge}>Admin</span>
        </h1>
        <p className={styles.subtitle}>Crea, edita y elimina productos del catalogo</p>
      </motion.div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <form
          onSubmit={handleSubmit}
          className={`${styles.formCard} ${editing ? styles.formCardEditing : ''}`}
        >
          <h2 className={styles.formTitle}>
            <span className={styles.formTitleDot} />
            {editing ? 'Editando producto' : 'Nuevo producto'}
          </h2>
          <div className={styles.formGrid}>
            <FormInput
              label="Nombre"
              name="name"
              placeholder="Nombre del producto"
              value={form.name}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Descripcion"
              name="description"
              placeholder="Descripcion breve"
              value={form.description}
              onChange={handleChange}
            />
            <FormInput
              label="Precio"
              name="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.price}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Stock"
              name="stock"
              type="number"
              placeholder="0"
              value={form.stock}
              onChange={handleChange}
            />
            <FormInput
              label="Categoria"
              name="categoryId"
              as="select"
              value={form.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </FormInput>
            <FormInput
              label="URL de imagen"
              name="imageUrl"
              placeholder="https://... (opcional)"
              value={form.imageUrl}
              onChange={handleChange}
            />
            <div className={styles.formActions}>
              <button
                type="submit"
                disabled={loading}
                className={editing ? styles.btnUpdate : styles.btnCreate}
              >
                {loading ? <Spinner size="sm" /> : editing ? 'Actualizar' : 'Crear producto'}
              </button>
              {editing && (
                <button type="button" onClick={handleCancel} className={styles.btnCancel}>
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </form>
      </motion.div>

      {/* Table Card */}
      <motion.div
        className={styles.tableCard}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>Productos</span>
          <span className={styles.tableCount}>{products.length} items</span>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoria</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td className={styles.productName}>{product.name}</td>
                  <td className={styles.productPrice}>${product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={styles.productCategory}>{product.categoryName}</span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button onClick={() => handleEdit(product)} className={styles.btnEdit}>
                        Editar
                      </button>
                      <button onClick={() => setDeleteTarget(product.id)} className={styles.btnDelete}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteTarget !== null}
        title="Eliminar producto"
        message="Esta accion no se puede deshacer. El producto sera eliminado permanentemente del catalogo."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
