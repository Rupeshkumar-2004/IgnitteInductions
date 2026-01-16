import React, { useEffect, useState } from 'react';
import { adminAPI } from '../utils/api';
import Navbar from '../components/Navbar';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // You'll need to implement this endpoint in backend later if it doesn't exist
        const res = await adminAPI.getDashboardStats(); 
        setStats(res.data.data);
      } catch (error) {
        console.error("Failed to load admin stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        {loading ? (
          <p>Loading stats...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium">Total Applications</h3>
              <p className="text-3xl font-bold text-blue-600">{stats?.total || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium">Pending</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats?.pending || 0}</p>
            </div>
            {/* Add more stat cards here */}
          </div>
        )}
        
        {/* Placeholder for Applications Table */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Recent Applications</h2>
          <p className="text-gray-500">List of applicants will appear here...</p>
        </div>
      </div>
    </div>
  );
}