import React, { useState, useEffect } from 'react';
import { LiveGameCard } from '@/components/LiveGameCard';
import { SpectatorView } from '@/components/SpectatorView';
import { liveGamesApi, LiveGame } from '@/api/mockApi';
import { Eye, Radio } from 'lucide-react';

const Watch = () => {
  const [games, setGames] = useState<LiveGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<LiveGame | null>(null);

  useEffect(() => {
    liveGamesApi.getLiveGames().then(data => {
      setGames(data);
      setLoading(false);
    });
  }, []);

  const handleWatch = async (gameId: string) => {
    const game = await liveGamesApi.getGameById(gameId);
    if (game) {
      setSelectedGame(game);
    }
  };

  if (selectedGame) {
    return (
      <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <SpectatorView game={selectedGame} onBack={() => setSelectedGame(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-secondary/20 border border-secondary mb-4 purple-glow">
            <Eye className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-3xl font-pixel text-primary neon-text">SPECTATE</h1>
          <p className="text-muted-foreground mt-2">Watch live games in progress</p>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Radio className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm text-muted-foreground">
            {games.length} live {games.length === 1 ? 'game' : 'games'} right now
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        )}

        {/* Games Grid */}
        {!loading && games.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map(game => (
              <LiveGameCard key={game.id} game={game} onWatch={handleWatch} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && games.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No live games at the moment.</p>
            <p className="text-sm text-muted-foreground mt-2">Check back later or start your own game!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watch;
