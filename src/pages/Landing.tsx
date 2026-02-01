// src/pages/Landing.tsx
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types/product';
import { productService } from '../utils/supabase';

const Landing: React.FC = () => {
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLatestProducts = async () => {
      try {
        setIsLoading(true);
        // Carga TODOS los productos visibles (getProducts() ya filtra is_hidden=false)
        const allProducts = await productService.getProducts();
        
        // Ordena por fecha de creación (más recientes primero)
        const sorted = [...allProducts].sort((a, b) =>
          (b.created_at ?? '').localeCompare(a.created_at ?? '')
        );
        
        // Toma las últimas 6 cartas
        setLatestProducts(sorted.slice(0, 6));
      } catch (err) {
        console.error('Error loading latest products:', err);
        setError('Failed to load latest cards');
      } finally {
        setIsLoading(false);
      }
    };

    loadLatestProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Cartas Recientes
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Mira las últimas cartas que han salido en la tienda. 
            <br />
            <span className="text-primary font-semibold">
              Entra a <a href="/products" className="underline hover:no-underline">Products</a> para ver todo el catálogo.
            </span>
          </p>
        </section>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading latest cards...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && (
          <section>
            {latestProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg mb-4">
                  Aún no hay cartas disponibles.
                </p>
                <p className="text-gray-500">
                  ¡Sé el primero en agregar productos desde Admin!
                </p>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {latestProducts.map((product) => (
                  <ProductCard key={product.uuid} product={product} />
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
