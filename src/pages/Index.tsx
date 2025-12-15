import React, { useState, useCallback, useEffect } from 'react';
import { GameBoard } from '@/components/GameBoard';
import { GameControls } from '@/components/GameControls';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useAuthContext } from '@/contexts/AuthContext';
import { GameState, GameMode, Direction } from '@/game/gameTypes';
import { createInitialState, moveSnake, setDirection, startGame, pauseGame, resetGame } from '@/game/gameLogic';
import { leaderboardApi } from '@/api/mockApi';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>(() => createInitialState('walls'));

  const handleMove = useCallback(() => {
    setGameState(prev => moveSnake(prev));
  }, []);

  useGameLoop(handleMove, gameState.speed, gameState.status === 'playing');

  // Check for game over and submit score
  useEffect(() => {
    if (gameState.status === 'gameOver' && gameState.score > 0) {
      if (user) {
        leaderboardApi.submitScore(gameState.score, gameState.mode).then(result => {
          if (result.success) {
            toast({
              title: "Score Submitted!",
              description: `You ranked #${result.rank} on the leaderboard!`,
            });
          }
        });
      } else {
        toast({
          title: "Game Over!",
          description: "Login to save your score to the leaderboard.",
        });
      }
    }
  }, [gameState.status, gameState.score, gameState.mode, user, toast]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMap: Record<string, Direction> = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
        w: 'UP',
        W: 'UP',
        s: 'DOWN',
        S: 'DOWN',
        a: 'LEFT',
        A: 'LEFT',
        d: 'RIGHT',
        D: 'RIGHT',
      };

      if (e.key === ' ') {
        e.preventDefault();
        if (gameState.status === 'playing' || gameState.status === 'paused') {
          setGameState(prev => pauseGame(prev));
        }
        return;
      }

      const direction = keyMap[e.key];
      if (direction) {
        e.preventDefault();
        setGameState(prev => setDirection(prev, direction));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.status]);

  const handleStart = () => setGameState(prev => startGame(prev));
  const handlePause = () => setGameState(prev => pauseGame(prev));
  const handleReset = () => setGameState(resetGame(gameState.mode));
  const handleModeChange = (mode: GameMode) => setGameState(resetGame(mode));

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
        {/* Game Board */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-pixel text-primary neon-text-intense">
            SNAKE
          </h1>
          <GameBoard gameState={gameState} cellSize={18} />
        </div>

        {/* Controls */}
        <div className="w-64 p-6 bg-card rounded-xl border border-border neon-border">
          <GameControls
            status={gameState.status}
            mode={gameState.mode}
            score={gameState.score}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
            onModeChange={handleModeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
