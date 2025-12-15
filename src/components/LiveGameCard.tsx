import React from 'react';
import { LiveGame } from '@/api/mockApi';
import { Button } from '@/components/ui/button';
import { Eye, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveGameCardProps {
  game: LiveGame;
  onWatch: (gameId: string) => void;
}

export function LiveGameCard({ game, onWatch }: LiveGameCardProps) {
  const duration = Math.floor((Date.now() - game.startedAt.getTime()) / 1000);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return (
    <div className="border border-border rounded-lg p-4 bg-card hover:border-primary/50 transition-colors neon-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
            <span className="text-sm">🎮</span>
          </div>
          <div>
            <p className="font-medium text-foreground">{game.playerName}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-primary">LIVE</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase">Score</p>
          <p className="text-2xl font-pixel text-primary">{game.score}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground uppercase">Mode</p>
          <span className={cn(
            "text-xs px-2 py-1 rounded-full",
            game.mode === 'walls' 
              ? "bg-destructive/20 text-destructive" 
              : "bg-secondary/20 text-secondary"
          )}>
            {game.mode === 'walls' ? 'Walls' : 'Portal'}
          </span>
        </div>
      </div>

      <Button 
        variant="outline" 
        size="sm" 
        className="w-full mt-4"
        onClick={() => onWatch(game.id)}
      >
        <Eye className="w-4 h-4 mr-2" />
        Watch Game
      </Button>
    </div>
  );
}
