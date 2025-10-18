"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppSidebar from "@/components/AppSidebar";
import { useRepositorySearch } from "@/lib/api/repositories";
import { useSavedRepos } from "@/lib/hooks/useSavedRepos";
import {
  Instrument_Serif,
  Domine,
  Electrolize,
  Rajdhani,
} from "next/font/google";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const domine = Domine({
  subsets: ["latin"],
  weight: "400",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const electrolize = Electrolize({
  subsets: ["latin"],
  weight: "400",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: "500",
});

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
        return "bg-green-400/20 text-green-500 border-green-500";
      case "intermediate":
        return "bg-yellow-400/20 text-yellow-500 border-yellow-500";
      case "advanced":
        return "bg-red-400/20 text-red-500 border-red-500";
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
        <div className="p-4 sm:p-6 lg:p-8 bg-black min-h-screen flex flex-col">
          <div className="mb-6 lg:mb-8">
            <h1
              className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${rajdhani.className} text-white mb-2`}
            >
              Welcome, {user?.displayName?.split(" ")[0]}!
            </h1>
            <p className="text-neutral-400 font-medium text-sm sm:text-base">
              Find amazing open source projects that match your skills and
              interests
              {totalCount > 0 &&
                ` (${totalCount.toLocaleString()} repositories found)`}
            </p>
          </div>

          {/* Search and Filters */}
          <form onSubmit={handleSearch} className="mb-6 lg:mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search repositories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`px-4 py-3 sm:py-2 w-full font-medium text-white border-[2px] transition-all duration-300 outline-0 placeholder:text-neutral-400 placeholder:font-normal bg-transparent text-base sm:text-sm`}
                  style={{
                    borderImage:
                      "conic-gradient(#d4d4d4 0deg, #171717 90deg, #d4d4d4 180deg, #171717 270deg, #d4d4d4 360deg) 1",
                  }}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white cursor-pointer active:scale-95 px-4 py-3 sm:py-2 text-black rounded-sm hover:bg-gray-100 hover:-translate-y-1 transition-transform duration-200 flex items-center justify-center text-base sm:text-sm"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
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
                    <>
                      <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </button>
                <div className="flex gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center border-neutral-800 justify-between px-4 py-3 sm:py-2 bg-black text-white border hover:bg-neutral-800 transition-colors min-w-[140px] sm:min-w-[180px] text-base sm:text-sm">
                      <span className="truncate">
                        {selectedLanguage === "all"
                          ? "Select Languages"
                          : selectedLanguage.charAt(0).toUpperCase() +
                            selectedLanguage.slice(1)}
                      </span>
                      <ChevronDownIcon className="h-4 w-4 ml-2 flex-shrink-0" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-black border border-neutral-700 text-white min-w-[200px] p-0 rounded-none shadow-xl">
                      <div className="p-2">
                        <DropdownMenuItem
                          onClick={() => setSelectedLanguage("all")}
                          className={`cursor-pointer px-3 py-2.5 rounded-none transition-all duration-200 bg-transparent hover:bg-transparent ${
                            selectedLanguage === "all"
                              ? "bg-black text-white font-medium"
                              : "text-neutral-400 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center">
                            <span>All Languages</span>
                          </div>
                        </DropdownMenuItem>
                      </div>

                      <div className="border-t border-neutral-700"></div>

                      <div className="p-2">
                        {[
                          {
                            value: "javascript",
                            label: "JavaScript",
                            color: "text-yellow-400",
                          },
                          {
                            value: "python",
                            label: "Python",
                            color: "text-blue-400",
                          },
                          {
                            value: "java",
                            label: "Java",
                            color: "text-red-400",
                          },
                          {
                            value: "typescript",
                            label: "TypeScript",
                            color: "text-blue-300",
                          },
                          { value: "go", label: "Go", color: "text-cyan-400" },
                          {
                            value: "rust",
                            label: "Rust",
                            color: "text-orange-500",
                          },
                          {
                            value: "cpp",
                            label: "C++",
                            color: "text-pink-400",
                          },
                          {
                            value: "php",
                            label: "PHP",
                            color: "text-purple-400",
                          },
                          {
                            value: "ruby",
                            label: "Ruby",
                            color: "text-red-500",
                          },
                          {
                            value: "swift",
                            label: "Swift",
                            color: "text-orange-400",
                          },
                        ].map((lang) => (
                          <DropdownMenuItem
                            key={lang.value}
                            onClick={() => setSelectedLanguage(lang.value)}
                            className={`cursor-pointer px-3 py-2.5 rounded-none transition-all duration-200 mb-1 last:mb-0 bg-transparent hover:bg-transparent ${
                              selectedLanguage === lang.value
                                ? "text-white font-medium"
                                : "text-neutral-400 hover:text-white"
                            }`}
                          >
                            <div className="flex items-center">
                              <span className={lang.color}>●</span>
                              <span className="ml-2">{lang.label}</span>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Level Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center justify-between px-4 py-3 sm:py-2 border-neutral-800 bg-black text-white border hover:bg-neutral-800 transition-colors min-w-[120px] sm:min-w-[140px] text-base sm:text-sm">
                      <span className="truncate">
                        {selectedLevel === "all"
                          ? "All Levels"
                          : selectedLevel.charAt(0).toUpperCase() +
                            selectedLevel.slice(1)}
                      </span>
                      <ChevronDownIcon className="h-4 w-4 ml-2 flex-shrink-0" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-black border border-neutral-700 text-white min-w-[140px] p-0 rounded-none shadow-xl">
                      <div className="p-2">
                        <DropdownMenuItem
                          onClick={() => setSelectedLevel("all")}
                          className={`cursor-pointer px-3 py-2.5 rounded-none transition-all duration-200 bg-transparent hover:bg-transparent ${
                            selectedLevel === "all"
                              ? "bg-black text-white font-medium"
                              : "text-neutral-500 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center">
                            <span>All Levels</span>
                          </div>
                        </DropdownMenuItem>
                      </div>

                      <div className="border-t border-neutral-700"></div>

                      <div className="p-2">
                        {[
                          {
                            value: "beginner",
                            label: "Beginner",
                            color: "text-green-400",
                          },
                          {
                            value: "intermediate",
                            label: "Intermediate",
                            color: "text-yellow-400",
                          },
                          {
                            value: "advanced",
                            label: "Advanced",
                            color: "text-red-400",
                          },
                        ].map((level) => (
                          <DropdownMenuItem
                            key={level.value}
                            onClick={() => setSelectedLevel(level.value)}
                            className={`cursor-pointer px-3 py-2.5 rounded-none transition-all duration-200 mb-1 last:mb-0 bg-transparent hover:bg-transparent ${
                              selectedLevel === level.value
                                ? "text-white font-medium"
                                : "text-neutral-500 hover:text-white"
                            }`}
                          >
                            <div className="flex items-center">
                              <span className={level.color}>●</span>
                              <span className="ml-2">{level.label}</span>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
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
                  <p className="text-sm text-red-300">
                    Error loading repositories: {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Repository Grid */}
          {repositories.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {repositories.map((repo) => (
                  <div
                    key={repo.id}
                    className="bg-neutral-900/10 border border-neutral-800 rounded-none p-4 sm:p-6 hover:border-neutral-600 transition-all duration-300 flex flex-col h-80 sm:h-92 max-h-80 sm:max-h-92 overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <h3 className="font-semibold text-base sm:text-lg text-white hover:text-yellow-300 truncate overflow-ellipsis whitespace-nowrap">
                          {repo.full_name}
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-400 mt-1 truncate">
                          by {repo.owner.login}
                        </p>
                      </div>
                    </div>
                    <p className="text-neutral-300 line-clamp-2 text-xs sm:text-sm mb-2">
                      {repo.description || "No description available"}
                    </p>
                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-neutral-400 mb-3 sm:mb-4 flex-wrap">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                        </svg>
                        {formatNumber(repo.stars)}
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
                        {formatNumber(repo.forks)}
                      </span>
                      {repo.language && (
                        <span
                          className={`px-1.5 py-0.5 sm:px-2 sm:py-1 bg-neutral-800 text-neutral-300 rounded-sm text-xs border-2 border-neutral-700 ${rajdhani.className}`}
                        >
                          {repo.language}
                        </span>
                      )}
                      <span
                        className={`px-1.5 py-0.5 sm:px-2 sm:py-1 capitalize rounded-sm text-xs border-2 ${getDifficultyColor(
                          repo.difficulty_level
                        )}`}
                      >
                        {repo.difficulty_level}
                      </span>
                    </div>
                    <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                      {repo.total_contribution_opportunities > 0 && (
                        <div className="bg-neutral-900 border border-neutral-700 rounded-none px-2 py-1.5 sm:px-3 sm:py-2">
                          <div className="text-green-400 text-xs sm:text-sm">
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
                      )}

                      {repo.topics && repo.topics.length > 0 && (
                        <div className="flex-1 min-h-0">
                          <div className="flex flex-wrap content-start gap-1">
                            {repo.topics.slice(0, 3).map((topic) => (
                              <span
                                key={topic}
                                className={`px-1.5 py-0.5 sm:px-2 sm:py-1 bg-neutral-700 text-neutral-300 rounded-none text-xs flex-shrink-0 transition-all duration-200 hover:bg-neutral-600 hover:text-white`}
                              >
                                {topic}
                              </span>
                            ))}
                            {repo.topics.length > 6 && (
                              <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-neutral-700 text-neutral-300 rounded-none text-xs flex-shrink-0 transition-all duration-200 hover:bg-neutral-600 hover:text-white">
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
                          className="flex-1 bg-white text-black px-3 py-2 sm:px-4 sm:py-2 rounded-none hover:bg-gray-100 transition-colors text-xs sm:text-sm text-center font-medium border border-white"
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
                          className={`flex-shrink-0 ml-1.5 sm:ml-2 border border-neutral-700 p-1.5 sm:p-2 hover:border-neutral-400 transition-colors ${
                            isSaved(repo.id)
                              ? "text-white border-neutral-300"
                              : "text-neutral-400 hover:text-white"
                          }`}
                        >
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5"
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
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="text-center mt-6 sm:mt-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="bg-white cursor-pointer active:scale-95 text-black rounded-none px-6 py-3 sm:px-8 sm:py-4 hover:bg-gray-100 hover:-translate-y-1 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
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
                  className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mx-auto mb-4"
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
                <h3 className="text-lg font-medium text-gray-300 mb-2">
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
                  className="bg-white text-black px-4 py-2 rounded-sm hover:bg-gray-100 transition-colors text-sm"
                >
                  Show All Repositories
                </button>
              </div>
            )
          )}

          {/* Loading State - Dark Theme */}
          {loading && repositories.length === 0 && (
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
          )}
        </div>
      </AppSidebar>
    </ProtectedRoute>
  );
}
