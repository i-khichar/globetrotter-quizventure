
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Globe, MapPin, Trophy, Users } from 'lucide-react';
import AuthForm from '@/components/AuthForm';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to game
    if (isAuthenticated) {
      navigate('/game');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="flex-grow flex items-center justify-center px-4 pt-20 pb-10">
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
          <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left animate-slide-up">
            <div className="inline-flex items-center justify-center lg:justify-start space-x-2 text-primary p-2 rounded-full bg-primary/5 mb-2">
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium">Test Your Geography Skills</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              Explore the World <br className="hidden lg:block" />
              <span className="text-primary">One Quiz at a Time</span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
              Challenge yourself with our geography quiz featuring clues about famous destinations around the world. How many can you guess correctly?
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200 flex flex-col items-center lg:items-start">
                <div className="bg-primary/10 p-2 rounded-full mb-3">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-medium text-gray-900">Global Destinations</h3>
                <p className="text-sm text-gray-500 mt-1">Explore fascinating locations</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200 flex flex-col items-center lg:items-start">
                <div className="bg-primary/10 p-2 rounded-full mb-3">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-medium text-gray-900">Score Points</h3>
                <p className="text-sm text-gray-500 mt-1">Earn more with streak bonuses</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200 flex flex-col items-center lg:items-start">
                <div className="bg-primary/10 p-2 rounded-full mb-3">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-medium text-gray-900">Challenge Friends</h3>
                <p className="text-sm text-gray-500 mt-1">Compete for the high score</p>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 max-w-md mx-auto">
            <AuthForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
