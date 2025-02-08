'use client';

import ProtectedRoute from './components/ProtectedRoute';
import { InsuranceVerificationApp } from './InsuranceVerificationApp';
import { useAuth } from './auth/AuthContext';

export default function Home() {
  const { user, logout, hasRole } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Insurance Verification</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{user?.email}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          {/* Display admin link only if the user is an admin */}
          {hasRole('admin') && (
            <div className="max-w-7xl mx-auto p-4">
              <a
                href="/admin"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Go to Admin Dashboard
              </a>
            </div>
          )}
          <InsuranceVerificationApp />
        </main>
      </div>
    </ProtectedRoute>
  );
}
