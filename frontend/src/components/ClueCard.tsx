
import React from 'react';
import { MapPin, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/context/GameContext';
import { Card } from '@/components/ui/card';

const ClueCard: React.FC = () => {
  const { 
    currentDestination, 
    visibleClues, 
    showClue,
    isAnswered
  } = useGame();

  if (!currentDestination) {
    return (
      <Card className="w-full bg-white/90 backdrop-blur-md border border-gray-200 p-8 flex items-center justify-center animate-pulse-gentle">
        <div className="text-gray-400">Loading clue...</div>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white/90 backdrop-blur-md border border-gray-200 overflow-hidden transition-all duration-300 animate-slide-up">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <MapPin className="w-5 h-5 text-primary mr-2" />
            Mystery Destination
          </h3>
          <div className="badge bg-primary/10 text-primary border-primary/20">
            Clue {visibleClues.length}/{currentDestination.clues.length}
          </div>
        </div>
        
        <div className="space-y-3">
          {visibleClues.map((index) => (
            <div 
              key={index} 
              className="bg-gray-50 p-4 rounded-md border border-gray-100 animate-fade-in"
            >
              <p className="text-gray-700">{currentDestination.clues[index]}</p>
            </div>
          ))}
        </div>
        
        {visibleClues.length < currentDestination.clues.length && !isAnswered && (
          <Button
            variant="outline" 
            onClick={() => showClue(visibleClues.length)}
            className="w-full mt-2 border-dashed border-gray-300 text-gray-600 hover:text-primary hover:border-primary transition-colors"
          >
            <Info className="w-4 h-4 mr-2" />
            Reveal another clue
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ClueCard;
