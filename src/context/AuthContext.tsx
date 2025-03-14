
import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  username: string;
  gameStats: {
    gamesPlayed: number;
    correctAnswers: number;
    incorrectAnswers: number;
    score: number;
  };
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem('globetrotter_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem('globetrotter_user');
      }
    }
  }, []);

  const login = (username: string) => {
    // In a real app, this would be an API call to validate the user
    const newUser: User = {
      username,
      gameStats: {
        gamesPlayed: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        score: 0,
      },
    };
    
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('globetrotter_user', JSON.stringify(newUser));
  };
  
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('globetrotter_user');
  };
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
