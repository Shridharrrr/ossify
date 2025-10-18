'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppSidebar from '@/components/AppSidebar';
import { Rajdhani } from "next/font/google";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: "500",
});

export default function ProfilePage() {
  const { user, userData, updateUserPreferences } = useAuth();
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
  }, [userData]);

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
        <div className="p-4 sm:p-6 lg:p-8 bg-black min-h-screen">
          <div className="mb-6 lg:mb-8">
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${rajdhani.className} text-white mb-2`}>
              Profile Settings
            </h1>
            <p className="text-neutral-400 font-medium text-sm sm:text-base">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Info */}
            <div className="lg:col-span-1">
              <div className="bg-neutral-900/10 border border-neutral-800 rounded-none p-6">
                <div className="text-center">
                  {user?.photoURL && (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-neutral-700"
                    />
                  )}
                  <h3 className="text-lg font-semibold text-white">
                    {user?.displayName}
                  </h3>
                  <p className="text-neutral-400 text-sm mt-1">{user?.email}</p>
                  <div className="mt-4 pt-4 border-t border-neutral-800">
                    <p className="text-xs text-neutral-500">
                      Signed in with {user?.providerData?.[0]?.providerId}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Preferences */}
              <div className="bg-neutral-900/10 border border-neutral-800 rounded-none p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Preferences
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-3">
                      Preferred Programming Languages
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {programmingLanguages.map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => handleLanguageToggle(lang)}
                          className={`px-3 py-1.5 rounded-sm text-sm transition-all duration-200 border-2 ${
                            preferences.languages.includes(lang)
                              ? 'bg-white text-black border-white font-medium'
                              : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:border-neutral-500 hover:text-white'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Experience Level
                    </label>
                    <select 
                      value={preferences.experienceLevel}
                      onChange={handleExperienceChange}
                      className="w-full px-3 py-2 bg-neutral-800 border-2 border-neutral-700 text-white rounded-sm outline-none transition-all duration-200"
                    >
                      {experienceLevels.map(level => (
                        <option key={level.toLowerCase()} value={level.toLowerCase()}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-3">
                      Interested Topics
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {interestTopics.map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => handleTopicToggle(topic)}
                          className={`px-3 py-1.5 rounded-sm text-sm transition-all duration-200 border-2 ${
                            preferences.topics.includes(topic)
                              ? 'bg-white text-black border-white font-medium'
                              : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:border-neutral-500 hover:text-white'
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
                    className="bg-white text-black px-4 py-2 rounded-none hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium border border-white"
                  >
                    {isSaving ? 'Saving...' : 'Save Preferences'}
                  </button>
                  {saveStatus === 'success' && (
                    <span className="text-green-400 text-sm">✓ Preferences saved!</span>
                  )}
                  {saveStatus === 'error' && (
                    <span className="text-red-400 text-sm">Error saving preferences</span>
                  )}
                </div>
              </div>

              {/* GitHub Integration */}
              <div className="bg-neutral-900/10 border border-neutral-800 rounded-none p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  GitHub Integration
                </h3>
                
                <div className="flex items-center justify-between p-4 bg-green-400/10 border border-green-500/30 rounded-none">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-green-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <div>
                      <p className="font-medium text-green-400">Connected to GitHub</p>
                      <p className="text-sm text-green-300">
                        {user?.providerData?.[0]?.providerId === 'github.com' ? 'Active' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  <button className="text-green-400 hover:text-green-300 font-medium text-sm transition-colors duration-200">
                    Manage
                  </button>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-neutral-900/10 border border-neutral-800 rounded-none p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Notifications
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">New repository recommendations</p>
                      <p className="text-sm text-neutral-400">Get notified when we find new projects for you</p>
                    </div>
                    <button 
                      onClick={() => handleNotificationToggle('recommendations')}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black ${
                        preferences.notifications.recommendations ? 'bg-white' : 'bg-neutral-700'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${
                        preferences.notifications.recommendations ? 'translate-x-5' : 'translate-x-0'
                      }`}></span>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">Good first issues</p>
                      <p className="text-sm text-neutral-400">Alert me about beginner-friendly issues in saved repos</p>
                    </div>
                    <button 
                      onClick={() => handleNotificationToggle('goodFirstIssues')}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black ${
                        preferences.notifications.goodFirstIssues ? 'bg-white' : 'bg-neutral-700'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${
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