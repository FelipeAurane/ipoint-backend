import React, { createContext, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types';

const STORAGE_KEY = '@oxe:wishlist';

interface WishlistState {
  items: Product[];
}

type WishlistAction =
  | { type: 'TOGGLE'; product: Product }
  | { type: 'REMOVE'; productId: string }
  | { type: 'HYDRATE'; items: Product[] };

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'TOGGLE': {
      const exists = state.items.some((p) => p.id === action.product.id);
      return {
        items: exists
          ? state.items.filter((p) => p.id !== action.product.id)
          : [...state.items, action.product],
      };
    }
    case 'REMOVE':
      return { items: state.items.filter((p) => p.id !== action.productId) };
    case 'HYDRATE':
      return { items: action.items };
    default:
      return state;
  }
}

interface WishlistContextType {
  items: Product[];
  count: number;
  isWishlisted: (productId: string) => boolean;
  toggle: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) dispatch({ type: 'HYDRATE', items: JSON.parse(raw) });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.items)).catch(() => {});
  }, [state.items]);

  return (
    <WishlistContext.Provider
      value={{
        items: state.items,
        count: state.items.length,
        isWishlisted: (productId) => state.items.some((p) => p.id === productId),
        toggle: (product) => dispatch({ type: 'TOGGLE', product }),
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextType {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
}
