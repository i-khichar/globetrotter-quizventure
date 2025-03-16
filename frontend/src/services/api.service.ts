
import axios from 'axios';

// Define the API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for auth
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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common API errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        // Unauthorized - could clear token and redirect to login
        localStorage.removeItem('globetrotter_token');
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  login: (username: string) => api.post('/auth/login', { username }),
  getCurrentUser: () => api.get('/auth/me')
};

// User service
export const userService = {
  updateStats: (stats: any) => api.put('/users/stats', stats),
  getUserProfile: (userId: string) => api.get(`/users/${userId}`)
};

// Destination service
export const destinationService = {
  getAllDestinations: () => api.get('/destinations'),
  getRandomDestination: () => api.get('/destinations/random'),
  getDestinationById: (id: string) => api.get(`/destinations/${id}`)
};

// Challenge service
export const challengeService = {
  createChallenge: () => api.post('/challenges'),
  getChallengeById: (id: string) => api.get(`/challenges/${id}`),
  getChallengeByShareId: (shareId: string) => api.get(`/challenges/link/${shareId}`),
  participateInChallenge: (id: string, score: number) => 
    api.post(`/challenges/${id}/participate`, { score }),
  getUserChallenges: (userId: string) => api.get(`/challenges/user/${userId}`)
};

export default api;
