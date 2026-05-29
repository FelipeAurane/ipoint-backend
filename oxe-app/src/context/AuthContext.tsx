import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Order } from '../types';
import { mockOrders } from '../data/mockData';

const USER_KEY = '@oxe:user';
const ORDERS_KEY = '@oxe:orders';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  orders: Order[];
  login: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  addOrder: (order: Order) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(USER_KEY),
      AsyncStorage.getItem(ORDERS_KEY),
    ])
      .then(([rawUser, rawOrders]) => {
        if (rawUser) setUser(JSON.parse(rawUser));
        if (rawOrders) setOrders(JSON.parse(rawOrders));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  async function login(email: string, _password: string, displayName?: string): Promise<void> {
    if (!email.includes('@')) throw new Error('E-mail inválido');
    const newUser: User = {
      id: 'u1',
      name: displayName ?? email.split('@')[0],
      email,
      phone: '',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName ?? email)}&background=FF6B00&color=fff`,
    };
    setUser(newUser);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));
  }

  async function register(name: string, email: string, _password: string): Promise<void> {
    if (!name.trim()) throw new Error('Nome é obrigatório');
    if (!email.includes('@')) throw new Error('E-mail inválido');
    await login(email, _password, name);
  }

  async function logout(): Promise<void> {
    setUser(null);
    await AsyncStorage.multiRemove([USER_KEY]);
  }

  function addOrder(order: Order): void {
    const updated = [order, ...orders];
    setOrders(updated);
    AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(updated)).catch(() => {});
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        orders,
        login,
        logout,
        register,
        addOrder,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
