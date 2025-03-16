
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
import { api } from '@/context/AuthContext';

const Game: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Parse query parameters to handle challenge invitations
  const queryParams = new URLSearchParams(location.search);
  const challengeId = queryParams.get('challenge');
  
  const [showChallengeInfo, setShowChallengeInfo] = useState(!!challengeId);
  const [challengeData, setChallengeData] = useState<{
    username?: string;
    score?: number;
  }>({});
  const [loading, setLoading] = useState(!!challengeId);

  useEffect(() => {
    // If not authenticated, redirect to home
    if (!isAuthenticated) {
      // Save the challenge data in sessionStorage so we can retrieve it after login
      if (challengeId) {
        sessionStorage.setItem('pendingChallenge', JSON.stringify({
          challengeId
        }));
      }
      navigate('/');
      return;
    } 
    let storedChallengeId = null;

    if (!challengeId) {
      const storedChallenge = sessionStorage.getItem('pendingChallenge');
      if (storedChallenge) {
        storedChallengeId = JSON.parse(storedChallenge).challengeId;
      }
    }

    const finalChallengeId = challengeId || storedChallengeId;

    if (finalChallengeId) {
      fetchChallengeInfo(finalChallengeId);
    }
  }, [isAuthenticated, navigate, challengeId]);

  const fetchChallengeInfo = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/challenges/link/${id}`);
      await api.post(`/challenges/${id}/participate`, { score: 0 });
      const challenge = response.data;
      
      if (challenge && challenge.participants && challenge.participants.length > 0) {
        // Find the creator's score (first participant or highest score)
        let highestScore = 0;
        let challengerName = '';
        
        challenge.participants.forEach((participant: any) => {
          if (participant.score > highestScore) {
            highestScore = participant.score;
            challengerName = participant.username;
          }
        });
        
        setChallengeData({
          username: challengerName || 'someone',
          score: highestScore
        });
      }
      
      setLoading(false);
      setShowChallengeInfo(true);
    } catch (error) {
      console.error('Failed to fetch challenge data:', error);
      setLoading(false);
    }
  };

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
            {loading ? (
              <Card className="mb-8 border-2 border-primary/20 bg-white/90 backdrop-blur-md">
                <CardContent className="p-6 flex justify-center items-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </CardContent>
              </Card>
            ) : (
              showChallengeInfo && challengeData.username && challengeData.score ? (
                <Card className="mb-8 border-2 border-primary/20 bg-white/90 backdrop-blur-md animate-scale-in">
                  <CardHeader className="bg-primary/5 border-b border-gray-200">
                    <CardTitle className="flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-amber-500" />
                      Challenge from {challengeData.username}
                    </CardTitle>
                    <CardDescription>
                      You've been challenged to beat a score of {challengeData.score} points!
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 flex justify-end">
                    <Button onClick={handleStartChallenge}>
                      Accept Challenge
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ) : null
            )}
            
            <GameCard />
          </div>
        </main>
        
        <Footer />
      </div>
    </GameProvider>
  );
};

export default Game;
