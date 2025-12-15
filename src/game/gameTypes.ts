export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type GameMode = 'walls' | 'pass-through';
export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameOver';

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  status: GameStatus;
  mode: GameMode;
  speed: number;
  gridSize: number;
}

export interface GameConfig {
  gridSize: number;
  initialSpeed: number;
  speedIncrement: number;
  pointsPerFood: number;
}

export const DEFAULT_CONFIG: GameConfig = {
  gridSize: 20,
  initialSpeed: 150,
  speedIncrement: 5,
  pointsPerFood: 10,
};
