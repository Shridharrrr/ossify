import { NextResponse } from 'next/server';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Optional: Add to .env.local for higher rate limits

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const language = searchParams.get('language') || '';
    const level = searchParams.get('level') || '';
    const page = parseInt(searchParams.get('page')) || 1;
    const per_page = Math.min(parseInt(searchParams.get('per_page')) || 12, 100);

    // Build GitHub search query
    let searchQuery = query;

    // Add language filter
    if (language && language !== 'all') {
      searchQuery += ` language:${language.toLowerCase()}`;
    }

    // Add good first issues based on level
    if (level === 'beginner') {
      searchQuery += ' label:"good first issue"';
    } else if (level === 'intermediate') {
      searchQuery += ' label:"help wanted"';
    }

    // Default filters for better results
    if (!searchQuery.trim()) {
      searchQuery = 'stars:>10 forks:>5';
    } else {
      searchQuery += ' stars:>10 forks:>5';
    }

    // Add good first issues filter for better contribution opportunities
    searchQuery += ' good-first-issues:>0';

    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Ossify-App'
    };

    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    // Search repositories
    const searchResponse = await fetch(
      `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc&page=${page}&per_page=${per_page}`,
      { headers }
    );

    if (!searchResponse.ok) {
      throw new Error(`GitHub API error: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();

    // Enhance repository data
    const enhancedRepos = await Promise.all(
      searchData.items.map(async (repo) => {
        try {
          // Get good first issues count
          const issuesResponse = await fetch(
            `${GITHUB_API_BASE}/search/issues?q=repo:${repo.full_name}+label:"good first issue"+state:open`,
            { headers }
          );

          let goodFirstIssues = 0;
          if (issuesResponse.ok) {
            const issuesData = await issuesResponse.json();
            goodFirstIssues = issuesData.total_count;
          }

          // Get help wanted issues count
          const helpWantedResponse = await fetch(
            `${GITHUB_API_BASE}/search/issues?q=repo:${repo.full_name}+label:"help wanted"+state:open`,
            { headers }
          );

          let helpWantedIssues = 0;
          if (helpWantedResponse.ok) {
            const helpWantedData = await helpWantedResponse.json();
            helpWantedIssues = helpWantedData.total_count;
          }

          return {
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description || 'No description available',
            html_url: repo.html_url,
            clone_url: repo.clone_url,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            topics: repo.topics || [],
            created_at: repo.created_at,
            updated_at: repo.updated_at,
            owner: {
              login: repo.owner.login,
              avatar_url: repo.owner.avatar_url,
              html_url: repo.owner.html_url,
            },
            good_first_issues: goodFirstIssues,
            help_wanted_issues: helpWantedIssues,
            total_contribution_opportunities: goodFirstIssues + helpWantedIssues,
            difficulty_level: getDifficultyLevel(repo, goodFirstIssues, helpWantedIssues),
            contribution_score: calculateContributionScore(repo, goodFirstIssues, helpWantedIssues)
          };
        } catch (error) {
          console.error(`Error enhancing repo ${repo.full_name}:`, error);
          return {
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description || 'No description available',
            html_url: repo.html_url,
            clone_url: repo.clone_url,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            topics: repo.topics || [],
            created_at: repo.created_at,
            updated_at: repo.updated_at,
            owner: {
              login: repo.owner.login,
              avatar_url: repo.owner.avatar_url,
              html_url: repo.owner.html_url,
            },
            good_first_issues: 0,
            help_wanted_issues: 0,
            total_contribution_opportunities: 0,
            difficulty_level: 'intermediate',
            contribution_score: 0
          };
        }
      })
    );

    return NextResponse.json({
      repositories: enhancedRepos,
      total_count: searchData.total_count,
      page,
      per_page,
      has_more: searchData.total_count > page * per_page,
      search_query: searchQuery
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search repositories', details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to determine difficulty level
function getDifficultyLevel(repo, goodFirstIssues, helpWantedIssues) {
  const stars = repo.stargazers_count;
  const totalIssues = goodFirstIssues + helpWantedIssues;

  if (goodFirstIssues > 0 && stars < 1000) return 'beginner';
  if (totalIssues > 0 && stars < 5000) return 'intermediate';
  return 'advanced';
}

// Helper function to calculate contribution score
function calculateContributionScore(repo, goodFirstIssues, helpWantedIssues) {
  const baseScore = Math.log(repo.stargazers_count + 1) * 10;
  const issueScore = (goodFirstIssues * 2 + helpWantedIssues) * 5;
  const activityScore = repo.updated_at ?
    Math.max(0, 100 - Math.floor((Date.now() - new Date(repo.updated_at)) / (1000 * 60 * 60 * 24 * 30))) : 0;

  return Math.round(baseScore + issueScore + activityScore);
}