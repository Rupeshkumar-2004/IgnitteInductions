import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Reusable Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-6xl font-extrabold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                IGNITE
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Where Innovation Meets Passion. Join our community of tech enthusiasts,
              innovators, and dreamers shaping the future together.
            </p>
            <div className="flex justify-center gap-4">
              {!user && (
                <>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition transform hover:scale-105"
                  >
                    Start Your Journey
                  </Link>
                  <Link
                    to="/about"
                    className="bg-white text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition"
                  >
                    Learn More
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Active Members</div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition">
              <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600 font-medium">Projects Completed</div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition">
              <div className="text-4xl font-bold text-indigo-600 mb-2">20+</div>
              <div className="text-gray-600 font-medium">Events Hosted</div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-32">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
              Why Join IGNITE?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                <div className="text-4xl mb-4">💡</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Learn & Grow
                </h3>
                <p className="text-gray-600">
                  Access workshops, bootcamps, and mentorship programs to enhance your skills.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Build Projects
                </h3>
                <p className="text-gray-600">
                  Work on real-world projects and build your portfolio with hands-on experience.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Network
                </h3>
                <p className="text-gray-600">
                  Connect with like-minded peers, alumni, and industry professionals.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Compete
                </h3>
                <p className="text-gray-600">
                  Participate in hackathons, coding competitions, and innovation challenges.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Lead
                </h3>
                <p className="text-gray-600">
                  Take initiative, lead teams, and develop your leadership skills.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Innovate
                </h3>
                <p className="text-gray-600">
                  Turn your ideas into reality with resources and support from the club.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-32 mb-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Ignite Your Future?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join hundreds of students already making an impact
            </p>
            {!user && (
              <Link
                to="/register"
                className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg text-lg font-semibold hover:shadow-2xl transition transform hover:scale-105"
              >
                Apply for Induction Now
              </Link>
            )}
          </div>
        </section>
      </main>

      {/* Reusable Footer */}
      <Footer />
    </div>
  );
}