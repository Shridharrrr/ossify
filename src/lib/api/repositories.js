
class RepositoryAPI {
  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * @param {Object} params - Search parameters
   * @param {string} params.query - Search query
   * @param {string} params.language - Programming language filter
   * @param {string} params.level - Difficulty level (beginner, intermediate, advanced)
   * @param {number} params.page - Page number
   * @param {number} params.per_page - Results per page
   */
  async searchRepositories({ query = '', language = 'all', level = 'all', page = 1, per_page = 12 } = {}) {
    try {
      const searchParams = new URLSearchParams({
        q: query,
        language: language === 'all' ? '' : language,
        level: level === 'all' ? '' : level,
        page: page.toString(),
        per_page: per_page.toString()
      });

      const response = await fetch(`${this.baseUrl}/repositories/search?${searchParams}`);
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Repository search error:', error);
      throw error;
    }
  }

  /**
   * Get trending repositories
   * @param {Object} params - Trending parameters
   * @param {string} params.language - Programming language filter
   * @param {string} params.since - Time period (daily, weekly, monthly)
   * @param {number} params.page - Page number
   * @param {number} params.per_page - Results per page
   */
  async getTrendingRepositories({ language = 'all', since = 'weekly', page = 1, per_page = 12 } = {}) {
    try {
      const searchParams = new URLSearchParams({
        language: language === 'all' ? '' : language,
        since,
        page: page.toString(),
        per_page: per_page.toString()
      });

      const response = await fetch(`${this.baseUrl}/repositories/trending?${searchParams}`);
      
      if (!response.ok) {
        throw new Error(`Trending fetch failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Trending repositories error:', error);
      throw error;
    }
  }

  /**
   * Get detailed information about a specific repository
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   */
  async getRepositoryDetails(owner, repo) {
    try {
      const response = await fetch(`${this.baseUrl}/repositories/${owner}/${repo}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Repository not found');
        }
        throw new Error(`Failed to fetch repository details: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Repository details error:', error);
      throw error;
    }
  }

  /**
   * Get repository issues (good first issues, help wanted)
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} label - Issue label filter
   */
  async getRepositoryIssues(owner, repo, label = 'good first issue') {
    try {
      // This would call GitHub API directly or through your backend
      const response = await fetch(`https://api.github.com/search/issues?q=repo:${owner}/${repo}+label:"${label}"+state:open`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch issues: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Repository issues error:', error);
      throw error;
    }
  }
}

// Create singleton instance
const repositoryAPI = new RepositoryAPI();

export default repositoryAPI;

// React hooks for using the API
import { useState, useEffect } from 'react';

/**
 * Hook for searching repositories
 */
export function useRepositorySearch() {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const searchRepositories = async (params, append = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await repositoryAPI.searchRepositories(params);
      
      if (append) {
        setRepositories(prev => [...prev, ...data.repositories]);
      } else {
        setRepositories(data.repositories);
      }
      
      setHasMore(data.has_more);
      setTotalCount(data.total_count);
    } catch (err) {
      setError(err.message);
      if (!append) {
        setRepositories([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setRepositories([]);
    setError(null);
    setHasMore(true);
    setTotalCount(0);
  };

  return {
    repositories,
    loading,
    error,
    hasMore,
    totalCount,
    searchRepositories,
    resetSearch
  };
}

/**
 * Hook for getting trending repositories
 */
export function useTrendingRepositories(initialParams = {}) {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await repositoryAPI.getTrendingRepositories(initialParams);
        setRepositories(data.repositories);
      } catch (err) {
        setError(err.message);
        setRepositories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, [JSON.stringify(initialParams)]);

  const refresh = async (params = initialParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await repositoryAPI.getTrendingRepositories(params);
      setRepositories(data.repositories);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { repositories, loading, error, refresh };
}

// Hook for getting repository details

export function useRepositoryDetails(owner, repo) {
  const [repository, setRepository] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!owner || !repo) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await repositoryAPI.getRepositoryDetails(owner, repo);
        setRepository(data);
      } catch (err) {
        setError(err.message);
        setRepository(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [owner, repo]);

  return { repository, loading, error };
}