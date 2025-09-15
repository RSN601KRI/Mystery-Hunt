import { useCallback, useEffect, useState } from 'react';

interface MysteryChallenge {
  id: string;
  clue: string;
  answer: string;
  hints: string[];
  difficulty: number;
  category: string;
  communityContent: CommunityContent[];
}

interface CommunityContent {
  clue: string;
  answer: string;
  difficulty: number;
  author: string;
  upvotes: number;
  downvotes: number;
}

interface LeaderboardPlayer {
  name: string;
  score: number;
  streak: number;
}

interface UserContent {
  clue: string;
  answer: string;
  difficulty: number;
  setClue: (clue: string) => void;
  setAnswer: (answer: string) => void;
  setDifficulty: (difficulty: number) => void;
}

// Pre-defined mystery puzzles database
const MYSTERY_PUZZLES: Omit<MysteryChallenge, 'communityContent'>[] = [
  {
    id: '1',
    clue: "I'm a place where you can find me in the sky, but I'm also found in your pocket. What am I?",
    answer: "moon",
    hints: [
      "It changes shape throughout the month",
      "It's made of cheese according to some stories",
      "It's Earth's natural satellite"
    ],
    difficulty: 3,
    category: "Riddles"
  },
  {
    id: '2',
    clue: "I have keys but no locks, space but no room, and you can enter but not go inside. What am I?",
    answer: "keyboard",
    hints: [
      "It's used for typing",
      "It has letters and numbers",
      "It's connected to computers"
    ],
    difficulty: 2,
    category: "Technology"
  },
  {
    id: '3',
    clue: "The more you take, the more you leave behind. What am I?",
    answer: "footsteps",
    hints: [
      "They're made when walking",
      "They leave marks on the ground",
      "The more you walk, the more you create"
    ],
    difficulty: 4,
    category: "Logic"
  },
  {
    id: '4',
    clue: "I'm tall when I'm young and short when I'm old. What am I?",
    answer: "candle",
    hints: [
      "It burns and melts",
      "It provides light",
      "It gets shorter as it burns"
    ],
    difficulty: 2,
    category: "Objects"
  },
  {
    id: '5',
    clue: "I have cities but no houses, forests but no trees, and rivers but no water. What am I?",
    answer: "map",
    hints: [
      "It shows geographical features",
      "It's used for navigation",
      "It represents real places"
    ],
    difficulty: 3,
    category: "Geography"
  },
  {
    id: '6',
    clue: "I'm always in front of you but can never be seen. What am I?",
    answer: "future",
    hints: [
      "It's a concept of time",
      "It hasn't happened yet",
      "It's always ahead"
    ],
    difficulty: 4,
    category: "Philosophy"
  }
];

