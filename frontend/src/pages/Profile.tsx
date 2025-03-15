
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, api } from '@/context/AuthContext';
import { User, UserCheck, Award, Map, Clock, Trophy, Users, Share2, ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SharePopup from '@/components/SharePopup';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Challenge {
  _id: string;
  shareLink: string;
  createdAt: string;
  participants: {
    userId: string;
    username: string;
    score: number;
    completedAt: string;
  }[];
}

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If not authenticated, redirect to home
    if (!isAuthenticated) {
      navigate('/');
    } else {
      // Fetch user's challenges
      fetchUserChallenges();
    }
  }, [isAuthenticated, navigate]);

  const fetchUserChallenges = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/challenges/user/${user.id}`);
      setChallenges(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
      toast.error('Failed to load challenges');
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isAuthenticated || !user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="flex-grow flex items-start justify-center px-4 pt-28 pb-10">
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-slide-up">
          <Card className="border border-gray-200 bg-white/90 backdrop-blur-md overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-gray-200">
              <CardTitle className="flex items-center text-xl">
                <User className="w-5 h-5 mr-2 text-primary" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex-shrink-0 w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserCheck className="w-8 h-8 text-primary" />
                </div>
                
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">{user.username}</h2>
                  <p className="text-gray-500">Explorer</p>
                  <div className="pt-2 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate('/game')}>
                      <Map className="w-4 h-4 mr-2" />
                      Play Again
                    </Button>
                    <Button size="sm" onClick={() => setIsSharePopupOpen(true)}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Challenge Friends
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border border-gray-200 bg-white/90 backdrop-blur-md card-hover">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold">{user.gameStats.score}</h3>
                  <p className="text-gray-500 mt-1">Total Score</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 bg-white/90 backdrop-blur-md card-hover">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-4">
                    <UserCheck className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="text-3xl font-bold">{user.gameStats.correctAnswers}</h3>
                  <p className="text-gray-500 mt-1">Correct Answers</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 bg-white/90 backdrop-blur-md card-hover">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-3xl font-bold">{user.gameStats.gamesPlayed}</h3>
                  <p className="text-gray-500 mt-1">Games Played</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="border border-gray-200 bg-white/90 backdrop-blur-md overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-gray-200">
              <CardTitle className="flex items-center text-xl">
                <Trophy className="w-5 h-5 mr-2 text-primary" />
                Challenge History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : challenges.length > 0 ? (
                <div className="space-y-4">
                  {challenges.map(challenge => (
                    <div key={challenge._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Created on {formatDate(challenge.createdAt)}</p>
                          <h4 className="font-medium mt-1">Challenge with {challenge.participants.length} participants</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => {
                            navigator.clipboard.writeText(challenge.shareLink);
                            toast.success("Challenge link copied to clipboard");
                          }}>
                            Copy Link
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <a href={challenge.shareLink} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Open
                            </a>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h5 className="text-sm font-medium mb-2">Leaderboard:</h5>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {challenge.participants
                            .sort((a, b) => b.score - a.score)
                            .map((participant, index) => (
                              <div 
                                key={participant.userId} 
                                className={`flex justify-between items-center p-2 rounded ${
                                  participant.userId === user.id ? 'bg-primary/10' : 'bg-gray-50'
                                }`}
                              >
                                <div className="flex items-center">
                                  <span className="w-6 text-center font-medium text-gray-500">#{index + 1}</span>
                                  <span className="ml-2">{participant.username}</span>
                                  {participant.userId === user.id && (
                                    <span className="ml-2 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">You</span>
                                  )}
                                </div>
                                <span className="font-bold">{participant.score} pts</span>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No challenges yet. Start one by inviting a friend!</p>
                  <Button className="mt-4" onClick={() => setIsSharePopupOpen(true)}>
                    <Users className="w-4 h-4 mr-2" />
                    Challenge a Friend
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
      
      <SharePopup 
        isOpen={isSharePopupOpen}
        onClose={() => setIsSharePopupOpen(false)}
      />
    </div>
  );
};

export default Profile;
