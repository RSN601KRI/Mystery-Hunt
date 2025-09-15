# Daily Mystery Hunt - Web Version

A standalone web version of the Daily Reddit Mystery Hunt game that can be deployed to any hosting platform.

## Features

- 🕵️ Daily mystery puzzles with automatic progression
- 💡 Hint system (3 hints per puzzle)
- 🏆 Real-time leaderboard
- 👥 Community content creation and voting
- ⏰ 24-hour timer
- 📊 Score and streak tracking
- 🎨 Beautiful responsive design

## Quick Start

1. **Install dependencies:**
   ```bash
   cd web-version
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Deployment Options

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Upload `dist` folder to Netlify
3. Configure redirects for SPA

### GitHub Pages
1. Build the project: `npm run build`
2. Push `dist` folder to `gh-pages` branch
3. Enable GitHub Pages in repository settings

### Any Static Host
- Build: `npm run build`
- Upload `dist` folder contents to your hosting provider

## How to Play

1. **Solve Daily Challenges**: Answer the featured mystery clue
2. **Use Hints**: Get up to 3 hints if you're stuck
3. **Create Content**: Submit your own mystery clues
4. **Vote & Engage**: Rate community clues
5. **Climb Leaderboards**: Compete for high scores

## Technology Stack

- React 18
- Vite
- Tailwind CSS
- JavaScript (ES6+)

## Original Devvit Version

This is a web-standalone version of the Reddit Devvit app. The original Reddit version is available in the parent directory and can be deployed to Reddit's platform.
