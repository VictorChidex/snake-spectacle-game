import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Gamepad2, Mail, Lock, User } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { user, error } = await login(email, password);
        if (error) {
          toast({ title: "Login Failed", description: error, variant: "destructive" });
        } else if (user) {
          toast({ title: "Welcome back!", description: `Good to see you, ${user.username}!` });
          navigate('/');
        }
      } else {
        if (username.length < 3) {
          toast({ title: "Invalid Username", description: "Username must be at least 3 characters", variant: "destructive" });
          setLoading(false);
          return;
        }
        const { user, error } = await signup(username, email, password);
        if (error) {
          toast({ title: "Signup Failed", description: error, variant: "destructive" });
        } else if (user) {
          toast({ title: "Account Created!", description: `Welcome to the game, ${user.username}!` });
          navigate('/');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/20 border border-primary mb-4 neon-border-intense">
            <Gamepad2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-pixel text-primary neon-text">SNAKE</h1>
          <p className="text-muted-foreground mt-2">
            {isLogin ? 'Welcome back, player!' : 'Join the arcade'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-card rounded-xl border border-border neon-border">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="username" className="text-muted-foreground">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="SnakeMaster"
                  className="pl-10 bg-muted border-border"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-muted-foreground">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="player@arcade.com"
                className="pl-10 bg-muted border-border"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-muted-foreground">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 bg-muted border-border"
                required
              />
            </div>
          </div>

          <Button type="submit" variant="neon" size="lg" className="w-full" disabled={loading}>
            {loading ? (
              <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
            ) : (
              isLogin ? 'Login' : 'Create Account'
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
            </button>
          </div>
        </form>

        {/* Demo Credentials */}
        {isLogin && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border text-center">
            <p className="text-xs text-muted-foreground mb-2">Demo credentials:</p>
            <p className="text-xs text-foreground font-mono">snake@example.com / test123</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
