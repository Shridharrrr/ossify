'use client';

import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppSidebar from "@/components/AppSidebar";
import { useSavedRepos } from "@/lib/hooks/useSavedRepos";
import { Rajdhani } from "next/font/google";
import { TrashIcon } from "@heroicons/react/24/outline";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: "500",
});

export default function SavedPage() {
  const { savedRepos, removeRepo, loading } = useSavedRepos();

  const getDifficultyColor = (level) => {
    switch (level) {
      case "beginner":
        return "bg-green-400/20 text-green-500 border-green-500";
      case "intermediate":
        return "bg-yellow-400/20 text-yellow-500 border-yellow-500";
      case "advanced":
        return "bg-red-400/20 text-red-500 border-red-500";
      default:
        return "bg-neutral-800 text-neutral-300 border-neutral-700";
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
        <div className="p-4 sm:p-6 lg:p-8 bg-black min-h-screen">
          <div className="mb-6 lg:mb-8">
            <h1 className={`text-3xl lg:text-4xl text-center lg:text-left font-bold ${rajdhani.className} text-white mb-1 lg:mb-2`}>
              Saved Repositories
            </h1>
            <p className="text-neutral-400 font-medium text-base text-center lg:text-left">
              Your collection of saved repositories for future reference
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-neutral-900/10 border border-neutral-800 rounded-none p-4 sm:p-6 flex flex-col h-80 sm:h-92 max-h-80 sm:max-h-92 animate-pulse"
                >
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <div className="flex-1">
                      <div className="h-5 sm:h-6 bg-neutral-800 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-neutral-800 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-3 sm:mb-4">
                    <div className="h-4 bg-neutral-800 rounded w-full"></div>
                    <div className="h-4 bg-neutral-800 rounded w-2/3"></div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4 flex-wrap">
                    <div className="h-4 bg-neutral-800 rounded w-12"></div>
                    <div className="h-4 bg-neutral-800 rounded w-12"></div>
                    <div className="h-6 bg-neutral-800 rounded w-16"></div>
                    <div className="h-6 bg-neutral-800 rounded w-20"></div>
                  </div>
                  <div className="space-y-2 mb-3 sm:mb-4">
                    <div className="h-10 bg-neutral-800 rounded"></div>
                    <div className="flex gap-1">
                      <div className="h-6 bg-neutral-800 rounded w-16"></div>
                      <div className="h-6 bg-neutral-800 rounded w-12"></div>
                      <div className="h-6 bg-neutral-800 rounded w-14"></div>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <div className="flex gap-1.5 sm:gap-2">
                      <div className="flex-1 h-10 bg-neutral-800 rounded"></div>
                      <div className="w-10 sm:w-12 h-10 bg-neutral-800 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : savedRepos.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16 text-neutral-600 mx-auto mb-4"
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
              <h3 className="text-lg font-medium text-neutral-300 mb-2">
                No saved repositories yet
              </h3>
              <p className="text-neutral-500 mb-4">
                Start exploring and save repositories that interest you
              </p>
              <a
                href="/discover"
                className="bg-white text-black px-4 py-2 rounded-none hover:bg-gray-100 transition-colors inline-block text-sm"
              >
                Discover Repositories
              </a>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {savedRepos.map((repo) => (
                  <div
                    key={repo.id}
                    className="bg-neutral-900/10 border border-neutral-800 rounded-none p-4 sm:p-6 hover:border-neutral-600 transition-all duration-300 flex flex-col h-60 sm:h-70"
                  >
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <h3 className="font-semibold text-lg text-white hover:text-yellow-300 truncate overflow-ellipsis whitespace-nowrap">
                          {repo.full_name}
                        </h3>
                        <p className="text-sm text-neutral-400 mt-1 truncate">
                          by {repo.owner?.login || "Unknown"}
                        </p>
                      </div>
                    </div>

                    <p className="text-neutral-300 line-clamp-2 text-sm mb-2">
                      {repo.description || "No description available"}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-neutral-400 mb-3 sm:mb-4 flex-wrap">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                        </svg>
                        {formatNumber(repo.stars || 0)}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
                        </svg>
                        {formatNumber(repo.forks || 0)}
                      </span>
                      {repo.language && (
                        <span
                          className={`px-2 py-1 bg-neutral-800 text-neutral-300 rounded-none text-xs border-2 border-neutral-700 ${rajdhani.className}`}
                        >
                          {repo.language}
                        </span>
                      )}
                      <span
                        className={`px-2 py-1 capitalize rounded-none text-xs border-2 ${getDifficultyColor(
                          repo.difficulty_level
                        )}`}
                      >
                        {repo.difficulty_level || "unknown"}
                      </span>
                    </div>

                    <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                      {repo.total_contribution_opportunities > 0 ? (
                        <div className="bg-neutral-900 border border-neutral-700 rounded-none px-3 py-2">
                          <div className="text-green-400 text-sm">
                            <span className="font-medium">
                              {repo.good_first_issues} good first issues
                            </span>
                            {repo.help_wanted_issues > 0 && (
                              <span className="ml-1 sm:ml-2 text-neutral-300">
                                • {repo.help_wanted_issues} help wanted
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-none px-3 py-2">
                          <div className="text-neutral-400 text-sm flex items-center justify-between">
                            <span className="font-medium">
                              Active Community
                            </span>
                            <span className="text-xs text-neutral-500">
                              Updated {new Date(repo.updated_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )}

                      {repo.topics && repo.topics.length > 0 && (
                        <div className="flex-1 min-h-0">
                          <div className="flex flex-wrap content-start gap-1">
                            {repo.topics.slice(0, 5).map((topic) => (
                              <span
                                key={topic}
                                className={`px-2 py-1 bg-neutral-700 text-neutral-300 rounded-none text-xs flex-shrink-0 transition-all duration-200 hover:bg-neutral-600 hover:text-white`}
                              >
                                {topic}
                              </span>
                            ))}
                            {repo.topics.length > 6 && (
                              <span className="px-2 py-1 bg-neutral-700 text-neutral-300 rounded-none text-xs flex-shrink-0 transition-all duration-200 hover:bg-neutral-600 hover:text-white">
                                +{repo.topics.length - 5}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-auto">
                      <div className="flex gap-1.5 sm:gap-2">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-white text-black px-4 py-2 rounded-none hover:bg-gray-100 transition-colors text-sm text-center font-medium border border-white"
                        >
                          View on GitHub
                        </a>
                        <button
                          onClick={() => removeRepo(repo.id)}
                          className="flex-shrink-0 ml-1.5 sm:ml-2 border border-neutral-700 p-2 hover:border-red-500 hover:text-red-500 transition-colors text-neutral-400"
                          title="Remove from saved"
                        >
                          <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
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