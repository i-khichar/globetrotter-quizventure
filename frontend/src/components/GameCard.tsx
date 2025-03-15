
import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { useAuth } from '@/context/AuthContext';
import { Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AnswerOptions from './AnswerOptions';
import ClueCard from './ClueCard';
import ScoreDisplay from './ScoreDisplay';
import FeedbackModal from './FeedbackModal';
import SharePopup from './SharePopup';

const GameCard: React.FC = () => {
  const { currentDestination, answerOptions, loadNewQuestion, isAnswered, lastAnswerCorrect, factToShow } = useGame();
  const { user } = useAuth();
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);

  if (!currentDestination) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <CardTitle className="text-center">Loading game...</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-3/4 space-y-6">
          <ClueCard />
          
          <Card className="border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-gray-200">
              <CardTitle className="text-xl">Where am I?</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <AnswerOptions options={answerOptions} />
            </CardContent>
            <CardFooter className="bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-center">
              {isAnswered ? (
                <Button onClick={loadNewQuestion} className="ml-auto">
                  Next Destination
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              ) : (
                <div className="flex justify-end w-full">
                  <Button variant="outline" onClick={() => setIsSharePopupOpen(true)}>
                    <Users className="mr-2 w-4 h-4" />
                    Challenge a Friend
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
        
        <div className="w-full md:w-1/4">
          <ScoreDisplay />
        </div>
      </div>
      
      {isAnswered && factToShow && lastAnswerCorrect !== null && (
        <FeedbackModal
          isCorrect={lastAnswerCorrect}
          factToShow={factToShow}
          destination={currentDestination}
        />
      )}
      
      <SharePopup 
        isOpen={isSharePopupOpen}
        onClose={() => setIsSharePopupOpen(false)}
      />
    </div>
  );
};

export default GameCard;
