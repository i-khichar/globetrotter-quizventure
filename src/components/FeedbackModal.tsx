
import React, { useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { CheckCircle, XCircle, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Destination } from '@/context/GameContext';
import sadFaceImg from '@/utils/sad.png';

interface FeedbackModalProps {
  isCorrect: boolean;
  factToShow: string;
  destination: Destination;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isCorrect, factToShow, destination }) => {
  const { loadNewQuestion } = useGame();

  useEffect(() => {
    // Create confetti effect if answer is correct
    if (isCorrect) {
      createConfetti();
    }
    else{
      createSadFaces();
    }
  }, [isCorrect]);

  const createSadFaces = () => {
    const container = document.getElementById('confetti-container');

    
    if (!container) return;
    
    for (let i = 0; i < 50; i++) {
      const sadface = document.createElement('img');
      sadface.src = sadFaceImg;
      sadface.className = 'sadface-piece';
      sadface.style.left = `${Math.random() * 100}%`;
      sadface.style.animationDuration = `${Math.random() * 1 + 1}s`;
      sadface.style.animationDelay = `${Math.random() * 0.5}s`;
      container.appendChild(sadface);
      
      // Remove sadfaces after animation
      setTimeout(() => {
        sadface.remove();
      }, 2500);
    }
  }

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

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div id="confetti-container" className="absolute inset-0 overflow-hidden pointer-events-none"></div>
      
      <Card className="mx-4 max-w-lg w-full bg-white/95 backdrop-blur-md border-0 shadow-xl animate-scale-in overflow-hidden">
        <div className={`w-full h-1.5 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}></div>
        
        <CardContent className="p-6 pt-8">
          <div className="flex items-center mb-6">
            {isCorrect ? (
              <CheckCircle className="w-12 h-12 text-green-500 mr-4 flex-shrink-0" />
            ) : (
              <img src={sadFaceImg} className="w-12 h-12 text-red-500 mr-4 flex-shrink-0" />
            )}
            
            <div>
              <h3 className={`text-xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? 'Correct!' : 'Not quite...'}
              </h3>
              <p className="text-gray-600 mt-1">
                {isCorrect
                  ? `Well done, it's ${destination.city}, ${destination.country}!`
                  : `The correct answer is ${destination.city}, ${destination.country}.`}
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
