
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth, api } from './AuthContext';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';

export type Destination = {
  _id: string;
  city: string;
  country: string;
  clues: string[];
  fun_fact: string[];
  trivia: string[];
  image?: string;
};

interface GameContextType {
  currentDestination: Destination | null;
  answerOptions: string[];
  score: number;
  streak: number;
  loadNewQuestion: () => void;
  checkAnswer: (answer: string) => boolean;
  showClue: (index: number) => void;
  visibleClues: number[];
  isAnswered: boolean;
  lastAnswerCorrect: boolean | null;
  factToShow: string | null;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, updateStats } = useAuth();
  const location = useLocation();
  const [currentDestination, setCurrentDestination] = useState<Destination | null>(null);
  const [answerOptions, setAnswerOptions] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [visibleClues, setVisibleClues] = useState<number[]>([0]); // Start with first clue visible
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [factToShow, setFactToShow] = useState<string | null>(null);
  const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Detect if this is a challenge from URL parameters
  const queryParams = new URLSearchParams(location.search);
  const challengeId = queryParams.get('challenge');
  
  // Fetch all destinations on component mount
  useEffect(() => {
    const fetchDestinations = async () => {
      if (!isAuthenticated) return;
      
      try {
        const response = await api.get('/destinations');
        setAllDestinations(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch destinations:', error);
        toast.error('Failed to load destinations. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchDestinations();
  }, [isAuthenticated]);
  
  // Initialize game on mount and when auth state changes
  useEffect(() => {
    if (isAuthenticated && !isLoading && allDestinations.length > 0) {
      loadNewQuestion();
    }
  }, [isAuthenticated, isLoading, allDestinations]);

  // Load a new question with random destination and answer options
  const loadNewQuestion = () => {
    if (allDestinations.length === 0) return;
    
    // Get random destination
    const randomIndex = Math.floor(Math.random() * allDestinations.length);
    const destination = allDestinations[randomIndex];
    
    // Get random cities for wrong answers (3 options)
    const wrongOptions = getRandomWrongOptions(destination.city, 3);
    
    // Combine and shuffle options
    const options = [destination.city, ...wrongOptions];
    const shuffledOptions = shuffleArray(options);
    
    setCurrentDestination(destination);
    setAnswerOptions(shuffledOptions);
    setVisibleClues([0]); // Reset to only showing first clue
    setIsAnswered(false);
    setLastAnswerCorrect(null);
    setFactToShow(null);
  };

  // Check if the given answer is correct
  const checkAnswer = (answer: string): boolean => {
    if (!currentDestination || isAnswered) return false;
    
    const isCorrect = answer === currentDestination.city;
    setIsAnswered(true);
    setLastAnswerCorrect(isCorrect);
    
    if (isCorrect) {
      // Calculate points (base + streak bonus)
      const newStreak = streak + 1;
      const streakBonus = newStreak > 1 ? (newStreak - 1) * 2 : 0;
      const pointsEarned = 10 + streakBonus;
      
      const newScore = score + pointsEarned;
      setScore(newScore);
      setStreak(newStreak);
      
      // Show a random fun fact
      const randomFactIndex = Math.floor(Math.random() * currentDestination.fun_fact.length);
      setFactToShow(currentDestination.fun_fact[randomFactIndex]);
      
      toast.success(`Correct! +${pointsEarned} points`);
      
      // Update user stats in the backend
      updateStats({
        score: (user?.gameStats.score || 0) + pointsEarned,
        correctAnswers: (user?.gameStats.correctAnswers || 0) + 1,
        gamesPlayed: (user?.gameStats.gamesPlayed || 0) + 1
      }).catch(error => {
        console.error('Failed to update stats:', error);
      });
      
      // In a challenge mode, update challenge participant score
      if (challengeId) {
        updateChallengeScore(challengeId, newScore);
      }
    } else {
      setStreak(0);
      
      // Show a random trivia item
      const randomTriviaIndex = Math.floor(Math.random() * currentDestination.trivia.length);
      setFactToShow(currentDestination.trivia[randomTriviaIndex]);
      
      toast.error(`Incorrect. The answer was ${currentDestination.city}, ${currentDestination.country}.`);
      
      // Update user stats in the backend
      updateStats({
        incorrectAnswers: (user?.gameStats.incorrectAnswers || 0) + 1,
        gamesPlayed: (user?.gameStats.gamesPlayed || 0) + 1
      }).catch(error => {
        console.error('Failed to update stats:', error);
      });
    }
    
    return isCorrect;
  };

  // Update score in a challenge
  const updateChallengeScore = async (challengeId: string, newScore: number) => {
    try {
      const response = await api.post(`/challenges/${challengeId}/participate`, { score: newScore });
      console.log('Challenge score updated:', response.data);
    } catch (error) {
      console.error('Failed to update challenge score:', error);
    }
  };

  // Show additional clue
  const showClue = (index: number) => {
    if (!visibleClues.includes(index)) {
      setVisibleClues(prev => [...prev, index]);
    }
  };

  // Helper function to get random wrong answer options
  const getRandomWrongOptions = (correctCity: string, count: number): string[] => {
    const wrongOptions: string[] = [];
    const availableCities = allDestinations
      .filter(dest => dest.city !== correctCity)
      .map(dest => dest.city);
    
    while (wrongOptions.length < count && availableCities.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableCities.length);
      wrongOptions.push(availableCities[randomIndex]);
      availableCities.splice(randomIndex, 1);
    }
    
    return wrongOptions;
  };

  // Helper function to shuffle an array (Fisher-Yates algorithm)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  return (
    <GameContext.Provider
      value={{
        currentDestination,
        answerOptions,
        score,
        streak,
        loadNewQuestion,
        checkAnswer,
        showClue,
        visibleClues,
        isAnswered,
        lastAnswerCorrect,
        factToShow
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
