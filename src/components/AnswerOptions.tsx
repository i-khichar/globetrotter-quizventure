
import React from 'react';
import { useGame } from '@/context/GameContext';
import { Check, Frown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';

interface AnswerOptionsProps {
  options: string[];
}

const AnswerOptions: React.FC<AnswerOptionsProps> = ({ options }) => {
  const { 
    checkAnswer, 
    isAnswered, 
    lastAnswerCorrect, 
    currentDestination,
    selectedAnswer
  } = useGame();

  const handleOptionClick = (option: string) => {
    if (!isAnswered) {
      checkAnswer(option);
    }
  };

  const getButtonStyles = (option: string) => {
    if (!isAnswered) {
      return "hover:border-primary hover:text-primary transition-all";
    }
    
    if (currentDestination?.city === option) {
      return "bg-green-500 text-white border-green-600 hover:bg-green-600";
    }
    
    return "opacity-60";
  };

  return (
      <CardContent className="p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((option) => (
            <Button
              key={option}
              variant="outline"
              className={`h-16 justify-start px-4 text-left font-medium ${getButtonStyles(option)}`}
              onClick={() => handleOptionClick(option)}
              disabled={isAnswered}
            >
              <div className="flex items-center justify-between w-full">
                <span>{option}</span>
                {isAnswered && currentDestination?.city === option && (
                  <Check className="w-5 h-5 text-white" />
                )}
                {isAnswered && 
                  lastAnswerCorrect === false && 
                  selectedAnswer === option && 
                  option !== currentDestination?.city && (
                    <Frown className="w-5 h-5 text-red-500 animate-bounce" />
                )}
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
  );
};

export default AnswerOptions;
