
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="w-full py-4 px-6 bg-white/80 backdrop-blur-md border-b border-gray-200 fixed top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-primary hover:opacity-90 transition-opacity">
          <Globe className="w-8 h-8 animate-float" />
          <span className="text-xl font-bold tracking-tight">GlobeTrotter</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link 
            to="/game" 
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Play
          </Link>
          {isAuthenticated && (
            <Link 
              to="/profile" 
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Profile
            </Link>
          )}
        </nav>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center space-x-2 text-gray-700">
                <User className="w-4 h-4" />
                <span className="font-medium">{user?.username}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center space-x-1"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </>
          ) : (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => navigate('/')}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
