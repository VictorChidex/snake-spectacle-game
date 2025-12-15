import React, { useState, useEffect } from 'react';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { Button } from '@/components/ui/button';
import { leaderboardApi, LeaderboardEntry, GameMode } from '@/api/mockApi';
import { Trophy, Shield, Zap } from 'lucide-react';

const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<GameMode | 'all'>('all');

  useEffect(() => {
    setLoading(true);
    const mode = filter === 'all' ? undefined : filter;
    leaderboardApi.getLeaderboard(mode).then(data => {
      setEntries(data);
      setLoading(false);
    });
  }, [filter]);

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-accent/20 border border-accent mb-4 gold-glow">
            <Trophy className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-pixel text-primary neon-text">LEADERBOARD</h1>
          <p className="text-muted-foreground mt-2">Top snake masters of all time</p>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All Modes
          </Button>
          <Button
            variant={filter === 'walls' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('walls')}
          >
            <Shield className="w-4 h-4 mr-1" />
            Walls
          </Button>
          <Button
            variant={filter === 'pass-through' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('pass-through')}
          >
            <Zap className="w-4 h-4 mr-1" />
            Portal
          </Button>
        </div>

        {/* Table */}
        <LeaderboardTable entries={entries} loading={loading} />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="p-4 bg-card rounded-lg border border-border text-center">
            <p className="text-2xl font-pixel text-primary">{entries.length}</p>
            <p className="text-xs text-muted-foreground uppercase">Total Scores</p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border text-center">
            <p className="text-2xl font-pixel text-accent">
              {entries[0]?.score.toLocaleString() || 0}
            </p>
            <p className="text-xs text-muted-foreground uppercase">High Score</p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border text-center">
            <p className="text-2xl font-pixel text-secondary">
              {new Set(entries.map(e => e.username)).size}
            </p>
            <p className="text-xs text-muted-foreground uppercase">Players</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
