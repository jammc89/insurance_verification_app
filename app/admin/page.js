'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../auth/AuthContext';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome, {user?.email}! Only admins can see this page.</p>
      {/* Add admin-specific functionality here */}
    </div>
  );
}
