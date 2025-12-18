// API layer - all backend calls go through here
import { apiClient, tokenManager } from './client';

export type GameMode = 'walls' | 'pass-through';

export interface User {
  id: string;
  username: string;
  email: string;
  highScore: number;
  gamesPlayed: number;
  createdAt: Date;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  mode: 'walls' | 'pass-through';
  date: Date;
}

export interface LiveGame {
  id: string;
  playerId: string;
  playerName: string;
  score: number;
  mode: 'walls' | 'pass-through';
  startedAt: Date;
  snake: { x: number; y: number }[];
  food: { x: number; y: number };
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
}

// Auth API
export const authApi = {
  async login(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const response = await apiClient.post<{ user: User; token?: string }>('/auth/login', {
        email,
        password,
      });

      if (response.token) {
        tokenManager.setToken(response.token);
      }

      // Store user in localStorage for quick access
      localStorage.setItem('snake_user', JSON.stringify(response.user));

      return { user: response.user, error: null };
    } catch (error) {
      return { user: null, error: error instanceof Error ? error.message : 'Login failed' };
    }
  },

  async signup(username: string, email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const response = await apiClient.post<{ user: User; token?: string }>('/auth/signup', {
        username,
        email,
        password,
      });

      if (response.token) {
        tokenManager.setToken(response.token);
      }

      // Store user in localStorage for quick access
      localStorage.setItem('snake_user', JSON.stringify(response.user));

      return { user: response.user, error: null };
    } catch (error) {
      return { user: null, error: error instanceof Error ? error.message : 'Signup failed' };
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      tokenManager.clearToken();
      localStorage.removeItem('snake_user');
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      // First check if we have a token
      if (!tokenManager.getToken()) {
        return null;
      }

      const user = await apiClient.get<User>('/auth/me');
      localStorage.setItem('snake_user', JSON.stringify(user));
      return user;
    } catch (error) {
      // If token is invalid, clear it
      tokenManager.clearToken();
      localStorage.removeItem('snake_user');
      return null;
    }
  },
};

// Leaderboard API
export const leaderboardApi = {
  async getLeaderboard(mode?: 'walls' | 'pass-through'): Promise<LeaderboardEntry[]> {
    try {
      const endpoint = mode ? `/leaderboard?mode=${mode}` : '/leaderboard';
      const entries = await apiClient.get<LeaderboardEntry[]>(endpoint);

      // Convert date strings to Date objects
      return entries.map(entry => ({
        ...entry,
        date: new Date(entry.date),
      }));
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      return [];
    }
  },

  async submitScore(score: number, mode: 'walls' | 'pass-through'): Promise<{ success: boolean; rank: number }> {
    try {
      const response = await apiClient.post<{ success: boolean; rank: number }>('/leaderboard', {
        score,
        mode,
      });

      // Update local user data
      const storedUser = localStorage.getItem('snake_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        user.gamesPlayed = (user.gamesPlayed || 0) + 1;
        if (score > (user.highScore || 0)) {
          user.highScore = score;
        }
        localStorage.setItem('snake_user', JSON.stringify(user));
      }

      return response;
    } catch (error) {
      console.error('Failed to submit score:', error);
      return { success: false, rank: -1 };
    }
  },
};

// Live Games API (for spectating)
export const liveGamesApi = {
  async getLiveGames(): Promise<LiveGame[]> {
    try {
      const games = await apiClient.get<LiveGame[]>('/games');

      // Convert date strings to Date objects
      return games.map(game => ({
        ...game,
        startedAt: new Date(game.startedAt),
      }));
    } catch (error) {
      console.error('Failed to fetch live games:', error);
      return [];
    }
  },

  async getGameById(id: string): Promise<LiveGame | null> {
    try {
      const game = await apiClient.get<LiveGame>(`/games/${id}`);

      // Convert date string to Date object
      return {
        ...game,
        startedAt: new Date(game.startedAt),
      };
    } catch (error) {
      console.error('Failed to fetch game:', error);
      return null;
    }
  },
};

// User Stats API
export const userApi = {
  async getUserStats(userId: string): Promise<{ highScore: number; gamesPlayed: number; rank: number } | null> {
    try {
      return await apiClient.get<{ highScore: number; gamesPlayed: number; rank: number }>(`/users/${userId}/stats`);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      return null;
    }
  },
};
