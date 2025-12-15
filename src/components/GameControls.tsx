import React from 'react';
import { Button } from '@/components/ui/button';
import { GameMode, GameStatus } from '@/game/gameTypes';
import { Play, Pause, RotateCcw, Zap, Shield } from 'lucide-react';

interface GameControlsProps {
  status: GameStatus;
  mode: GameMode;
  score: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onModeChange: (mode: GameMode) => void;
}

export function GameControls({
  status,
  mode,
  score,
  onStart,
  onPause,
  onReset,
  onModeChange,
}: GameControlsProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Score Display */}
      <div className="text-center">
        <p className="text-muted-foreground text-sm uppercase tracking-widest mb-2">Score</p>
        <p className="text-5xl font-bold neon-text-intense font-pixel">{score}</p>
      </div>

      {/* Mode Selection */}
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-sm uppercase tracking-widest text-center">Mode</p>
        <div className="flex gap-2">
          <Button
            variant={mode === 'walls' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onModeChange('walls')}
            disabled={status === 'playing'}
            className="flex-1"
          >
            <Shield className="w-4 h-4 mr-1" />
            Walls
          </Button>
          <Button
            variant={mode === 'pass-through' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onModeChange('pass-through')}
            disabled={status === 'playing'}
            className="flex-1"
          >
            <Zap className="w-4 h-4 mr-1" />
            Portal
          </Button>
        </div>
      </div>

      {/* Game Controls */}
      <div className="flex flex-col gap-3">
        {status === 'idle' && (
          <Button variant="neon" size="lg" onClick={onStart} className="w-full">
            <Play className="w-5 h-5 mr-2" />
            Start Game
          </Button>
        )}
        
        {status === 'playing' && (
          <Button variant="secondary" size="lg" onClick={onPause} className="w-full">
            <Pause className="w-5 h-5 mr-2" />
            Pause
          </Button>
        )}
        
        {status === 'paused' && (
          <Button variant="neon" size="lg" onClick={onPause} className="w-full">
            <Play className="w-5 h-5 mr-2" />
            Resume
          </Button>
        )}
        
        {status === 'gameOver' && (
          <div className="space-y-3">
            <p className="text-destructive text-center font-pixel text-lg animate-pulse">
              GAME OVER
            </p>
            <Button variant="neon" size="lg" onClick={onReset} className="w-full">
              <RotateCcw className="w-5 h-5 mr-2" />
              Play Again
            </Button>
          </div>
        )}
        
        {(status === 'playing' || status === 'paused') && (
          <Button variant="ghost" size="sm" onClick={onReset} className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart
          </Button>
        )}
      </div>

      {/* Instructions */}
      <div className="text-center text-muted-foreground text-xs space-y-1 mt-4">
        <p>Use Arrow Keys or WASD to move</p>
        <p>Press Space to pause</p>
      </div>
    </div>
  );
}
