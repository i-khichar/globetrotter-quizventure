
import React, { useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { CheckCircle, XCircle, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

const FeedbackModal: React.FC = () => {
  const { 
    isAnswered, 
    lastAnswerCorrect, 
    factToShow, 
    currentDestination, 
    loadNewQuestion 
  } = useGame();

  useEffect(() => {
    if (isAnswered) {
      // Create confetti effect if answer is correct
      if (lastAnswerCorrect) {
        createConfetti();
      }
    }
  }, [isAnswered, lastAnswerCorrect]);

  const createConfetti = () => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3'];
    const container = document.getElementById('confetti-container');
    
    if (!container) return;
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.animationDuration = `${Math.random() * 1 + 1}s`;
      confetti.style.animationDelay = `${Math.random() * 0.5}s`;
      container.appendChild(confetti);
      
      // Remove confetti after animation
      setTimeout(() => {
        confetti.remove();
      }, 2500);
    }
  };

  if (!isAnswered || !currentDestination) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div id="confetti-container" className="absolute inset-0 overflow-hidden pointer-events-none"></div>
      
      <Card className="mx-4 max-w-lg w-full bg-white/95 backdrop-blur-md border-0 shadow-xl animate-scale-in overflow-hidden">
        <div className={`w-full h-1.5 ${lastAnswerCorrect ? 'bg-green-500' : 'bg-red-500'}`}></div>
        
        <CardContent className="p-6 pt-8">
          <div className="flex items-center mb-6">
            {lastAnswerCorrect ? (
              <CheckCircle className="w-12 h-12 text-green-500 mr-4 flex-shrink-0" />
            ) : (
              <XCircle className="w-12 h-12 text-red-500 mr-4 flex-shrink-0" />
            )}
            
            <div>
              <h3 className={`text-xl font-bold ${lastAnswerCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {lastAnswerCorrect ? 'Correct!' : 'Not quite...'}
              </h3>
              <p className="text-gray-600 mt-1">
                {lastAnswerCorrect
                  ? `Well done, it's ${currentDestination.city}, ${currentDestination.country}!`
                  : `The correct answer is ${currentDestination.city}, ${currentDestination.country}.`}
              </p>
            </div>
          </div>
          
          {factToShow && (
            <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="bg-white p-2 rounded-full border border-gray-200 mr-3 mt-0.5">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <p className="text-gray-700">{factToShow}</p>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-6 pt-0">
          <Button 
            className="w-full h-12 text-base"
            onClick={loadNewQuestion}
          >
            <span>Next Destination</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FeedbackModal;
