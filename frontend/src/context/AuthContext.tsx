
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Define the API base URL
const API_URL = 'http://localhost:5000/api';

// Setup axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include the token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('globetrotter_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

type User = {
  id: string;
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
  isLoading: boolean;
  login: (username: string) => Promise<void>;
  logout: () => void;
  updateStats: (stats: Partial<User['gameStats']>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('globetrotter_token');
      
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to validate token:', error);
          localStorage.removeItem('globetrotter_token');
        }
      }
      
      setIsLoading(false);
    };
    
    initializeAuth();
  }, []);

  const login = async (username: string) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/login', { username });
      
      const { token, user } = response.data;
      
      localStorage.setItem('globetrotter_token', token);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('globetrotter_token');
    setUser(null);
    setIsAuthenticated(false);
  };
  
  const updateStats = async (stats: Partial<User['gameStats']>) => {
    if (!user || !isAuthenticated) return;
    
    try {
      const response = await api.put('/users/stats', stats);
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to update stats:', error);
      throw error;
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, updateStats }}>
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

// Export the api instance for use in other contexts/components
export { api };
