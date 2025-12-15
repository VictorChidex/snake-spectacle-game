import React from 'react';
import { GameState } from '@/game/gameTypes';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  gameState: GameState;
  cellSize?: number;
}

export function GameBoard({ gameState, cellSize = 20 }: GameBoardProps) {
  const { snake, food, gridSize } = gameState;
  const boardSize = gridSize * cellSize;

  return (
    <div 
      className="relative game-grid border-2 border-primary rounded-lg neon-border overflow-hidden"
      style={{ width: boardSize, height: boardSize }}
    >
      {/* Scanline overlay */}
      <div className="absolute inset-0 scanline z-10" />
      
      {/* Food */}
      <div
        className="absolute rounded-full bg-destructive animate-pulse"
        style={{
          left: food.x * cellSize + 2,
          top: food.y * cellSize + 2,
          width: cellSize - 4,
          height: cellSize - 4,
          boxShadow: '0 0 10px hsl(0 85% 55% / 0.8), 0 0 20px hsl(0 85% 55% / 0.5)',
        }}
      />

      {/* Snake */}
      {snake.map((segment, index) => (
        <div
          key={index}
          className={cn(
            "absolute rounded-sm",
            index === 0 ? "bg-primary" : "bg-primary/80"
          )}
          style={{
            left: segment.x * cellSize + 1,
            top: segment.y * cellSize + 1,
            width: cellSize - 2,
            height: cellSize - 2,
            boxShadow: index === 0 
              ? '0 0 10px hsl(150 100% 50% / 0.8), 0 0 20px hsl(150 100% 50% / 0.5)' 
              : '0 0 5px hsl(150 100% 50% / 0.3)',
          }}
        >
          {/* Eyes for head */}
          {index === 0 && (
            <>
              <div 
                className="absolute w-1.5 h-1.5 bg-background rounded-full"
                style={{ top: '25%', left: '20%' }}
              />
              <div 
                className="absolute w-1.5 h-1.5 bg-background rounded-full"
                style={{ top: '25%', right: '20%' }}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
}
