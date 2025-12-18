import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext';
import { Gamepad2, Trophy, Eye, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, logout } = useAuthContext();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Play', icon: Gamepad2 },
    { path: '/watch', label: 'Watch', icon: Eye },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary flex items-center justify-center neon-border">
            <span className="text-primary text-xl">🐍</span>
          </div>
          <span className="font-pixel text-primary neon-text text-sm hidden sm:block">
            SNAKE
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-2",
                  location.pathname === path && "bg-muted text-primary"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </Button>
            </Link>
          ))}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-secondary/20 border border-secondary flex items-center justify-center">
                  <User className="w-4 h-4 text-secondary" />
                </div>
                <span className="text-foreground hidden sm:block">{user.username}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
