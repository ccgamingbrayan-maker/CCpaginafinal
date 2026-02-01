import React from 'react';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Landing from './src/pages/Landing';
import About from './src/pages/About';
import Contact from './src/pages/Contact';
import Cart from './src/pages/Cart';
import Admin from './src/pages/Admin';
import NotFound from './src/pages/NotFound';
import Products from './src/pages/Products';


const App: React.FC = () => {
  return (
    <Theme>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/products" element={<Products />} /> {/* Misma página */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </Theme>
  );
};

export default App;
