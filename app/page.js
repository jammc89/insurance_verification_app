'use client';

import ProtectedRoute from './components/ProtectedRoute';
import { InsuranceVerificationApp } from './InsuranceVerificationApp';
import { useAuth } from './auth/AuthContext';

export default function Home() {
  const { user, logout, hasRole } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-slate-900 tracking-tight">
                Insurance Verification
              </span>
            </div>
            <div className="flex items-center gap-4">
              {hasRole('admin') && (
                <a
                  href="/admin"
                  className="text-sm font-medium text-blue-700 hover:text-blue-800"
                >
                  Admin
                </a>
              )}
              <span className="hidden sm:block text-sm text-slate-500">{user?.email}</span>
              <button
                onClick={logout}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pb-16">
          <InsuranceVerificationApp />
        </main>
      </div>
    </ProtectedRoute>
  );
}
