# 🚀 Ossify - Open Source Discovery Platform

Ossify is a modern web application that helps developers discover trending open-source projects tailored to their skill level and interests. Find beginner-friendly repositories, contribute to meaningful projects, and grow your development skills.

## ✨ Features

### 🔍 Smart Repository Discovery
- **Trending Projects**: Discover popular repositories based on different timeframes (daily, weekly, monthly)
- **Skill-Based Filtering**: Find projects matching your experience level (Beginner, Intermediate, Advanced)
- **Language-Specific Search**: Filter by programming languages including JavaScript, Python, Java, TypeScript, and more
- **Contribution Opportunities**: Identify repositories with "good first issues" and "help wanted" labels

### 💾 Personalized Experience
- **Save Favorites**: Bookmark interesting repositories for later
- **User Preferences**: Set your preferred languages, topics, and experience level
- **Dark Theme**: Beautiful dark interface optimized for long coding sessions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### 🎯 Smart Recommendations
- **Difficulty Assessment**: Automatic classification of repository complexity
- **Contribution Readiness**: Highlights projects actively seeking contributors
- **Fresh Content**: Prioritizes recently updated and maintained projects

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons

### Backend & APIs
- **Next.js API Routes** - Serverless functions
- **GitHub REST API** - Repository data and search
- **Firebase Auth** - User authentication
- **Firestore** - User data and saved repositories

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### GitHub Token Setup
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with `repo` and `read:org` permissions
3. Copy the token to your `.env.local` file


## 🎯 Usage Examples

### Finding Beginner Projects
1. Set experience level to "Beginner"
2. Filter by preferred languages
3. Look for repositories with "good first issues"


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
