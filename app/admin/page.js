'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../auth/AuthContext';

const stats = [
  { label: 'Total users', value: '—' },
  { label: 'Verifications today', value: '—' },
  { label: 'Pending reviews', value: '—' },
];

const actions = [
  { title: 'Manage users', description: 'View and edit user accounts' },
  { title: 'View reports', description: 'Verification volume and trends' },
  { title: 'System settings', description: 'Configure payers and fee schedules' },
  { title: 'Activity logs', description: 'Audit trail of system activity' },
];

export default function AdminPage() {
  const { user, hasRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !hasRole('admin')) {
      // Redirect non-admin users to the home page
      router.push('/');
    }
  }, [loading, hasRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  return (
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
            <span className="text-sm font-semibold text-slate-900 tracking-tight">Admin</span>
          </div>
          <a
            href="/"
            className="text-sm font-medium text-blue-700 hover:text-blue-800"
          >
            &larr; Back to verification
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Signed in as {user?.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map(({ label, value }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
              <p className="mt-1.5 text-2xl font-semibold text-slate-900 tabular-nums">{value}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map(({ title, description }) => (
            <button
              key={title}
              type="button"
              className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 text-left hover:border-slate-300 hover:bg-slate-50 transition-colors"
            >
              <p className="text-sm font-semibold text-slate-900">{title}</p>
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
