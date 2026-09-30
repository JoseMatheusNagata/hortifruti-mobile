import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api, setOnUnauthorized, setToken } from '../api';
import { User } from '../types';

interface AuthValue {
  user: User | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthValue>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function logout() {
    setToken(null);
    setUser(null);
    await AsyncStorage.multiRemove(['token', 'user']);
  }

  useEffect(() => {
    setOnUnauthorized(() => { logout(); });
    (async () => {
      try {
        const [t, u] = await AsyncStorage.multiGet(['token', 'user']);
        if (t[1] && u[1]) {
          setToken(t[1]);
          setUser(JSON.parse(u[1]));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function login(email: string, senha: string) {
    const { data } = await api.post<{ token: string; user: User }>('/auth/login', { email, senha });
    setToken(data.token);
    setUser(data.user);
    await AsyncStorage.multiSet([['token', data.token], ['user', JSON.stringify(data.user)]]);
  }

  async function register(nome: string, email: string, senha: string) {
    await api.post('/auth/register', { nome, email, senha });
    await login(email, senha);
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
