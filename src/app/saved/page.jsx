'use client';

import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppSidebar from "@/components/AppSidebar";
import { useSavedRepos } from "@/lib/hooks/useSavedRepos";

export default function SavedPage() {
  const { savedRepos, removeRepo, loading } = useSavedRepos();

  const getDifficultyColor = (level) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  return (
    <ProtectedRoute>
      <AppSidebar>
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Saved Repositories
            </h1>
            <p className="text-gray-600">
              Your collection of saved repositories for future reference
              {savedRepos.length > 0 &&
                ` (${savedRepos.length} repositories saved)`}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm border p-6 animate-pulse"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-5 w-5 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="flex gap-4 mb-4">
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 w-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : savedRepos.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No saved repositories yet
              </h3>
              <p className="text-gray-500 mb-4">
                Start exploring and save repositories that interest you
              </p>
              <a
                href="/discover"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
              >
                Discover Repositories
              </a>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {savedRepos.map((repo) => (
                  <div
                    key={repo.id}
                    className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 truncate">
                          {repo.full_name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          by {repo.owner?.login || "Unknown"}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {repo.description || "No description available"}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        ⭐ {formatNumber(repo.stars || 0)}
                      </span>
                      <span className="flex items-center">
                        🔀 {formatNumber(repo.forks || 0)}
                      </span>
                      {repo.language && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {repo.language}
                        </span>
                      )}
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(
                          repo.difficulty_level
                        )}`}
                      >
                        {repo.difficulty_level || "unknown"}
                      </span>
                    </div>

                    {repo.total_contribution_opportunities > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-4">
                        <div className="text-green-700 text-sm">
                          <span className="font-medium">
                            {repo.good_first_issues} good first issues
                          </span>
                          {repo.help_wanted_issues > 0 && (
                            <span className="ml-2">
                              • {repo.help_wanted_issues} help wanted
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {repo.topics && repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {repo.topics.slice(0, 3).map((topic) => (
                          <span
                            key={topic}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            {topic}
                          </span>
                        ))}
                        {repo.topics.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{repo.topics.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm text-center"
                      >
                        View on GitHub
                      </a>
                      <button
                        onClick={() => removeRepo(repo.id)}
                        className="flex-shrink-0 ml-2 text-red-500 hover:text-red-700"
                        title="Remove from saved"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </AppSidebar>
    </ProtectedRoute>
  );
}