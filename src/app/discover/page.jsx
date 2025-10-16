"use client";

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppSidebar from "@/components/AppSidebar";
import { useRepositorySearch } from "@/lib/api/repositories";
import { useSavedRepos } from "@/lib/hooks/useSavedRepos";

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const { savedRepos, saveRepo, removeRepo, isSaved } = useSavedRepos();
  const { user } = useAuth();

  const {
    repositories,
    loading,
    error,
    hasMore,
    totalCount,
    searchRepositories,
    resetSearch,
  } = useRepositorySearch();

  // Initial load - get popular repositories
  useEffect(() => {
    searchRepositories({
      query: "",
      language: "all",
      level: "all",
      page: 1,
      per_page: 12,
    });
  }, []);

  const handleSearch = async (e) => {
    e?.preventDefault();
    setCurrentPage(1);
    resetSearch();

    await searchRepositories({
      query: searchQuery,
      language: selectedLanguage,
      level: selectedLevel,
      page: 1,
      per_page: 12,
    });
  };

  const handleLoadMore = async () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);

    await searchRepositories(
      {
        query: searchQuery,
        language: selectedLanguage,
        level: selectedLevel,
        page: nextPage,
        per_page: 12,
      },
      true
    ); // append = true
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
    resetSearch();

    searchRepositories({
      query: searchQuery,
      language: selectedLanguage,
      level: selectedLevel,
      page: 1,
      per_page: 12,
    });
  };

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
              Welcome, {user?.displayName?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-600">
              Find amazing open source projects that match your skills and
              interests
              {totalCount > 0 &&
                ` (${totalCount.toLocaleString()} repositories found)`}
            </p>
          </div>

          {/* Search and Filters */}
          <form
            onSubmit={handleSearch}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search repositories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 text-gray-900 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-4 py-2 text-gray-500 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="all">Select Languages</option>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="typescript">TypeScript</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                  <option value="cpp">C++</option>
                  <option value="php">PHP</option>
                  <option value="ruby">Ruby</option>
                  <option value="swift">Swift</option>
                </select>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-4 py-2 text-gray-500 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Searching...
                    </>
                  ) : (
                    "Search"
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">
                    Error loading repositories: {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Repository Grid */}
          {repositories.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {repositories.map((repo) => (
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
                          by {repo.owner.login}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {repo.description || "No description available"}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        ⭐ {formatNumber(repo.stars)}
                      </span>
                      <span className="flex items-center">
                        🔀 {formatNumber(repo.forks)}
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
                        {repo.difficulty_level}
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
                        onClick={() => {
                          if (isSaved(repo.id)) {
                            const docToRemove = savedRepos.find(
                              (r) => r.repoId === repo.id
                            );
                            removeRepo(docToRemove.id);
                          } else {
                            saveRepo(repo);
                          }
                        }}
                        className={`flex-shrink-0 ml-2 ${
                          isSaved(repo.id)
                            ? "text-blue-600"
                            : "text-gray-400 hover:text-blue-600"
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill={isSaved(repo.id) ? "currentColor" : "none"}
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
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Loading..." : "Load More Repositories"}
                  </button>
                </div>
              )}
            </>
          ) : (
            !loading && (
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No repositories found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedLanguage("all");
                    setSelectedLevel("all");
                    handleSearch();
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Show All Repositories
                </button>
              </div>
            )
          )}

          {/* Loading State */}
          {loading && repositories.length === 0 && (
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
          )}
        </div>
      </AppSidebar>
    </ProtectedRoute>
  );
}
