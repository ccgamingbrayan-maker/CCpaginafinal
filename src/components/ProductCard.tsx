import React from 'react';
import type { Product } from '../types/product';
import { cartService } from '../utils/cart';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { Button, Text } from './styledcomponents'; 

const CardWrapper = styled.div`
  width: 100%;
  max-width: 340px;
  height: 280px;
  background: linear-gradient(145deg, #1F1F1F, #111111);
  border-radius: 14px;
  border: 1px solid rgba(167, 31, 208, 0.15);
  overflow: visible;
  box-shadow: 0 6px 24px rgba(0,0,0,0.6);
  transition: all 0.4s ease;
  display: flex;
  position: relative;
  gap: 0;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(167, 31, 208, 0.35);
  }

  @media (max-width: 700px) {
    max-width: 100%;
    height: auto;
    flex-direction: column;
  }
`;

const ImageArea = styled.div`
  position: relative;
  width: 190px;
  height: 100%;
  border-radius: 14px 0 0 14px;
  overflow: hidden;
  flex-shrink: 0;
  z-index: 2;

  ${CardWrapper}:hover & img {
    transform: scale(1.06);
  }

  @media (max-width: 700px) {
    width: 100%;
    height: 170px;
    border-radius: 14px 14px 0 0;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`;

const CategoryBox = styled.div`
  position: absolute;
  top: 14px;
  right: 14px;
  background: linear-gradient(135deg, rgba(167, 31, 208, 0.95), rgba(255, 107, 157, 0.9));
  backdrop-filter: blur(10px);
  color: white;
  font-size: 10px;
  font-weight: 800;
  padding: 6px 14px;
  border-radius: 18px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 16px rgba(167, 31, 208, 0.4);
`;

const ContentBox = styled.div`
  flex: 1;
  padding: 22px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  background: linear-gradient(to bottom, rgba(31,31,31,0.9), #1F1F1F);

  @media (max-width: 700px) {
    padding: 20px;
  }
`;

const TitleBox = styled.div`
  margin-bottom: 16px;
  flex-shrink: 0;
`;

const CardTitle = styled.h3`
  font-family: 'Sora', sans-serif;
  font-size: 16px;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 10px 0;
  line-height: 1.25;
  word-break: break-word;
  overflow-wrap: break-word;
  max-height: 45px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  @media (max-width: 700px) {
    font-size: 15px;
  }
`;

const CardDescription = styled(Text)`
  color: #D1D5DB !important;
  font-size: 13px !important;
  line-height: 1.45;
  max-height: 55px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  word-break: break-word;

  @media (max-width: 700px) {
    font-size: 12px !important;
    max-height: 45px;
    -webkit-line-clamp: 2;
  }
`;

const PriceButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-top: auto;
  padding-top: 16px;
`;

const PriceBox = styled.div`
  font-family: 'Sora', sans-serif;
  font-size: 24px;
  font-weight: 900;
  background: linear-gradient(135deg, #a71fd0 0%, #ff6b9d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin: 0;
  width: 100%;
  
  @media (max-width: 700px) {
    font-size: 22px;
  }
`;

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const handleAddToCart = () => {
    cartService.addToCart(product);
    toast.success(`${product.name} agregado al carrito!`);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <CardWrapper>
      <ImageArea>
        <CardImage src={product.image_url} alt={product.name} />
        <CategoryBox>{product.category}</CategoryBox>
      </ImageArea>
      
      <ContentBox>
        <TitleBox>
          <CardTitle>{product.name}</CardTitle>
          <CardDescription variant="gray">{product.description}</CardDescription>
        </TitleBox>
        
        <PriceButtonBox>
          <PriceBox>${product.price.toFixed(2)}</PriceBox>
          <Button variant="green" onClick={handleAddToCart} style={{ fontSize: '12px', padding: '8px 20px', width: '100%' }}>
            Comprar
          </Button>
        </PriceButtonBox>
      </ContentBox>
    </CardWrapper>
  );
};

export default ProductCard;
