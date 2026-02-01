import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { cartService } from '../utils/cart';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #2D2D2D;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 50;
`;

const Nav = styled.nav`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(to right, #a71fd0, #7f00a5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  font-family: 'Sora', sans-serif;
`;

const DesktopMenu = styled.div`
  display: none;
  gap: 2rem;
  align-items: center;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  color: ${props => props.$isActive ? '#a71fd0' : '#ffffff'};
  text-decoration: none;
  font-weight: ${props => props.$isActive ? '600' : '400'};
  transition: color 0.3s ease;
  font-family: 'Sora', sans-serif;

  &:hover {
    color: #a71fd0;
  }
`;

const CartButton = styled(Link)`
  position: relative;
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: #ffffff;
  transition: background-color 0.3s ease;
  text-decoration: none;
  display: flex;
  align-items: center;

  &:hover {
    background-color: rgba(167, 31, 208, 0.1);
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #a71fd0;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  min-width: 1.25rem;
  text-align: center;
`;

const MobileMenuButton = styled.button`
  display: flex;
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: #ffffff;
  cursor: pointer;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background-color: #0f0f0f;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)<{ $isActive: boolean }>`
  color: ${props => props.$isActive ? '#a71fd0' : '#ffffff'};
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-weight: ${props => props.$isActive ? '600' : '400'};
  transition: all 0.3s ease;
  font-family: 'Sora', sans-serif;

  &:hover {
    background-color: rgba(167, 31, 208, 0.1);
    color: #a71fd0;
  }
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(cartService.getCart().length);
  const location = useLocation();

  React.useEffect(() => {
    const updateCartCount = () => {
      setCartCount(cartService.getCart().reduce((total, item) => total + item.stock_quantity, 0));
    };

    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">Capsule Corp</Logo>

        <DesktopMenu>
          <NavLink to="/" $isActive={isActive('/')}>Inicio</NavLink>
          <NavLink to="/products" $isActive={isActive('/products')}>Productos</NavLink>
          <NavLink to="/about" $isActive={isActive('/about')}>Nosotros</NavLink>
          <NavLink to="/contact" $isActive={isActive('/contact')}>Contacto</NavLink>
          <CartButton to="/cart">
            Carrito
            {cartCount > 0 && <CartBadge>{cartCount}</CartBadge>}
          </CartButton>
        </DesktopMenu>

        <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </MobileMenuButton>
      </Nav>

      <MobileMenu $isOpen={isMenuOpen}>
        <MobileNavLink to="/" $isActive={isActive('/')} onClick={() => setIsMenuOpen(false)}>
          Inicio
        </MobileNavLink>
        <MobileNavLink to="/products" $isActive={isActive('/products')} onClick={() => setIsMenuOpen(false)}>
          Productos
        </MobileNavLink>
        <MobileNavLink to="/about" $isActive={isActive('/about')} onClick={() => setIsMenuOpen(false)}>
          Nosotros
        </MobileNavLink>
        <MobileNavLink to="/contact" $isActive={isActive('/contact')} onClick={() => setIsMenuOpen(false)}>
          Contacto
        </MobileNavLink>
        <MobileNavLink to="/cart" $isActive={isActive('/cart')} onClick={() => setIsMenuOpen(false)}>
          Carrito ({cartCount})
        </MobileNavLink>
      </MobileMenu>
    </HeaderContainer>
  );
};

export default Header;
