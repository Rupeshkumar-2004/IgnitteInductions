import React, { useEffect, useState } from 'react';
import { applicationAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    motivation: '',
    skills: '', // We will parse this string into an array
    previousExperience: ''
  });
  const [submitStatus, setSubmitStatus] = useState({ loading: false, error: '' });

  // Fetch application status on mount
  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res = await applicationAPI.getMyApplication();
        setApplication(res.data.data);
      } catch (error) {
        // If 404, it means user hasn't applied yet, which is fine
        if (error.response?.status !== 404) {
          console.error("Error fetching application", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitStatus({ loading: true, error: '' });

    // Validate skills
    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s !== '');
    if (skillsArray.length === 0) {
        setSubmitStatus({ loading: false, error: 'Please enter at least one skill' });
        return;
    }

    try {
      const res = await applicationAPI.submit({
        ...formData,
        skills: skillsArray
      });
      setApplication(res.data.data); // Update state to show "Status" view
    } catch (err) {
      setSubmitStatus({ loading: false, error: err.response?.data?.message || 'Submission failed' });
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">Welcome, {user?.fullName}</h1>
            <button onClick={logout} className="text-red-600 hover:text-red-800">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-10 px-4">
        {application ? (
          // VIEW: Application Status
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Application Status</h2>
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6 
              ${application.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                application.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'}`}>
              {application.status.toUpperCase()}
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Applied On</dt>
                  <dd className="mt-1 text-sm text-gray-900">{new Date(application.createdAt).toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Skills</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {application.skills.join(', ')}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        ) : (
          // VIEW: Application Form
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Induction Application Form</h2>
            {submitStatus.error && <div className="bg-red-50 text-red-500 p-3 mb-4 rounded">{submitStatus.error}</div>}
            
            <form onSubmit={handleApply} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Why do you want to join Ignite?</label>
                <textarea
                  required
                  minLength={50}
                  maxLength={1000}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Tell us about your motivation (min 50 chars)..."
                  value={formData.motivation}
                  onChange={(e) => setFormData({...formData, motivation: e.target.value})}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.motivation.length}/1000 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Skills (Comma separated)</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. React, Node.js, Public Speaking"
                  value={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Previous Experience (Optional)</label>
                <textarea
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  value={formData.previousExperience}
                  onChange={(e) => setFormData({...formData, previousExperience: e.target.value})}
                />
              </div>

              <button
                type="submit"
                disabled={submitStatus.loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
              >
                {submitStatus.loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}