export const useMysteryHunt = () => {
  const [currentChallenge, setCurrentChallenge] = useState<MysteryChallenge>(() => {
    const randomPuzzle = MYSTERY_PUZZLES[Math.floor(Math.random() * MYSTERY_PUZZLES.length)];
    return {
      id: randomPuzzle.id,
      clue: randomPuzzle.clue,
      answer: randomPuzzle.answer,
      hints: randomPuzzle.hints,
      difficulty: randomPuzzle.difficulty,
      category: randomPuzzle.category,
      communityContent: [
        {
          clue: "I have keys but no locks, space but no room, and you can enter but not go inside. What am I?",
          answer: "keyboard",
          difficulty: 2,
          author: "PuzzleMaster123",
          upvotes: 15,
          downvotes: 2
        },
        {
          clue: "The more you take, the more you leave behind. What am I?",
          answer: "footsteps",
          difficulty: 4,
          author: "MysterySolver",
          upvotes: 23,
          downvotes: 1
        }
      ]
    };
  });

  const [userAnswer, setUserAnswer] = useState('');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('23:45:12');
  const [loading, setLoading] = useState(false);
  const [solvedPuzzles, setSolvedPuzzles] = useState<string[]>([]);

  const [leaderboard] = useState<LeaderboardPlayer[]>([
    { name: "DetectivePro", score: 1250, streak: 7 },
    { name: "MysteryMaster", score: 1180, streak: 5 },
    { name: "PuzzleKing", score: 1100, streak: 3 },
    { name: "RiddleRanger", score: 950, streak: 2 },
    { name: "ClueHunter", score: 800, streak: 1 }
  ]);

  const [userContent, setUserContent] = useState<UserContent>({
    clue: '',
    answer: '',
    difficulty: 1,
    setClue: (clue: string) => setUserContent(prev => ({ ...prev, clue })),
    setAnswer: (answer: string) => setUserContent(prev => ({ ...prev, answer })),
    setDifficulty: (difficulty: number) => setUserContent(prev => ({ ...prev, difficulty }))
  });

  // Check if we're running locally
  const isLocalDev = window.location.hostname === 'localhost';

  // Function to get next random puzzle
  const getNextPuzzle = useCallback(() => {
    const availablePuzzles = MYSTERY_PUZZLES.filter(puzzle => !solvedPuzzles.includes(puzzle.id));
    
    if (availablePuzzles.length === 0) {
      // If all puzzles solved, reset and start over
      setSolvedPuzzles([]);
      const randomPuzzle = MYSTERY_PUZZLES[Math.floor(Math.random() * MYSTERY_PUZZLES.length)];
      return randomPuzzle;
    }
    
    const randomPuzzle = availablePuzzles[Math.floor(Math.random() * availablePuzzles.length)];
    return randomPuzzle;
  }, [solvedPuzzles]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const [hours, minutes, seconds] = prev.split(':').map(Number);
        let totalSeconds = (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0) - 1;
        
        if (totalSeconds <= 0) {
          totalSeconds = 24 * 3600; // Reset to 24 hours
        }
        
        const newHours = Math.floor(totalSeconds / 3600);
        const newMinutes = Math.floor((totalSeconds % 3600) / 60);
        const newSeconds = totalSeconds % 60;
        
        return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const submitAnswer = useCallback(async () => {
    if (!userAnswer.trim()) return;
    
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const isCorrect = userAnswer.toLowerCase().trim() === currentChallenge.answer.toLowerCase();
    
    if (isCorrect) {
      const points = currentChallenge.difficulty * 100 - (hintsUsed * 20);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      
      // Add current puzzle to solved list
      setSolvedPuzzles(prev => [...prev, currentChallenge.id]);
      
      // Get next puzzle
      const nextPuzzle = getNextPuzzle();
      
      // Update challenge with new puzzle
      setCurrentChallenge(prev => ({
        id: nextPuzzle.id,
        clue: nextPuzzle.clue,
        answer: nextPuzzle.answer,
        hints: nextPuzzle.hints,
        difficulty: nextPuzzle.difficulty,
        category: nextPuzzle.category,
        communityContent: prev.communityContent // Keep existing community content
      }));
      
      alert(`🎉 Correct! You earned ${points} points! New puzzle loaded!`);
    } else {
      setStreak(0);
      alert('❌ Incorrect! Try again or use a hint.');
    }
    
    setUserAnswer('');
    setHintsUsed(0);
    setLoading(false);
  }, [userAnswer, currentChallenge, hintsUsed, getNextPuzzle]);

  const useHint = useCallback((hintNumber: number) => {
    if (hintsUsed >= hintNumber) return;
    setHintsUsed(hintNumber);
  }, [hintsUsed]);

  const submitUserContent = useCallback(async () => {
    if (!userContent.clue.trim() || !userContent.answer.trim()) return;
    
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newContent: CommunityContent = {
      clue: userContent.clue,
      answer: userContent.answer,
      difficulty: userContent.difficulty,
      author: isLocalDev ? 'Local Developer' : 'Current User',
      upvotes: 0,
      downvotes: 0
    };
    
    setCurrentChallenge(prev => ({
      ...prev,
      communityContent: [...prev.communityContent, newContent]
    }));
    
    setUserContent({
      clue: '',
      answer: '',
      difficulty: 1,
      setClue: userContent.setClue,
      setAnswer: userContent.setAnswer,
      setDifficulty: userContent.setDifficulty
    });
    
    alert('🎯 Your mystery has been submitted!');
    setLoading(false);
  }, [userContent, isLocalDev]);

  const voteOnContent = useCallback((index: number, voteType: 'up' | 'down') => {
    setCurrentChallenge(prev => ({
      ...prev,
      communityContent: prev.communityContent.map((content, i) => 
        i === index 
          ? {
              ...content,
              upvotes: voteType === 'up' ? content.upvotes + 1 : content.upvotes,
              downvotes: voteType === 'down' ? content.downvotes + 1 : content.downvotes
            }
          : content
      )
    }));
  }, []);

  return {
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
  } as const;
};
