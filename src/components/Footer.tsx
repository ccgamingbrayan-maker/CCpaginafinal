import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #0f0f0f;
  color: #D2D2D2;
  padding: 3rem 1rem 1rem;
  margin-top: 4rem;
  font-family: 'Sora', sans-serif;
`;

const FooterContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FooterSection = styled.div`
  h3 {
    color: #ffffff;
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 0.5rem;
  }

  a {
    color: #D2D2D2;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #a71fd0;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  color: #D2D2D2;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(167, 31, 208, 0.1);
    color: #a71fd0;
  }
`;

const Copyright = styled.div`
  max-width: 1280px;
  margin: 2rem auto 0;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  color: #D2D2D2;
  font-size: 0.875rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>Nosotros</h3>
          <p>Tu tienda especializada en cartas coleccionables y hobbies.</p>
        </FooterSection>

        <FooterSection>
          <h3>Enlaces Rápidos</h3>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/products">Productos</a></li>
            <li><a href="/about">Nosotros</a></li>
            <li><a href="/contact">Contacto</a></li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h3>Síguenos</h3>
          <SocialLinks>
            <SocialLink href="#" aria-label="Facebook">
              <Facebook size={20} />
            </SocialLink>
            <SocialLink href="#" aria-label="Instagram">
              <Instagram size={20} />
            </SocialLink>
            <SocialLink href="#" aria-label="Twitter">
              <Twitter size={20} />
            </SocialLink>
          </SocialLinks>
        </FooterSection>
      </FooterContent>

      <Copyright>
        © {new Date().getFullYear()} Capsule Corp. Todos los derechos reservados.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
