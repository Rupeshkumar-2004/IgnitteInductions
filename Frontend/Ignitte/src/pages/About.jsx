import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-grow max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About IGNITE</h1>
        <div className="bg-white p-8 rounded-xl shadow-md">
          <p className="text-lg text-gray-700 mb-6">
            Ignite is the premier technical club of our college, dedicated to fostering innovation 
            and technical excellence among students.
          </p>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            To provide a platform for students to explore, learn, and create. We believe in 
            learning by doing and peer-to-peer mentorship.
          </p>
          <h2 className="text-2xl font-bold mb-4">Domains</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Web & App Development</li>
            <li>Machine Learning & AI</li>
            <li>Competitive Programming</li>
            <li>Cybersecurity</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}