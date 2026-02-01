import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, EyeOff, LogOut } from 'lucide-react';
import type { Product } from '../types/product';
import { productService } from '../utils/supabase';
import type { NewProductInput } from '../utils/supabase';
import ManualProductForm from '../components/ManualProductForm';
import TCGProductForm from '../components/TCGProductForm';
import { toast } from 'react-toastify';

type AddFormMode = 'manual' | 'tcg' | null;

const Admin: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddForm, setShowAddForm] = useState<AddFormMode>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isOwnerLoggedIn');
    if (!isLoggedIn) {
      navigate('/');
      return;
    }

    loadProducts();
  }, [navigate]);

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products', error);
      toast.error('Failed to load products');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isOwnerLoggedIn');
    navigate('/');
    toast.success('Logged out successfully');
  };

  // Crear producto (desde Manual o TCG)
  const handleAddProduct = async (productData: NewProductInput) => {
    try {
      const created = await productService.createProduct(productData);
      setProducts((prev) => [...prev, created]);
      setShowAddForm(null);
      toast.success('Product added successfully!');
    } catch (error) {
      console.error('Error adding product', error);
      toast.error('Failed to add product');
      throw error;
    }
  };

  // Guardar edición
  const handleUpdateProduct = async (data: NewProductInput) => {
    if (!editingProduct) return;
    try {
      const updated = await productService.updateProduct(editingProduct.uuid, data);
      setProducts((prev) =>
        prev.map((p) => (p.uuid === updated.uuid ? updated : p))
      );
      setEditingProduct(null);
      toast.success('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product', error);
      toast.error('Failed to update product');
      throw error;
    }
  };

  const handleToggleVisibility = async (product: Product) => {
    try {
      const updated = await productService.updateProduct(product.uuid, {
        is_hidden: !product.is_hidden,
      });
      setProducts((prev) =>
        prev.map((p) => (p.uuid === updated.uuid ? updated : p))
      );
      toast.success(
        `Product ${updated.is_hidden ? 'hidden' : 'shown'} successfully`
      );
    } catch (error) {
      console.error('Error updating product', error);
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete ${product.name}?`)) return;
    try {
      await productService.deleteProduct(product.uuid);
      setProducts((prev) => prev.filter((p) => p.uuid !== product.uuid));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product', error);
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-primary">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top actions */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Manage Products</h2>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setShowAddForm('manual');
                setEditingProduct(null);
              }}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Manually</span>
            </button>
            <button
              onClick={() => {
                setShowAddForm('tcg');
                setEditingProduct(null);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add from TCG API</span>
            </button>
          </div>
        </div>

        {/* Add / Edit forms */}
        {showAddForm === 'manual' && !editingProduct && (
          <div className="mb-8">
            <ManualProductForm
              onSubmit={handleAddProduct}
              onCancel={() => setShowAddForm(null)}
            />
          </div>
        )}

        {showAddForm === 'tcg' && !editingProduct && (
          <div className="mb-8">
            <TCGProductForm
              onSubmit={handleAddProduct}
              onCancel={() => setShowAddForm(null)}
            />
          </div>
        )}

        {editingProduct && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">
              Editing: {editingProduct.name}
            </h3>
            <ManualProductForm
              onSubmit={handleUpdateProduct}
              onCancel={() => setEditingProduct(null)}
            />
          </div>
        )}

        {/* Products table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.uuid}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-12 w-12 object-cover rounded-lg"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock_quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.is_hidden
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {product.is_hidden ? 'Hidden' : 'Visible'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleVisibility(product)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          aria-label={
                            product.is_hidden ? 'Show product' : 'Hide product'
                          }
                        >
                          {product.is_hidden ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setShowAddForm(null);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                          aria-label="Edit product"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          aria-label="Delete product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {products.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500 text-lg"
                    >
                      No products found. Add your first product!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
