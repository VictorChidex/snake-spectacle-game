import { Direction, GameMode, GameState, GameConfig, Position, DEFAULT_CONFIG } from './gameTypes';

export function createInitialState(mode: GameMode, config: GameConfig = DEFAULT_CONFIG): GameState {
  const center = Math.floor(config.gridSize / 2);
  return {
    snake: [
      { x: center, y: center },
      { x: center - 1, y: center },
      { x: center - 2, y: center },
    ],
    food: generateFood([{ x: center, y: center }, { x: center - 1, y: center }, { x: center - 2, y: center }], config.gridSize),
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    score: 0,
    status: 'idle',
    mode,
    speed: config.initialSpeed,
    gridSize: config.gridSize,
  };
}

export function generateFood(snake: Position[], gridSize: number): Position {
  const occupied = new Set(snake.map(p => `${p.x},${p.y}`));
  const available: Position[] = [];
  
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (!occupied.has(`${x},${y}`)) {
        available.push({ x, y });
      }
    }
  }
  
  if (available.length === 0) {
    return { x: 0, y: 0 }; // No space left - game essentially won
  }
  
  return available[Math.floor(Math.random() * available.length)];
}

export function getNextHeadPosition(head: Position, direction: Direction): Position {
  switch (direction) {
    case 'UP':
      return { x: head.x, y: head.y - 1 };
    case 'DOWN':
      return { x: head.x, y: head.y + 1 };
    case 'LEFT':
      return { x: head.x - 1, y: head.y };
    case 'RIGHT':
      return { x: head.x + 1, y: head.y };
  }
}

export function wrapPosition(position: Position, gridSize: number): Position {
  return {
    x: ((position.x % gridSize) + gridSize) % gridSize,
    y: ((position.y % gridSize) + gridSize) % gridSize,
  };
}

export function isOutOfBounds(position: Position, gridSize: number): boolean {
  return position.x < 0 || position.x >= gridSize || position.y < 0 || position.y >= gridSize;
}

export function checkSelfCollision(head: Position, body: Position[]): boolean {
  return body.some(segment => segment.x === head.x && segment.y === head.y);
}

export function isOppositeDirection(current: Direction, next: Direction): boolean {
  const opposites: Record<Direction, Direction> = {
    UP: 'DOWN',
    DOWN: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT',
  };
  return opposites[current] === next;
}

export function moveSnake(state: GameState, config: GameConfig = DEFAULT_CONFIG): GameState {
  if (state.status !== 'playing') {
    return state;
  }

  const direction = state.nextDirection;
  const head = state.snake[0];
  let newHead = getNextHeadPosition(head, direction);
  
  // Handle wall collision based on mode
  if (state.mode === 'walls') {
    if (isOutOfBounds(newHead, state.gridSize)) {
      return { ...state, status: 'gameOver' };
    }
  } else {
    // Pass-through mode - wrap around
    newHead = wrapPosition(newHead, state.gridSize);
  }
  
  // Check self collision (excluding tail that will be removed unless eating)
  const bodyToCheck = state.snake.slice(0, -1);
  if (checkSelfCollision(newHead, bodyToCheck)) {
    return { ...state, status: 'gameOver' };
  }
  
  // Check if eating food
  const eating = newHead.x === state.food.x && newHead.y === state.food.y;
  
  let newSnake: Position[];
  if (eating) {
    newSnake = [newHead, ...state.snake];
  } else {
    newSnake = [newHead, ...state.snake.slice(0, -1)];
  }
  
  const newScore = eating ? state.score + config.pointsPerFood : state.score;
  const newSpeed = eating ? Math.max(50, state.speed - config.speedIncrement) : state.speed;
  const newFood = eating ? generateFood(newSnake, state.gridSize) : state.food;
  
  return {
    ...state,
    snake: newSnake,
    food: newFood,
    direction,
    score: newScore,
    speed: newSpeed,
  };
}

export function setDirection(state: GameState, newDirection: Direction): GameState {
  if (state.status !== 'playing') {
    return state;
  }
  
  if (isOppositeDirection(state.direction, newDirection)) {
    return state;
  }
  
  return { ...state, nextDirection: newDirection };
}

export function startGame(state: GameState): GameState {
  return { ...state, status: 'playing' };
}

export function pauseGame(state: GameState): GameState {
  if (state.status === 'playing') {
    return { ...state, status: 'paused' };
  }
  if (state.status === 'paused') {
    return { ...state, status: 'playing' };
  }
  return state;
}

export function resetGame(mode: GameMode, config: GameConfig = DEFAULT_CONFIG): GameState {
  return createInitialState(mode, config);
}
