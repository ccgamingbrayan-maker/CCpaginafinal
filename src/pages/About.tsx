import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container, Tittle, Text } from '../components/styledcomponents';

const PageWrapper = {
  minHeight: '100vh',
  backgroundColor: '#0f0f0f',
};

const MainContent = {
  maxWidth: '64rem',
  margin: '0 auto',
  padding: '3rem 1rem',
};

const Section = {
  textAlign: 'center' as const,
  marginBottom: '3rem',
};

const LargeTitle = {
  fontSize: '2.25rem',
  marginBottom: '1rem',
};

const Subtitle = {
  fontSize: '1.25rem',
};

export default function About() {
  return (
    <div style={PageWrapper}>
      <Header />
      <main style={MainContent}>
        <section style={Section}>
          <Tittle variant="white" style={LargeTitle}>
            Sobre Capsule Corp
          </Tittle>
          <Text variant="gray" style={Subtitle}>
            Tu destino local para todo lo relacionado con hobbies
          </Text>
        </section>
        
        <Container variant="big">
          <Tittle variant="purple">
            Próximamente
          </Tittle>
          <Text variant="white" style={{ marginBottom: '1rem' }}>
            Usa David para generar contenido para esta página
          </Text>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
