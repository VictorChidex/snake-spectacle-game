import React, { useState, useEffect, useCallback } from 'react';
import { GameBoard } from './GameBoard';
import { Button } from '@/components/ui/button';
import { LiveGame } from '@/api/mockApi';
import { GameState, Direction } from '@/game/gameTypes';
import { moveSnake, generateFood } from '@/game/gameLogic';
import { ArrowLeft, Users } from 'lucide-react';

interface SpectatorViewProps {
  game: LiveGame;
  onBack: () => void;
}

export function SpectatorView({ game, onBack }: SpectatorViewProps) {
  const [gameState, setGameState] = useState<GameState>(() => ({
    snake: game.snake,
    food: game.food,
    direction: game.direction,
    nextDirection: game.direction,
    score: game.score,
    status: 'playing',
    mode: game.mode,
    speed: 150,
    gridSize: 20,
  }));

  // Simulate AI playing
  const getAIDirection = useCallback((state: GameState): Direction => {
    const head = state.snake[0];
    const food = state.food;
    const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    
    // Simple AI: try to move towards food while avoiding collisions
    const getNextPos = (dir: Direction) => {
      switch (dir) {
        case 'UP': return { x: head.x, y: head.y - 1 };
        case 'DOWN': return { x: head.x, y: head.y + 1 };
        case 'LEFT': return { x: head.x - 1, y: head.y };
        case 'RIGHT': return { x: head.x + 1, y: head.y };
      }
    };

    const isSafe = (pos: { x: number; y: number }) => {
      if (state.mode === 'walls') {
        if (pos.x < 0 || pos.x >= state.gridSize || pos.y < 0 || pos.y >= state.gridSize) {
          return false;
        }
      }
      return !state.snake.some(s => s.x === pos.x && s.y === pos.y);
    };

    const getOpposite = (dir: Direction): Direction => {
      const opposites: Record<Direction, Direction> = {
        UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT'
      };
      return opposites[dir];
    };

    // Filter out opposite direction and unsafe moves
    const validDirs = directions.filter(d => 
      d !== getOpposite(state.direction) && isSafe(getNextPos(d))
    );

    if (validDirs.length === 0) return state.direction;

    // Prefer direction towards food
    const towardsFood = validDirs.filter(d => {
      const next = getNextPos(d);
      const currentDist = Math.abs(head.x - food.x) + Math.abs(head.y - food.y);
      const nextDist = Math.abs(next.x - food.x) + Math.abs(next.y - food.y);
      return nextDist < currentDist;
    });

    if (towardsFood.length > 0) {
      return towardsFood[Math.floor(Math.random() * towardsFood.length)];
    }

    return validDirs[Math.floor(Math.random() * validDirs.length)];
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        if (prev.status !== 'playing') return prev;
        
        const newDirection = getAIDirection(prev);
        const stateWithDirection = { ...prev, nextDirection: newDirection };
        const newState = moveSnake(stateWithDirection);
        
        // Reset if game over (simulate new game)
        if (newState.status === 'gameOver') {
          return {
            ...prev,
            snake: [
              { x: 10, y: 10 },
              { x: 9, y: 10 },
              { x: 8, y: 10 },
            ],
            food: generateFood([{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }], 20),
            direction: 'RIGHT',
            nextDirection: 'RIGHT',
            score: prev.score + 50, // Bonus for watching
            status: 'playing',
          };
        }
        
        return newState;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [getAIDirection]);

  const duration = Math.floor((Date.now() - game.startedAt.getTime()) / 1000);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm text-primary">LIVE</span>
        </div>
      </div>

      {/* Player Info */}
      <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border w-full max-w-md">
        <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
          <span className="text-lg">🎮</span>
        </div>
        <div className="flex-1">
          <p className="font-medium text-foreground">{game.playerName}</p>
          <p className="text-xs text-muted-foreground">
            Playing for {minutes}:{seconds.toString().padStart(2, '0')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground uppercase">Score</p>
          <p className="text-2xl font-pixel text-primary">{gameState.score}</p>
        </div>
      </div>

      {/* Game Board */}
      <GameBoard gameState={gameState} cellSize={18} />

      {/* Spectator Count */}
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Users className="w-4 h-4" />
        <span>{Math.floor(Math.random() * 50) + 10} watching</span>
      </div>
    </div>
  );
}
