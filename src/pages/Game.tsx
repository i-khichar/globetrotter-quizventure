
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { GameProvider } from '@/context/GameContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GameCard from '@/components/GameCard';

const Game: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not authenticated, redirect to home
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <GameProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        
        <main className="flex-grow flex items-start justify-center px-4 pt-28 pb-10">
          <div className="w-full max-w-4xl">
            <GameCard />
          </div>
        </main>
        
        <Footer />
      </div>
    </GameProvider>
  );
};

export default Game;
