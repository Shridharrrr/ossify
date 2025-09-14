'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppSidebar from '@/components/AppSidebar';

export default function ProfilePage() {
  const { user, userData, updateUserPreferences } = useAuth(); // Use userData instead of user
  const [preferences, setPreferences] = useState({
    languages: [],
    experienceLevel: 'beginner',
    topics: [],
    notifications: {
      recommendations: true,
      goodFirstIssues: false
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Initialize preferences from userData if available
  useEffect(() => {
    if (userData?.preferences) {
      setPreferences(userData.preferences);
    }
  }, [userData]); // Depend on userData instead of user

  const handleLanguageToggle = (language) => {
    setPreferences(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(lang => lang !== language)
        : [...prev.languages, language]
    }));
  };

  const handleTopicToggle = (topic) => {
    setPreferences(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }));
  };

  const handleNotificationToggle = (type) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  const handleExperienceChange = (e) => {
    setPreferences(prev => ({
      ...prev,
      experienceLevel: e.target.value
    }));
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    setSaveStatus('saving');
    
    try {
      await updateUserPreferences(preferences);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const programmingLanguages = ['JavaScript', 'Python', 'Java', 'TypeScript', 'Go', 'Rust'];
  const interestTopics = ['Web Development', 'Machine Learning', 'DevOps', 'Mobile', 'Data Science', 'Security'];
  const experienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  return (
    <ProtectedRoute>
      <AppSidebar>
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Profile Settings
            </h1>
            <p className="text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="text-center">
                  {user?.photoURL && (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-24 h-24 rounded-full mx-auto mb-4"
                    />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user?.displayName}
                  </h3>
                  <p className="text-gray-600 text-sm">{user?.email}</p>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-gray-500">
                      Signed in with {user?.providerData?.[0]?.providerId}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Preferences */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Preferences
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Programming Languages
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {programmingLanguages.map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => handleLanguageToggle(lang)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            preferences.languages.includes(lang)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Level
                    </label>
                    <select 
                      value={preferences.experienceLevel}
                      onChange={handleExperienceChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {experienceLevels.map(level => (
                        <option key={level.toLowerCase()} value={level.toLowerCase()}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interested Topics
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {interestTopics.map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => handleTopicToggle(topic)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            preferences.topics.includes(topic)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                          }`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <button 
                    onClick={handleSavePreferences}
                    disabled={isSaving}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving...' : 'Save Preferences'}
                  </button>
                  {saveStatus === 'success' && (
                    <span className="text-green-600 text-sm">✓ Preferences saved!</span>
                  )}
                  {saveStatus === 'error' && (
                    <span className="text-red-600 text-sm">Error saving preferences</span>
                  )}
                </div>
              </div>

              {/* GitHub Integration */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  GitHub Integration
                </h3>
                
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <div>
                      <p className="font-medium text-green-900">Connected to GitHub</p>
                      <p className="text-sm text-green-700">
                        {user?.providerData?.[0]?.providerId === 'github.com' ? 'Active' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  <button className="text-green-700 hover:text-green-800 font-medium text-sm">
                    Manage
                  </button>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Notifications
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">New repository recommendations</p>
                      <p className="text-sm text-gray-500">Get notified when we find new projects for you</p>
                    </div>
                    <button 
                      onClick={() => handleNotificationToggle('recommendations')}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                        preferences.notifications.recommendations ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        preferences.notifications.recommendations ? 'translate-x-5' : 'translate-x-0'
                      }`}></span>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Good first issues</p>
                      <p className="text-sm text-gray-500">Alert me about beginner-friendly issues in saved repos</p>
                    </div>
                    <button 
                      onClick={() => handleNotificationToggle('goodFirstIssues')}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                        preferences.notifications.goodFirstIssues ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        preferences.notifications.goodFirstIssues ? 'translate-x-5' : 'translate-x-0'
                      }`}></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppSidebar>
    </ProtectedRoute>
  );
}