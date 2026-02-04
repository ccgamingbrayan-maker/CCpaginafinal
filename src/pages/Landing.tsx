import React, { useEffect, useState, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types/product';
import { productService } from '../utils/supabase';
import { Link } from 'react-router-dom';


const Landing: React.FC = () => {
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const tcgImages = [
    'https://tcgplayer-cdn.tcgplayer.com/product/587966_in_1000x1000.jpg',
    'https://tcgplayer-cdn.tcgplayer.com/product/676096_in_1000x1000.jpg',
    'https://tcgplayer-cdn.tcgplayer.com/product/518155_in_1000x1000.jpg',
    'https://tcgplayer-cdn.tcgplayer.com/product/587959_in_1000x1000.jpg',
    'https://tcgplayer-cdn.tcgplayer.com/product/676102_in_1000x1000.jpg',
    'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/one-piece/OP08/OP08-118_p2_EN.webp',
    'https://tcgplayer-cdn.tcgplayer.com/product/632499_in_1000x1000.jpg',
    'https://tcgplayer-cdn.tcgplayer.com/product/632503_in_1000x1000.jpg',
    'https://tcgplayer-cdn.tcgplayer.com/product/670642_in_1000x1000.jpg',
    'https://tcgplayer-cdn.tcgplayer.com/product/632503_in_1000x1000.jpg',
  ];

  useEffect(() => {
    const loadLatestProducts = async () => {
      try {
        setIsLoading(true);
        const allProducts = await productService.getProducts();
        const sorted = [...allProducts].sort((a, b) =>
          (b.created_at ?? '').localeCompare(a.created_at ?? '')
        );
        setLatestProducts(sorted.slice(0, 6));
      } catch (err) {
        console.error('Error loading latest products:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadLatestProducts();
  }, []);

  useEffect(() => {
    let currentIndex = 0;
    const images = document.querySelectorAll('.img');
    const interval = setInterval(() => {
      if (images[currentIndex]) {
        images[currentIndex].classList.remove('active');
      }
      currentIndex = (currentIndex + 1) % tcgImages.length;
      if (images[currentIndex]) {
        images[currentIndex].classList.add('active');
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / 15;
      const y = (e.clientY - rect.top - rect.height / 2) / 15;

      const matrix = new DOMMatrix()
        .translate(0, 0, 0)
        .rotateAxisAngle(1, 0, 0, y * 0.3)
        .rotateAxisAngle(0, 1, 0, -x * 0.3)
        .scale3d(1.03, 1.03, 1)
        .toString();
      
      card.style.transform = matrix;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .heroSection {
          min-height: 70vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 4rem;
          padding: 2rem;
        }
        .card-container {
          width: 320px;
          height: 450px;
          perspective: 1200px;
          flex-shrink: 0;
        }
        .card {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: box-shadow 0.4s ease;
          pointer-events: all;
          border-radius: 15px;
          overflow: hidden;
        }
        /* Bordes curvos TCG oficiales EXACTOS */
        .card-images, .shine {
          border-bottom-left-radius: 4.25% 3%;
          border-bottom-right-radius: 4.25% 3%;
          border-top-left-radius: 4.35% 3%;
          border-top-right-radius: 4.25% 3%;
          overflow: hidden;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
        }
        .card-images {
          position: relative;
          transform: translateZ(4px);
        }
        .img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 1s ease-in-out;
          opacity: 0;
        }
        .img.active {
          opacity: 1;
        }
        /* SHINE FUERTE EXACTO */
        .shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 40%, rgba(255,255,255,0.2) 60%, transparent 100%);
          transform: translateZ(3px);
          transition: left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          pointer-events: none;
        }
        /* HOVER EXACTO */
        .card:hover {
          box-shadow: 
            0 0 50px rgba(255,255,255,0.6),
            0 0 100px rgba(222,175,79,0.8),
            inset 0 0 50px rgba(255,255,255,0.2);
        }
        .card:hover .shine {
          left: 140%;
        }
        .heroContent {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          max-width: 500px;
        }
        @media (min-width: 1024px) {
          .heroSection {
            flex-direction: row;
            gap: 6rem;
          }
          .heroContent {
            text-align: left;
            align-items: flex-start;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .img, .shine { transition: none; }
          .card { transform: none !important; }
        }
      `}</style>

      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <section className="heroSection">
          <div className="heroContent">
            <h1 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-2xl">
              Cartas Recientes
            </h1>
            <p className="text-2xl text-gray-300 mb-12 max-w-lg leading-relaxed">
              Mira las últimas cartas que han salido en la tienda.
            </p>
            <Link
  to="/products"
  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-10 py-5 rounded-2xl text-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 inline-flex items-center gap-3"
>
  Catálogo Completo
</Link>

          </div>

          <div className="card-container">
            <div className="card" ref={cardRef}>
              <div className="card-images">
                {tcgImages.map((src, index) => (
                  <img
                    key={index}
                    className={`img ${index === currentImageIndex ? 'active' : ''}`}
                    src={src}
                    alt={`TCG Card ${index + 1}`}
                    loading="lazy"
                  />
                ))}
                <div className="shine"></div>
              </div>
            </div>
          </div>
        </section>

        {!isLoading && (
          <section className="mt-24">
            {latestProducts.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <span className="text-4xl">🃏</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-300 mb-6">
                  ¡Sin cartas aún!
                </h2>
                <p className="text-gray-500 text-xl max-w-md mx-auto">
                  Sé el primero en agregar productos desde <strong>Admin</strong>
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-4xl font-bold mb-16 text-center text-white">
                  Últimas Adiciones
                </h2>
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {latestProducts.map((product) => (
                    <ProductCard key={product.uuid} product={product} />
                  ))}
                </div>
              </>
            )}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
