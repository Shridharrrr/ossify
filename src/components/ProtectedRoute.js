'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/auth`);
    }
  }, [user, loading, router, pathname]);

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              style={{ color: '#52525b' }}
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              style={{ color: '#ffffff' }}
            />
          </svg>
        </div>
        <p className="text-neutral-400 text-sm">Just Calm Down</p>
      </div>
    </div>
    );
  }

  // Show nothing while redirecting
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              style={{ color: '#52525b' }}
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              style={{ color: '#ffffff' }}
            />
          </svg>
        </div>
        <p className="text-neutral-400 text-sm">Redirecting</p>
      </div>
    </div>
    );
  }

  // Render children if user is authenticated
  return children;
};

export default ProtectedRoute;