// Centralized mock API layer - all backend calls go through here
// This makes it easy to replace with real backend later

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

// Simulated delay for API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data storage
let currentUser: User | null = null;
const users: Map<string, User & { password: string }> = new Map();

// Initialize with some mock users
const mockUsers = [
  { id: '1', username: 'SnakeMaster', email: 'snake@example.com', password: 'test123', highScore: 2450, gamesPlayed: 156 },
  { id: '2', username: 'RetroGamer', email: 'retro@example.com', password: 'test123', highScore: 1890, gamesPlayed: 89 },
  { id: '3', username: 'PixelKing', email: 'pixel@example.com', password: 'test123', highScore: 1650, gamesPlayed: 234 },
  { id: '4', username: 'ArcadeQueen', email: 'arcade@example.com', password: 'test123', highScore: 1420, gamesPlayed: 67 },
  { id: '5', username: 'NeonNinja', email: 'neon@example.com', password: 'test123', highScore: 1280, gamesPlayed: 112 },
];

mockUsers.forEach(u => users.set(u.email, { ...u, createdAt: new Date() }));

// Mock leaderboard data
const mockLeaderboard: LeaderboardEntry[] = [
  { id: '1', username: 'SnakeMaster', score: 2450, mode: 'walls', date: new Date('2024-01-15') },
  { id: '2', username: 'RetroGamer', score: 1890, mode: 'pass-through', date: new Date('2024-01-14') },
  { id: '3', username: 'PixelKing', score: 1650, mode: 'walls', date: new Date('2024-01-13') },
  { id: '4', username: 'ArcadeQueen', score: 1420, mode: 'pass-through', date: new Date('2024-01-12') },
  { id: '5', username: 'NeonNinja', score: 1280, mode: 'walls', date: new Date('2024-01-11') },
  { id: '6', username: 'GlowWorm', score: 1150, mode: 'pass-through', date: new Date('2024-01-10') },
  { id: '7', username: 'ByteBiter', score: 980, mode: 'walls', date: new Date('2024-01-09') },
  { id: '8', username: 'GridRunner', score: 850, mode: 'pass-through', date: new Date('2024-01-08') },
  { id: '9', username: 'DigitalDuke', score: 720, mode: 'walls', date: new Date('2024-01-07') },
  { id: '10', username: 'CyberSnake', score: 650, mode: 'pass-through', date: new Date('2024-01-06') },
];

// Auth API
export const authApi = {
  async login(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    await delay(500);
    const user = users.get(email);
    
    if (!user) {
      return { user: null, error: 'User not found' };
    }
    
    if (user.password !== password) {
      return { user: null, error: 'Invalid password' };
    }
    
    const { password: _, ...userWithoutPassword } = user;
    currentUser = userWithoutPassword;
    localStorage.setItem('snake_user', JSON.stringify(currentUser));
    return { user: currentUser, error: null };
  },

  async signup(username: string, email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    await delay(500);
    
    if (users.has(email)) {
      return { user: null, error: 'Email already registered' };
    }
    
    const existingUsername = Array.from(users.values()).find(u => u.username === username);
    if (existingUsername) {
      return { user: null, error: 'Username already taken' };
    }
    
    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      username,
      email,
      password,
      highScore: 0,
      gamesPlayed: 0,
      createdAt: new Date(),
    };
    
    users.set(email, newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    currentUser = userWithoutPassword;
    localStorage.setItem('snake_user', JSON.stringify(currentUser));
    return { user: currentUser, error: null };
  },

  async logout(): Promise<void> {
    await delay(200);
    currentUser = null;
    localStorage.removeItem('snake_user');
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(100);
    const stored = localStorage.getItem('snake_user');
    if (stored) {
      currentUser = JSON.parse(stored);
      return currentUser;
    }
    return null;
  },
};

// Leaderboard API
export const leaderboardApi = {
  async getLeaderboard(mode?: 'walls' | 'pass-through'): Promise<LeaderboardEntry[]> {
    await delay(300);
    if (mode) {
      return mockLeaderboard.filter(e => e.mode === mode);
    }
    return mockLeaderboard;
  },

  async submitScore(score: number, mode: 'walls' | 'pass-through'): Promise<{ success: boolean; rank: number }> {
    await delay(400);
    if (!currentUser) {
      return { success: false, rank: -1 };
    }
    
    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      username: currentUser.username,
      score,
      mode,
      date: new Date(),
    };
    
    mockLeaderboard.push(newEntry);
    mockLeaderboard.sort((a, b) => b.score - a.score);
    
    const rank = mockLeaderboard.findIndex(e => e.id === newEntry.id) + 1;
    
    // Update user stats
    if (currentUser) {
      currentUser.gamesPlayed++;
      if (score > currentUser.highScore) {
        currentUser.highScore = score;
      }
      localStorage.setItem('snake_user', JSON.stringify(currentUser));
    }
    
    return { success: true, rank };
  },
};

// Live Games API (for spectating)
export const liveGamesApi = {
  async getLiveGames(): Promise<LiveGame[]> {
    await delay(200);
    // Generate mock live games
    const games: LiveGame[] = [
      {
        id: '1',
        playerId: '2',
        playerName: 'RetroGamer',
        score: 340,
        mode: 'walls',
        startedAt: new Date(Date.now() - 120000),
        snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }],
        food: { x: 15, y: 8 },
        direction: 'RIGHT',
      },
      {
        id: '2',
        playerId: '3',
        playerName: 'PixelKing',
        score: 560,
        mode: 'pass-through',
        startedAt: new Date(Date.now() - 300000),
        snake: [{ x: 5, y: 15 }, { x: 5, y: 14 }, { x: 5, y: 13 }, { x: 5, y: 12 }],
        food: { x: 12, y: 5 },
        direction: 'DOWN',
      },
      {
        id: '3',
        playerId: '5',
        playerName: 'NeonNinja',
        score: 180,
        mode: 'walls',
        startedAt: new Date(Date.now() - 60000),
        snake: [{ x: 8, y: 8 }, { x: 8, y: 7 }],
        food: { x: 3, y: 12 },
        direction: 'DOWN',
      },
    ];
    return games;
  },

  async getGameById(id: string): Promise<LiveGame | null> {
    await delay(100);
    const games = await this.getLiveGames();
    return games.find(g => g.id === id) || null;
  },
};

// User Stats API
export const userApi = {
  async getUserStats(userId: string): Promise<{ highScore: number; gamesPlayed: number; rank: number } | null> {
    await delay(200);
    const user = Array.from(users.values()).find(u => u.id === userId);
    if (!user) return null;
    
    const sortedByScore = Array.from(users.values()).sort((a, b) => b.highScore - a.highScore);
    const rank = sortedByScore.findIndex(u => u.id === userId) + 1;
    
    return {
      highScore: user.highScore,
      gamesPlayed: user.gamesPlayed,
      rank,
    };
  },
};
