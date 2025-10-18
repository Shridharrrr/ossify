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

    // Search for repositories with different difficulty levels
    const difficultySearches = await Promise.all([
      // Beginner-friendly repos: newer repos with good first issues
      searchRepositories({
        headers,
        language,
        dateFilter,
        query: `created:>${getDateDaysAgo(90)} stars:10..500 good-first-issues:>1`,
        sort: 'stars',
        per_page: Math.ceil(per_page / 3)
      }),
      
      // Intermediate repos: established but not too large, with help wanted
      searchRepositories({
        headers,
        language,
        dateFilter,
        query: `stars:100..2000 pushed:>${getDateDaysAgo(30)} help-wanted-issues:>0`,
        sort: 'updated',
        per_page: Math.ceil(per_page / 3)
      }),
      
      // Advanced repos: popular and well-established
      searchRepositories({
        headers,
        language,
        dateFilter,
        query: `stars:>1000 forks:>50 pushed:>${getDateDaysAgo(60)}`,
        sort: 'stars',
        per_page: Math.ceil(per_page / 3)
      })
    ]);

    // Combine all repositories
    let allRepositories = [];
    difficultySearches.forEach((repos, index) => {
      if (repos && repos.length > 0) {
        allRepositories = [...allRepositories, ...repos];
      }
    });

    // If we don't have enough repos, fill with additional searches
    if (allRepositories.length < per_page) {
      const remaining = per_page - allRepositories.length;
      
      // Get more mixed repositories
      const mixedQuery = `created:>${getDateDaysAgo(180)} stars:>10` + 
        (language && language !== 'all' ? ` language:${language.toLowerCase()}` : '');
      
      const mixedResponse = await fetch(
        `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(mixedQuery)}&sort=stars&order=desc&per_page=${remaining}`,
        { headers }
      );

      if (mixedResponse.ok) {
        const mixedData = await mixedResponse.json();
        allRepositories = [...allRepositories, ...(mixedData.items || [])];
      }
    }

    // Remove duplicates based on repo ID
    const uniqueRepos = allRepositories.reduce((acc, repo) => {
      if (!acc.find(r => r.id === repo.id)) {
        acc.push(repo);
      }
      return acc;
    }, []);

    // Enhance repository data with contribution information
    const enhancedRepos = await Promise.all(
      uniqueRepos.slice(0, per_page).map(async (repo) => {
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
            difficulty_level: calculateDifficultyLevel(repo, goodFirstIssues, helpWantedIssues)
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

    // Sort by trending score but ensure mix of difficulty levels
    const sortedRepos = enhancedRepos.sort((a, b) => {
      // Prioritize repositories with contribution opportunities
      const aScore = a.trending_score + (a.total_contribution_opportunities * 20);
      const bScore = b.trending_score + (b.total_contribution_opportunities * 20);
      return bScore - aScore;
    });

    // Balance the results to ensure mix of difficulty levels
    const balancedRepos = balanceDifficultyLevels(sortedRepos, per_page);

    return NextResponse.json({
      repositories: balancedRepos,
      total_count: balancedRepos.length,
      page,
      per_page,
      since,
      language: language || 'all',
      date_filter: dateFilter.toISOString().split('T')[0],
      difficulty_breakdown: getDifficultyBreakdown(balancedRepos)
    });

  } catch (error) {
    console.error('Trending API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending repositories', details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to search repositories
async function searchRepositories({ headers, language, dateFilter, query, sort, per_page }) {
  try {
    let searchQuery = query;
    
    if (language && language !== 'all') {
      searchQuery += ` language:${language.toLowerCase()}`;
    }

    const searchResponse = await fetch(
      `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=${sort}&order=desc&per_page=${per_page}`,
      { headers }
    );

    if (!searchResponse.ok) {
      return [];
    }

    const searchData = await searchResponse.json();
    return searchData.items || [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

// Helper function to calculate difficulty level
function calculateDifficultyLevel(repo, goodFirstIssues, helpWantedIssues) {
  const stars = repo.stargazers_count;
  const forks = repo.forks_count;
  const daysSinceCreated = Math.floor((Date.now() - new Date(repo.created_at)) / (1000 * 60 * 60 * 24));
  const totalIssues = goodFirstIssues + helpWantedIssues;

  // Beginner: Newer repos with good first issues and moderate stars
  if (daysSinceCreated <= 90 && goodFirstIssues >= 2 && stars < 300) {
    return 'beginner';
  }

  // Beginner: Smaller repos with good contribution opportunities
  if (stars < 500 && totalIssues >= 3 && goodFirstIssues >= 1) {
    return 'beginner';
  }

  // Intermediate: Established but not massive, with some contribution opportunities
  if (stars >= 500 && stars < 10000 && totalIssues >= 1) {
    return 'intermediate';
  }

  // Intermediate: Medium-sized repos with recent activity
  if (stars >= 300 && stars < 15000 && forks >= 200) {
    return 'intermediate';
  }

  // Advanced: Large, popular repositories
  if (stars >= 15000 || forks >= 1000) {
    return 'advanced';
  }

  // Default to intermediate for everything else
  return 'intermediate';
}

// Helper function to balance difficulty levels in results
function balanceDifficultyLevels(repos, targetCount) {
  const beginner = repos.filter(r => r.difficulty_level === 'beginner');
  const intermediate = repos.filter(r => r.difficulty_level === 'intermediate');
  const advanced = repos.filter(r => r.difficulty_level === 'advanced');

  // Target distribution: 40% intermediate, 30% beginner, 30% advanced
  const targetBeginner = Math.max(1, Math.floor(targetCount * 0.3));
  const targetIntermediate = Math.max(1, Math.floor(targetCount * 0.4));
  const targetAdvanced = Math.max(1, Math.floor(targetCount * 0.3));

  const result = [
    ...beginner.slice(0, targetBeginner),
    ...intermediate.slice(0, targetIntermediate),
    ...advanced.slice(0, targetAdvanced)
  ];

  if (result.length < targetCount) {
    const remaining = targetCount - result.length;
    const allRepos = [...repos];
    const usedIds = new Set(result.map(r => r.id));
    
    const additionalRepos = allRepos
      .filter(r => !usedIds.has(r.id))
      .slice(0, remaining);
    
    result.push(...additionalRepos);
  }

  return shuffleArray(result).slice(0, targetCount);
}

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function getDifficultyBreakdown(repos) {
  const breakdown = {
    beginner: 0,
    intermediate: 0,
    advanced: 0
  };

  repos.forEach(repo => {
    breakdown[repo.difficulty_level]++;
  });

  return breakdown;
}

function getDateDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

function calculateTrendingScore(repo, goodFirstIssues, helpWantedIssues, recentCommits, dateFilter) {
  const daysSinceCreated = Math.max(1, Math.floor((Date.now() - new Date(repo.created_at)) / (1000 * 60 * 60 * 24)));
  const daysSinceUpdated = Math.max(1, Math.floor((Date.now() - new Date(repo.updated_at)) / (1000 * 60 * 60 * 24)));
  
  const baseScore = repo.stargazers_count / Math.sqrt(daysSinceCreated);
  const contributionBoost = (goodFirstIssues * 3 + helpWantedIssues * 2) * 10;
  const activityBoost = recentCommits * 5 + Math.max(0, 30 - daysSinceUpdated) * 2;
  const newRepoBoost = daysSinceCreated <= 30 ? 50 : 0;
  return Math.round(baseScore + contributionBoost + activityBoost + newRepoBoost);
}

function isNewRepository(createdAt, daysThreshold) {
  const daysSinceCreated = Math.floor((Date.now() - new Date(createdAt)) / (1000 * 60 * 60 * 24));
  return daysSinceCreated <= daysThreshold;
}

function parseGitHubLinkHeader(linkHeader) {
  if (!linkHeader) return 0;
  
  const lastMatch = linkHeader.match(/[?&]page=(\d+)[^>]*>;\s*rel="last"/);
  if (lastMatch) {
    return parseInt(lastMatch[1]) * 30; // Approximate total count
  }
  
  return 0;
}