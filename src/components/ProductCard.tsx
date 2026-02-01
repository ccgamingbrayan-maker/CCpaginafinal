import React from 'react';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '../types/product';
import { cartService } from '../utils/cart';
import { toast } from 'react-toastify';
import styled from 'styled-components';

// Styled Components
const Card = styled.div`
  background-color: #2D2D2D;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  font-family: 'Sora', sans-serif;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 1rem;
  position: relative;
`;

const CategoryBadge = styled.span`
  position: absolute;
  top: -8rem;
  right: 1rem;
  background-color: #a71fd0;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  text-transform: uppercase;
`;

const ProductTitle = styled.h3`
  color: #ffffff;
  font-size: 1.125rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const ProductDescription = styled.p`
  color: #D2D2D2;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  line-height: 1.4;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Price = styled.span`
  color: #a71fd0;
  font-size: 1.25rem;
  font-weight: bold;
`;

const AddButton = styled.button`
  background-color: #40C485;
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s ease;
  font-family: 'Sora', sans-serif;

  &:hover {
    background-color: #008f4a;
  }
`;

// Component
interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleAddToCart = () => {
    cartService.addToCart(product);
    toast.success(`${product.name} added to cart!`);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <Card>
      <CardImage src={product.image_url} alt={product.name} />
      <CardContent>
        <CategoryBadge>{product.category}</CategoryBadge>
        <ProductTitle>{product.name}</ProductTitle>
        <ProductDescription>{product.description}</ProductDescription>
        <PriceRow>
          <Price>${product.price.toFixed(2)}</Price>
          <AddButton onClick={handleAddToCart}>
            <ShoppingCart size={16} />
            Add to Cart
          </AddButton>
        </PriceRow>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
