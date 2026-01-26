import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Capsule Corp</h1>
          <p className="text-xl text-gray-600">Get in touch with our team</p>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Coming Soon</h2>
          <p className="text-gray-600 mb-4">
            Use Meku to generate content for this page
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}