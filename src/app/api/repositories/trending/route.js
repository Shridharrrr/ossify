import { NextResponse } from 'next/server';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || '';
    const since = searchParams.get('since') || 'weekly'; // daily, weekly, monthly
    const page = parseInt(searchParams.get('page')) || 1;
    const per_page = Math.min(parseInt(searchParams.get('per_page')) || 12, 100);

    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Ossify-App'
    };

    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    // Calculate date range for trending
    const now = new Date();
    let dateFilter;
    
    switch (since) {
      case 'daily':
        dateFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Build search query for trending repositories
    let searchQuery = `created:>${dateFilter.toISOString().split('T')[0]} stars:>10`;
    
    if (language && language !== 'all') {
      searchQuery += ` language:${language.toLowerCase()}`;
    }

    // Add good first issues to prioritize contribution-friendly repos
    searchQuery += ' good-first-issues:>0';

    // Search for trending repositories
    const searchResponse = await fetch(
      `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc&page=${page}&per_page=${per_page}`,
      { headers }
    );

    if (!searchResponse.ok) {
      throw new Error(`GitHub API error: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();

    // If not enough new repos, get recently popular ones
    let repositories = searchData.items;
    
    if (repositories.length < per_page) {
      const popularQuery = `stars:>100 pushed:>${dateFilter.toISOString().split('T')[0]}` + 
        (language && language !== 'all' ? ` language:${language.toLowerCase()}` : '');
      
      const popularResponse = await fetch(
        `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(popularQuery)}&sort=updated&order=desc&per_page=${per_page - repositories.length}`,
        { headers }
      );

      if (popularResponse.ok) {
        const popularData = await popularResponse.json();
        repositories = [...repositories, ...popularData.items];
      }
    }

    // Enhance repository data with contribution information
    const enhancedRepos = await Promise.all(
      repositories.slice(0, per_page).map(async (repo) => {
        try {
          // Get good first issues
          const goodFirstIssuesResponse = await fetch(
            `${GITHUB_API_BASE}/search/issues?q=repo:${repo.full_name}+label:"good first issue"+state:open`,
            { headers }
          );
          
          let goodFirstIssues = 0;
          if (goodFirstIssuesResponse.ok) {
            const issuesData = await goodFirstIssuesResponse.json();
            goodFirstIssues = issuesData.total_count;
          }

          // Get help wanted issues
          const helpWantedResponse = await fetch(
            `${GITHUB_API_BASE}/search/issues?q=repo:${repo.full_name}+label:"help wanted"+state:open`,
            { headers }
          );
          
          let helpWantedIssues = 0;
          if (helpWantedResponse.ok) {
            const helpWantedData = await helpWantedResponse.json();
            helpWantedIssues = helpWantedData.total_count;
          }

          // Get recent commits for trending score
          const commitsResponse = await fetch(
            `${GITHUB_API_BASE}/repos/${repo.full_name}/commits?since=${dateFilter.toISOString()}&per_page=1`,
            { headers }
          );
          
          let recentCommits = 0;
          if (commitsResponse.ok) {
            const commitsHeader = commitsResponse.headers.get('Link');
            recentCommits = commitsHeader ? parseGitHubLinkHeader(commitsHeader) : 1;
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
            pushed_at: repo.pushed_at,
            owner: {
              login: repo.owner.login,
              avatar_url: repo.owner.avatar_url,
              html_url: repo.owner.html_url,
            },
            good_first_issues: goodFirstIssues,
            help_wanted_issues: helpWantedIssues,
            total_contribution_opportunities: goodFirstIssues + helpWantedIssues,
            recent_commits: recentCommits,
            trending_score: calculateTrendingScore(repo, goodFirstIssues, helpWantedIssues, recentCommits, dateFilter),
            is_new: isNewRepository(repo.created_at, 30), // New if created in last 30 days
            difficulty_level: getTrendingDifficultyLevel(repo, goodFirstIssues, helpWantedIssues)
          };
        } catch (error) {
          console.error(`Error enhancing trending repo ${repo.full_name}:`, error);
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
            pushed_at: repo.pushed_at,
            owner: {
              login: repo.owner.login,
              avatar_url: repo.owner.avatar_url,
              html_url: repo.owner.html_url,
            },
            good_first_issues: 0,
            help_wanted_issues: 0,
            total_contribution_opportunities: 0,
            recent_commits: 0,
            trending_score: 0,
            is_new: false,
            difficulty_level: 'intermediate'
          };
        }
      })
    );

    // Sort by trending score
    enhancedRepos.sort((a, b) => b.trending_score - a.trending_score);

    return NextResponse.json({
      repositories: enhancedRepos,
      total_count: enhancedRepos.length,
      page,
      per_page,
      since,
      language: language || 'all',
      date_filter: dateFilter.toISOString().split('T')[0]
    });

  } catch (error) {
    console.error('Trending API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending repositories', details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to calculate trending score
function calculateTrendingScore(repo, goodFirstIssues, helpWantedIssues, recentCommits, dateFilter) {
  const daysSinceCreated = Math.max(1, Math.floor((Date.now() - new Date(repo.created_at)) / (1000 * 60 * 60 * 24)));
  const daysSinceUpdated = Math.max(1, Math.floor((Date.now() - new Date(repo.updated_at)) / (1000 * 60 * 60 * 24)));
  
  // Base score from stars and growth rate
  const baseScore = repo.stargazers_count / Math.sqrt(daysSinceCreated);
  
  // Contribution opportunities boost
  const contributionBoost = (goodFirstIssues * 3 + helpWantedIssues * 2) * 10;
  
  // Recent activity boost
  const activityBoost = recentCommits * 5 + Math.max(0, 30 - daysSinceUpdated) * 2;
  
  // New repository boost
  const newRepoBoost = daysSinceCreated <= 30 ? 50 : 0;
  
  return Math.round(baseScore + contributionBoost + activityBoost + newRepoBoost);
}

// Helper function to check if repository is new
function isNewRepository(createdAt, daysThreshold) {
  const daysSinceCreated = Math.floor((Date.now() - new Date(createdAt)) / (1000 * 60 * 60 * 24));
  return daysSinceCreated <= daysThreshold;
}

// Helper function to determine difficulty level for trending repos
function getTrendingDifficultyLevel(repo, goodFirstIssues, helpWantedIssues) {
  const stars = repo.stargazers_count;
  const totalIssues = goodFirstIssues + helpWantedIssues;
  const daysSinceCreated = Math.floor((Date.now() - new Date(repo.created_at)) / (1000 * 60 * 60 * 24));

  // New repos with good first issues are beginner-friendly
  if (daysSinceCreated <= 30 && goodFirstIssues > 0) return 'beginner';
  if (goodFirstIssues > 2 && stars < 500) return 'beginner';
  if (totalIssues > 0 && stars < 2000) return 'intermediate';
  return 'advanced';
}

// Helper function to parse GitHub Link header for pagination
function parseGitHubLinkHeader(linkHeader) {
  if (!linkHeader) return 0;
  
  const lastMatch = linkHeader.match(/[?&]page=(\d+)[^>]*>;\s*rel="last"/);
  if (lastMatch) {
    return parseInt(lastMatch[1]) * 30; // Approximate total count
  }
  
  return 0;
}