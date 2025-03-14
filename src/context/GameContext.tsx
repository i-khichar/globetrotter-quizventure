
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { destinations } from '../utils/gameData';
import { toast } from '@/components/ui/sonner';

export type Destination = {
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
  const { user, isAuthenticated } = useAuth();
  const [currentDestination, setCurrentDestination] = useState<Destination | null>(null);
  const [answerOptions, setAnswerOptions] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [visibleClues, setVisibleClues] = useState<number[]>([0]); // Start with first clue visible
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [factToShow, setFactToShow] = useState<string | null>(null);

  // Initialize game on mount and when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      loadNewQuestion();
    }
  }, [isAuthenticated]);

  // Load a new question with random destination and answer options
  const loadNewQuestion = () => {
    if (destinations.length === 0) return;
    
    // Get random destination
    const randomIndex = Math.floor(Math.random() * destinations.length);
    const destination = destinations[randomIndex];
    
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
      
      setScore(prevScore => prevScore + pointsEarned);
      setStreak(newStreak);
      
      // Show a random fun fact
      const randomFactIndex = Math.floor(Math.random() * currentDestination.fun_fact.length);
      setFactToShow(currentDestination.fun_fact[randomFactIndex]);
      
      toast.success(`Correct! +${pointsEarned} points`);
    } else {
      setStreak(0);
      
      // Show a random trivia item
      const randomTriviaIndex = Math.floor(Math.random() * currentDestination.trivia.length);
      setFactToShow(currentDestination.trivia[randomTriviaIndex]);
      
      toast.error(`Incorrect. The answer was ${currentDestination.city}, ${currentDestination.country}.`);
    }
    
    return isCorrect;
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
    const availableCities = destinations
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
