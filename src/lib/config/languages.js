
export const PROGRAMMING_LANGUAGES = [
  { value: 'all', label: 'All Languages', color: '#6B7280' },
  { value: 'javascript', label: 'JavaScript', color: '#F7DF1E' },
  { value: 'typescript', label: 'TypeScript', color: '#3178C6' },
  { value: 'python', label: 'Python', color: '#3776AB' },
  { value: 'java', label: 'Java', color: '#ED8B00' },
  { value: 'go', label: 'Go', color: '#00ADD8' },
  { value: 'rust', label: 'Rust', color: '#000000' },
  { value: 'cpp', label: 'C++', color: '#00599C' },
  { value: 'c', label: 'C', color: '#A8B9CC' },
  { value: 'csharp', label: 'C#', color: '#239120' },
  { value: 'php', label: 'PHP', color: '#777BB4' },
  { value: 'ruby', label: 'Ruby', color: '#CC342D' },
  { value: 'swift', label: 'Swift', color: '#FA7343' },
  { value: 'kotlin', label: 'Kotlin', color: '#7F52FF' },
  { value: 'dart', label: 'Dart', color: '#0175C2' },
  { value: 'scala', label: 'Scala', color: '#DC322F' },
  { value: 'r', label: 'R', color: '#276DC3' },
  { value: 'shell', label: 'Shell', color: '#89E051' },
  { value: 'lua', label: 'Lua', color: '#2C2D72' },
  { value: 'haskell', label: 'Haskell', color: '#5D4F85' }
];

export const DIFFICULTY_LEVELS = [
  { 
    value: 'all', 
    label: 'All Levels', 
    color: '#6B7280',
    description: 'All difficulty levels'
  },
  { 
    value: 'beginner', 
    label: 'Beginner', 
    color: '#10B981',
    description: 'Great for new contributors with good first issues'
  },
  { 
    value: 'intermediate', 
    label: 'Intermediate', 
    color: '#F59E0B',
    description: 'For developers with some experience'
  },
  { 
    value: 'advanced', 
    label: 'Advanced', 
    color: '#EF4444',
    description: 'Complex projects requiring deep expertise'
  }
];

export const TIME_PERIODS = [
  { value: 'daily', label: 'Today', description: 'Repositories trending today' },
  { value: 'weekly', label: 'This Week', description: 'Repositories trending this week' },
  { value: 'monthly', label: 'This Month', description: 'Repositories trending this month' }
];

// Helper functions
export function getLanguageByValue(value) {
  return PROGRAMMING_LANGUAGES.find(lang => lang.value === value);
}

export function getDifficultyByValue(value) {
  return DIFFICULTY_LEVELS.find(level => level.value === value);
}

export function getLanguageColor(language) {
  const lang = getLanguageByValue(language?.toLowerCase());
  return lang ? lang.color : '#6B7280';
}

export function getDifficultyColor(difficulty) {
  const level = getDifficultyByValue(difficulty?.toLowerCase());
  return level ? level.color : '#6B7280';
}

// Popular language combinations for better search suggestions
export const LANGUAGE_COMBINATIONS = [
  { languages: ['javascript', 'typescript'], label: 'JS/TS Projects' },
  { languages: ['python', 'jupyter notebook'], label: 'Python/Data Science' },
  { languages: ['java', 'kotlin'], label: 'JVM Languages' },
  { languages: ['rust', 'go'], label: 'Systems Programming' },
  { languages: ['html', 'css', 'javascript'], label: 'Web Frontend' },
  { languages: ['python', 'r'], label: 'Data Analysis' }
];

// Topics that indicate beginner-friendly projects
export const BEGINNER_FRIENDLY_TOPICS = [
  'good-first-issue',
  'beginner-friendly',
  'hacktoberfest',
  'first-timers-only',
  'up-for-grabs',
  'help-wanted',
  'newcomer-friendly',
  'easy',
  'starter',
  'tutorial',
  'learning',
  'education',
  'documentation'
];

// Topics that indicate advanced projects
export const ADVANCED_TOPICS = [
  'machine-learning',
  'artificial-intelligence',
  'deep-learning',
  'computer-vision',
  'natural-language-processing',
  'blockchain',
  'cryptocurrency',
  'kernel',
  'operating-system',
  'compiler',
  'database-engine',
  'distributed-systems',
  'microservices',
  'kubernetes',
  'docker'
];

