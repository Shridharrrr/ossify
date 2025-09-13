'use client';

import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Dashboard() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // Redirect will happen automatically via AuthContext
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-semibold text-gray-900">
                Dashboard
              </h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {user?.photoURL && (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-700">
                    {user?.displayName}
                  </span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded border hover:bg-gray-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to Ossify! 👋
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                You're successfully authenticated and ready to discover amazing open source projects.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">User Information</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Email:</span> {user?.email}</p>
                  <p><span className="font-medium">Name:</span> {user?.displayName}</p>
                  <p><span className="font-medium">Provider:</span> {user?.providerData?.[0]?.providerId}</p>
                  <p><span className="font-medium">User ID:</span> {user?.uid}</p>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-gray-900 mb-2">Discover Repositories</h4>
                    <p className="text-sm text-gray-600 mb-3">Find open source projects to contribute to</p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Start Exploring →
                    </button>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-gray-900 mb-2">Setup Profile</h4>
                    <p className="text-sm text-gray-600 mb-3">Configure your preferences and skills</p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Setup Profile →
                    </button>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-gray-900 mb-2">View Collections</h4>
                    <p className="text-sm text-gray-600 mb-3">Manage your saved repositories</p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View Collections →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}