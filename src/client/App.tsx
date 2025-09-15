import { navigateTo } from '@devvit/web/client';
import { useMysteryHunt } from './hooks/useMysteryHunt';

export const App = () => {
  const { 
    currentChallenge, 
    userAnswer, 
    setUserAnswer, 
    submitAnswer, 
    hintsUsed, 
    useHint, 
    timeRemaining, 
    score, 
    streak, 
    leaderboard,
    userContent,
    submitUserContent,
    voteOnContent,
    loading 
  } = useMysteryHunt();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-4 py-8">
          <img 
            className="object-contain w-24 h-24 mx-auto drop-shadow-lg hover:scale-110 transition-transform duration-300" 
            src="/snoo.png" 
            alt="Reddit Snoo" 
          />
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              🕵️ Daily Reddit Mystery Hunt
        </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Solve mysteries, create content, and climb the leaderboards!
        </p>
      </div>
          {window.location.hostname === 'localhost' && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded-lg text-sm max-w-md mx-auto">
              🛠️ Local Development Mode - All features are functional!
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="text-3xl font-bold text-blue-600 mb-2">{score}</div>
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Score</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="text-3xl font-bold text-orange-600 mb-2">{streak}</div>
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Streak</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="text-3xl font-bold text-red-600 mb-2">{timeRemaining}</div>
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Time Left</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Challenge Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition-shadow">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3">
                <h2 className="text-2xl font-semibold text-gray-700">Today's Mystery Challenge</h2>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium animate-pulse">
                  #{currentChallenge.id}
                </span>
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                <h3 className="text-lg font-medium text-gray-800 mb-4">🔍 Mystery Clue</h3>
                <p className="text-gray-700 text-lg leading-relaxed font-medium">
                  {currentChallenge.clue}
                </p>
                <div className="mt-4 flex justify-center gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Difficulty: {currentChallenge.difficulty}/5
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Category: {currentChallenge.category}
                  </span>
                </div>
              </div>

              {/* Answer Input */}
              <div className="space-y-4">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Enter your answer..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-colors"
                  disabled={loading}
                />
                <button
                  onClick={submitAnswer}
                  disabled={loading || !userAnswer.trim()}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {loading ? 'Submitting...' : 'Submit Answer'}
                </button>
              </div>

              {/* Hints Section */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-3">💡 Hints Available</h4>
                <div className="flex gap-2 justify-center flex-wrap">
                  {[1, 2, 3].map((hintNum) => (
                    <button
                      key={hintNum}
                      onClick={() => useHint(hintNum)}
                      disabled={hintsUsed >= hintNum || loading}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        hintsUsed >= hintNum
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                      }`}
                    >
                      Hint {hintNum}
                    </button>
                  ))}
                </div>
                {hintsUsed > 0 && (
                  <div className="mt-3 text-sm text-yellow-700 bg-yellow-100 p-3 rounded-lg">
                    <strong>Hint {hintsUsed}:</strong> {currentChallenge.hints[hintsUsed - 1]}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Generated Content Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Create Your Own Mystery</h2>
            
            <div className="space-y-4">
              <textarea
                placeholder="Write your mystery clue here..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-24 resize-none transition-colors"
                value={userContent.clue}
                onChange={(e) => userContent.setClue(e.target.value)}
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Answer"
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  value={userContent.answer}
                  onChange={(e) => userContent.setAnswer(e.target.value)}
                />
                <select
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  value={userContent.difficulty}
                  onChange={(e) => userContent.setDifficulty(parseInt(e.target.value))}
                >
                  <option value={1}>Easy</option>
                  <option value={2}>Medium</option>
                  <option value={3}>Hard</option>
                  <option value={4}>Expert</option>
                  <option value={5}>Master</option>
                </select>
              </div>
              <button
                onClick={submitUserContent}
                disabled={!userContent.clue.trim() || !userContent.answer.trim()}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                Submit Mystery
              </button>
            </div>
          </div>
        </div>

        {/* Community Content Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition-shadow">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Community Mysteries</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentChallenge.communityContent.map((content, index) => (
              <div key={index} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-800">Mystery #{index + 1}</h4>
                  <div className="flex gap-2">
        <button
                      onClick={() => voteOnContent(index, 'up')}
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm transition-colors transform hover:scale-105"
        >
                      👍 {content.upvotes}
        </button>
        <button
                      onClick={() => voteOnContent(index, 'down')}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors transform hover:scale-105"
        >
                      👎 {content.downvotes}
        </button>
      </div>
                </div>
                <p className="text-gray-700 mb-3 font-medium">{content.clue}</p>
                <div className="flex gap-2 text-sm text-gray-500">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Difficulty: {content.difficulty}/5</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">By: {content.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition-shadow">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">🏆 Daily Leaderboard</h2>
          
          <div className="space-y-3">
            {leaderboard.map((player, index) => (
              <div key={index} className={`flex justify-between items-center p-4 rounded-lg transition-all duration-200 hover:scale-105 ${
                index === 0 ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-300 shadow-lg' :
                index === 1 ? 'bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300 shadow-lg' :
                index === 2 ? 'bg-gradient-to-r from-orange-100 to-orange-200 border-2 border-orange-300 shadow-lg' :
                'bg-gray-50 border border-gray-200 hover:shadow-md'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </span>
                  <span className="font-medium text-lg">{player.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xl">{player.score}</div>
                  <div className="text-sm text-gray-600">{player.streak} streak</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8">
          <div className="flex gap-6 justify-center text-sm">
        <button
              className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors font-medium"
          onClick={() => navigateTo('https://developers.reddit.com/docs')}
        >
              📚 Docs
        </button>
        <span className="text-gray-300">|</span>
        <button
              className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors font-medium"
          onClick={() => navigateTo('https://www.reddit.com/r/Devvit')}
        >
              🏠 r/Devvit
        </button>
        <span className="text-gray-300">|</span>
        <button
              className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors font-medium"
          onClick={() => navigateTo('https://discord.com/invite/R7yu2wh9Qz')}
        >
              💬 Discord
        </button>
          </div>
      </footer>
      </div>
    </div>
  );
};