// Popular project types for filtering
export const PROJECT_TYPES = [
  { value: 'web-app', label: 'Web Applications', topics: ['webapp', 'website', 'frontend', 'backend'] },
  { value: 'mobile-app', label: 'Mobile Apps', topics: ['android', 'ios', 'mobile', 'react-native', 'flutter'] },
  { value: 'library', label: 'Libraries & Frameworks', topics: ['library', 'framework', 'sdk', 'api'] },
  { value: 'tool', label: 'Developer Tools', topics: ['cli', 'tool', 'utility', 'productivity'] },
  { value: 'game', label: 'Games', topics: ['game', 'gaming', 'unity', 'godot'] },
  { value: 'ai-ml', label: 'AI & Machine Learning', topics: ['machine-learning', 'ai', 'deep-learning', 'tensorflow', 'pytorch'] },
  { value: 'data', label: 'Data Science', topics: ['data-science', 'data-analysis', 'visualization', 'jupyter'] },
  { value: 'devops', label: 'DevOps & Infrastructure', topics: ['devops', 'docker', 'kubernetes', 'ci-cd', 'deployment'] }
];

// Issue labels that indicate contribution opportunities
export const CONTRIBUTION_LABELS = [
  { label: 'good first issue', weight: 10, difficulty: 'beginner' },
  { label: 'help wanted', weight: 8, difficulty: 'intermediate' },
  { label: 'bug', weight: 6, difficulty: 'intermediate' },
  { label: 'enhancement', weight: 7, difficulty: 'intermediate' },
  { label: 'documentation', weight: 5, difficulty: 'beginner' },
  { label: 'hacktoberfest', weight: 9, difficulty: 'beginner' },
  { label: 'up for grabs', weight: 8, difficulty: 'beginner' },
  { label: 'first-timers-only', weight: 10, difficulty: 'beginner' },
  { label: 'feature', weight: 6, difficulty: 'intermediate' },
  { label: 'refactor', weight: 5, difficulty: 'advanced' }
];

// Repository quality indicators
export const QUALITY_INDICATORS = {
  excellent: {
    minStars: 1000,
    minForks: 100,
    hasReadme: true,
    hasLicense: true,
    hasIssueTemplate: true,
    recentActivity: 7 // days
  },
  good: {
    minStars: 100,
    minForks: 10,
    hasReadme: true,
    hasLicense: true,
    recentActivity: 30 // days
  },
  decent: {
    minStars: 10,
    minForks: 1,
    hasReadme: true,
    recentActivity: 90 // days
  }
};

// Helper function to determine project quality
export function getProjectQuality(repo) {
  const daysSinceUpdate = Math.floor(
    (Date.now() - new Date(repo.updated_at || repo.pushed_at)) / (1000 * 60 * 60 * 24)
  );

  if (
    repo.stars >= QUALITY_INDICATORS.excellent.minStars &&
    repo.forks >= QUALITY_INDICATORS.excellent.minForks &&
    daysSinceUpdate <= QUALITY_INDICATORS.excellent.recentActivity
  ) {
    return 'excellent';
  }

  if (
    repo.stars >= QUALITY_INDICATORS.good.minStars &&
    repo.forks >= QUALITY_INDICATORS.good.minForks &&
    daysSinceUpdate <= QUALITY_INDICATORS.good.recentActivity
  ) {
    return 'good';
  }

  if (
    repo.stars >= QUALITY_INDICATORS.decent.minStars &&
    repo.forks >= QUALITY_INDICATORS.decent.minForks &&
    daysSinceUpdate <= QUALITY_INDICATORS.decent.recentActivity
  ) {
    return 'decent';
  }

  return 'unknown';
}

// Helper function to get project type based on topics
export function getProjectType(topics = []) {
  for (const type of PROJECT_TYPES) {
    if (type.topics.some(topic => topics.includes(topic))) {
      return type;
    }
  }
  return null;
}

// Helper function to calculate beginner friendliness score
export function getBeginnerFriendlinessScore(repo) {
  let score = 0;
  const topics = repo.topics || [];
  
  // Check for beginner-friendly topics
  const beginnerTopics = topics.filter(topic => 
    BEGINNER_FRIENDLY_TOPICS.includes(topic)
  );
  score += beginnerTopics.length * 10;
  
  // Good first issues boost
  if (repo.good_first_issues > 0) {
    score += repo.good_first_issues * 15;
  }
  
  // Documentation boost
  if (repo.has_wiki || topics.includes('documentation')) {
    score += 10;
  }
  
  // Size penalty for very large projects
  if (repo.stars > 10000) {
    score -= 20;
  } else if (repo.stars > 1000) {
    score -= 10;
  }
  
  // Active but not overwhelming
  if (repo.stars > 50 && repo.stars < 1000) {
    score += 15;
  }
  
  return Math.max(0, Math.min(100, score));
}