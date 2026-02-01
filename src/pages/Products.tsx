import React, { useState, useEffect } from 'react';
import { Key } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import LoginModal from '../components/LoginModal';
import type { Product } from '../types/product';
import { productService } from '../utils/supabase';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productService.getProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory === '') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) => product.category === selectedCategory)
      );
    }
  }, [selectedCategory, products]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Header />

      <main className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-16 gap-8">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">Catálogo Completo</h1>
            <p className="text-gray-300 text-lg max-w-2xl">
              Todos los productos disponibles (TCG, Juegos de mesa, Miniaturas, etc.)
            </p>
          </div>

          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center space-x-2 text-gray-500 hover:text-primary transition-colors self-start lg:self-center"
            aria-label="Login de propietario"
          >
            <Key className="h-5 w-5" />
            <span>Propietario</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 products-custom-grid">
          <div className="w-full lg:w-64 lg:flex-shrink-0 lg:sticky lg:top-28 self-start lg:min-h-[500px]">
            <ProductFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          <div className="flex-1 min-h-[600px]">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-24 h-24 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <span className="text-3xl">🛒</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-300 mb-4">
                  Sin productos
                </h2>
                <p className="text-gray-400 text-lg max-w-md mx-auto">
                  No hay productos disponibles en esta categoría.
                </p>
              </div>
            ) : (
              <div className="grid gap-12 grid grid-cols-1 md:grid-cols-2 custom-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.uuid} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default Products;
