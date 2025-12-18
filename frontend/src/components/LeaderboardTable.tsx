import React from 'react';
import { LeaderboardEntry } from '@/api/mockApi';
import { Trophy, Medal, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  loading?: boolean;
}

export function LeaderboardTable({ entries, loading }: LeaderboardTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-accent" />;
      case 1:
        return <Medal className="w-5 h-5 text-muted-foreground" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 text-center text-muted-foreground">{index + 1}</span>;
    }
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden neon-border">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50 border-b border-border">
            <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground w-16">
              Rank
            </th>
            <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground">
              Player
            </th>
            <th className="px-4 py-3 text-right text-xs uppercase tracking-wider text-muted-foreground">
              Score
            </th>
            <th className="px-4 py-3 text-center text-xs uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
              Mode
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr 
              key={entry.id}
              className={cn(
                "border-b border-border/50 transition-colors hover:bg-muted/30",
                index < 3 && "bg-muted/20"
              )}
            >
              <td className="px-4 py-3">
                <div className="flex items-center justify-center">
                  {getRankIcon(index)}
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={cn(
                  "font-medium",
                  index === 0 && "text-accent neon-text"
                )}>
                  {entry.username}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <span className={cn(
                  "font-pixel text-sm",
                  index === 0 ? "text-accent" : "text-primary"
                )}>
                  {entry.score.toLocaleString()}
                </span>
              </td>
              <td className="px-4 py-3 text-center hidden sm:table-cell">
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  entry.mode === 'walls' 
                    ? "bg-destructive/20 text-destructive" 
                    : "bg-secondary/20 text-secondary"
                )}>
                  {entry.mode === 'walls' ? 'Walls' : 'Portal'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
