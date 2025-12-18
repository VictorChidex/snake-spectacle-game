import { useState, useEffect, useCallback } from 'react';
import { authApi, User } from '@/api/mockApi';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi.getCurrentUser().then(u => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    const result = await authApi.login(email, password);
    if (result.user) {
      setUser(result.user);
    }
    setLoading(false);
    return result;
  }, []);

  const signup = useCallback(async (username: string, email: string, password: string) => {
    setLoading(true);
    const result = await authApi.signup(username, email, password);
    if (result.user) {
      setUser(result.user);
    }
    setLoading(false);
    return result;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  return { user, loading, login, signup, logout };
}
