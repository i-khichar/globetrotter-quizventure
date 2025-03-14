
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { GameProvider } from '@/context/GameContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GameCard from '@/components/GameCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, ArrowRight } from 'lucide-react';

const Game: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Parse query parameters to handle challenge invitations
  const queryParams = new URLSearchParams(location.search);
  const challengeId = queryParams.get('challenge');
  const challengerName = queryParams.get('username');
  const challengerScore = queryParams.get('score');
  
  const [showChallengeInfo, setShowChallengeInfo] = useState(!!challengeId);

  useEffect(() => {
    // If not authenticated, redirect to home
    if (!isAuthenticated) {
      // Save the challenge data in sessionStorage so we can retrieve it after login
      if (challengeId) {
        sessionStorage.setItem('pendingChallenge', JSON.stringify({
          challengeId,
          challengerName,
          challengerScore
        }));
      }
      navigate('/');
    } else if (challengeId) {
      // If user is coming from a challenge link, show the challenge info
      setShowChallengeInfo(true);
    }
  }, [isAuthenticated, navigate, challengeId, challengerName, challengerScore]);

  const handleStartChallenge = () => {
    setShowChallengeInfo(false);
  };

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <GameProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        
        <main className="flex-grow flex items-start justify-center px-4 pt-28 pb-10">
          <div className="w-full max-w-4xl">
            {showChallengeInfo && challengerName && challengerScore ? (
              <Card className="mb-8 border-2 border-primary/20 bg-white/90 backdrop-blur-md animate-scale-in">
                <CardHeader className="bg-primary/5 border-b border-gray-200">
                  <CardTitle className="flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-amber-500" />
                    Challenge from {challengerName}
                  </CardTitle>
                  <CardDescription>
                    You've been challenged to beat a score of {challengerScore} points!
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 flex justify-end">
                  <Button onClick={handleStartChallenge}>
                    Accept Challenge
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ) : null}
            
            <GameCard />
          </div>
        </main>
        
        <Footer />
      </div>
    </GameProvider>
  );
};

export default Game;
