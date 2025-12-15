import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  generateFood,
  getNextHeadPosition,
  wrapPosition,
  isOutOfBounds,
  checkSelfCollision,
  isOppositeDirection,
  moveSnake,
  setDirection,
  startGame,
  pauseGame,
  resetGame,
} from './gameLogic';
import { DEFAULT_CONFIG } from './gameTypes';

describe('gameLogic', () => {
  describe('createInitialState', () => {
    it('should create a valid initial state for walls mode', () => {
      const state = createInitialState('walls');
      expect(state.mode).toBe('walls');
      expect(state.status).toBe('idle');
      expect(state.snake.length).toBe(3);
      expect(state.score).toBe(0);
      expect(state.direction).toBe('RIGHT');
    });

    it('should create a valid initial state for pass-through mode', () => {
      const state = createInitialState('pass-through');
      expect(state.mode).toBe('pass-through');
      expect(state.status).toBe('idle');
    });

    it('should position snake in the center of the grid', () => {
      const state = createInitialState('walls');
      const center = Math.floor(DEFAULT_CONFIG.gridSize / 2);
      expect(state.snake[0].x).toBe(center);
      expect(state.snake[0].y).toBe(center);
    });
  });

  describe('generateFood', () => {
    it('should generate food position not occupied by snake', () => {
      const snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
      const food = generateFood(snake, 20);
      const isOnSnake = snake.some(s => s.x === food.x && s.y === food.y);
      expect(isOnSnake).toBe(false);
    });

    it('should generate food within grid bounds', () => {
      const snake = [{ x: 5, y: 5 }];
      const food = generateFood(snake, 20);
      expect(food.x).toBeGreaterThanOrEqual(0);
      expect(food.x).toBeLessThan(20);
      expect(food.y).toBeGreaterThanOrEqual(0);
      expect(food.y).toBeLessThan(20);
    });
  });

  describe('getNextHeadPosition', () => {
    const head = { x: 10, y: 10 };

    it('should move up correctly', () => {
      expect(getNextHeadPosition(head, 'UP')).toEqual({ x: 10, y: 9 });
    });

    it('should move down correctly', () => {
      expect(getNextHeadPosition(head, 'DOWN')).toEqual({ x: 10, y: 11 });
    });

    it('should move left correctly', () => {
      expect(getNextHeadPosition(head, 'LEFT')).toEqual({ x: 9, y: 10 });
    });

    it('should move right correctly', () => {
      expect(getNextHeadPosition(head, 'RIGHT')).toEqual({ x: 11, y: 10 });
    });
  });

  describe('wrapPosition', () => {
    it('should wrap position when going past right edge', () => {
      expect(wrapPosition({ x: 20, y: 10 }, 20)).toEqual({ x: 0, y: 10 });
    });

    it('should wrap position when going past left edge', () => {
      expect(wrapPosition({ x: -1, y: 10 }, 20)).toEqual({ x: 19, y: 10 });
    });

    it('should wrap position when going past bottom edge', () => {
      expect(wrapPosition({ x: 10, y: 20 }, 20)).toEqual({ x: 10, y: 0 });
    });

    it('should wrap position when going past top edge', () => {
      expect(wrapPosition({ x: 10, y: -1 }, 20)).toEqual({ x: 10, y: 19 });
    });

    it('should not change position within bounds', () => {
      expect(wrapPosition({ x: 10, y: 10 }, 20)).toEqual({ x: 10, y: 10 });
    });
  });

  describe('isOutOfBounds', () => {
    it('should return true for negative x', () => {
      expect(isOutOfBounds({ x: -1, y: 10 }, 20)).toBe(true);
    });

    it('should return true for x >= gridSize', () => {
      expect(isOutOfBounds({ x: 20, y: 10 }, 20)).toBe(true);
    });

    it('should return true for negative y', () => {
      expect(isOutOfBounds({ x: 10, y: -1 }, 20)).toBe(true);
    });

    it('should return true for y >= gridSize', () => {
      expect(isOutOfBounds({ x: 10, y: 20 }, 20)).toBe(true);
    });

    it('should return false for valid position', () => {
      expect(isOutOfBounds({ x: 10, y: 10 }, 20)).toBe(false);
    });
  });

  describe('checkSelfCollision', () => {
    it('should return true when head collides with body', () => {
      const head = { x: 5, y: 5 };
      const body = [{ x: 4, y: 5 }, { x: 5, y: 5 }, { x: 6, y: 5 }];
      expect(checkSelfCollision(head, body)).toBe(true);
    });

    it('should return false when no collision', () => {
      const head = { x: 10, y: 10 };
      const body = [{ x: 4, y: 5 }, { x: 3, y: 5 }, { x: 2, y: 5 }];
      expect(checkSelfCollision(head, body)).toBe(false);
    });
  });

  describe('isOppositeDirection', () => {
    it('should return true for UP and DOWN', () => {
      expect(isOppositeDirection('UP', 'DOWN')).toBe(true);
      expect(isOppositeDirection('DOWN', 'UP')).toBe(true);
    });

    it('should return true for LEFT and RIGHT', () => {
      expect(isOppositeDirection('LEFT', 'RIGHT')).toBe(true);
      expect(isOppositeDirection('RIGHT', 'LEFT')).toBe(true);
    });

    it('should return false for non-opposite directions', () => {
      expect(isOppositeDirection('UP', 'LEFT')).toBe(false);
      expect(isOppositeDirection('UP', 'RIGHT')).toBe(false);
      expect(isOppositeDirection('DOWN', 'LEFT')).toBe(false);
    });
  });

  describe('moveSnake', () => {
    it('should not move if game is not playing', () => {
      const state = createInitialState('walls');
      const newState = moveSnake(state);
      expect(newState).toEqual(state);
    });

    it('should move snake forward when playing', () => {
      let state = createInitialState('walls');
      state = startGame(state);
      const originalHead = { ...state.snake[0] };
      const newState = moveSnake(state);
      expect(newState.snake[0].x).toBe(originalHead.x + 1);
    });

    it('should end game when hitting wall in walls mode', () => {
      let state = createInitialState('walls');
      state = {
        ...state,
        snake: [{ x: 19, y: 10 }, { x: 18, y: 10 }, { x: 17, y: 10 }],
        status: 'playing',
        direction: 'RIGHT',
        nextDirection: 'RIGHT',
      };
      const newState = moveSnake(state);
      expect(newState.status).toBe('gameOver');
    });

    it('should wrap around in pass-through mode', () => {
      let state = createInitialState('pass-through');
      state = {
        ...state,
        snake: [{ x: 19, y: 10 }, { x: 18, y: 10 }, { x: 17, y: 10 }],
        status: 'playing',
        direction: 'RIGHT',
        nextDirection: 'RIGHT',
      };
      const newState = moveSnake(state);
      expect(newState.status).toBe('playing');
      expect(newState.snake[0].x).toBe(0);
    });

    it('should end game on self collision', () => {
      let state = createInitialState('walls');
      state = {
        ...state,
        snake: [
          { x: 5, y: 5 },
          { x: 6, y: 5 },
          { x: 6, y: 6 },
          { x: 5, y: 6 },
          { x: 4, y: 6 },
          { x: 4, y: 5 },
        ],
        status: 'playing',
        direction: 'LEFT',
        nextDirection: 'LEFT',
      };
      const newState = moveSnake(state);
      expect(newState.status).toBe('gameOver');
    });

    it('should grow snake and increase score when eating food', () => {
      let state = createInitialState('walls');
      state = {
        ...state,
        snake: [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }],
        food: { x: 6, y: 5 },
        status: 'playing',
        direction: 'RIGHT',
        nextDirection: 'RIGHT',
        score: 0,
      };
      const newState = moveSnake(state);
      expect(newState.snake.length).toBe(4);
      expect(newState.score).toBe(DEFAULT_CONFIG.pointsPerFood);
    });
  });

  describe('setDirection', () => {
    it('should change direction when valid', () => {
      let state = createInitialState('walls');
      state = startGame(state);
      const newState = setDirection(state, 'UP');
      expect(newState.nextDirection).toBe('UP');
    });

    it('should not change to opposite direction', () => {
      let state = createInitialState('walls');
      state = startGame(state);
      const newState = setDirection(state, 'LEFT');
      expect(newState.nextDirection).toBe('RIGHT');
    });

    it('should not change direction when not playing', () => {
      const state = createInitialState('walls');
      const newState = setDirection(state, 'UP');
      expect(newState.nextDirection).toBe('RIGHT');
    });
  });

  describe('startGame', () => {
    it('should set status to playing', () => {
      const state = createInitialState('walls');
      const newState = startGame(state);
      expect(newState.status).toBe('playing');
    });
  });

  describe('pauseGame', () => {
    it('should pause when playing', () => {
      let state = createInitialState('walls');
      state = startGame(state);
      const newState = pauseGame(state);
      expect(newState.status).toBe('paused');
    });

    it('should resume when paused', () => {
      let state = createInitialState('walls');
      state = { ...startGame(state), status: 'paused' };
      const newState = pauseGame(state);
      expect(newState.status).toBe('playing');
    });
  });

  describe('resetGame', () => {
    it('should create a fresh game state', () => {
      const state = resetGame('walls');
      expect(state.status).toBe('idle');
      expect(state.score).toBe(0);
      expect(state.snake.length).toBe(3);
    });
  });
});
