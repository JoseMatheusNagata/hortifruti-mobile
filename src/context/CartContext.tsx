import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { Product } from '../types';
import { precoPara, stepOf } from '../utils';

export interface CartItem { product: Product; quantidade: number }

interface CartValue {
  items: CartItem[];
  total: number;
  count: number;
  quantityOf: (productId: string) => number;
  change: (product: Product, direction: 1 | -1) => void;
  clear: () => void;
}

const CartContext = createContext<CartValue>(null!);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const value = useMemo<CartValue>(() => ({
    items,
    total: items.reduce((sum, i) => sum + precoPara(i.product, i.quantidade).subtotal, 0),
    count: items.length,
    quantityOf: (id) => items.find((i) => i.product.id === id)?.quantidade ?? 0,
    change: (product, direction) =>
      setItems((prev) => {
        const step = stepOf(product);
        const current = prev.find((i) => i.product.id === product.id)?.quantidade ?? 0;
        const next = Math.round((current + direction * step) * 100) / 100;
        if (next <= 0) return prev.filter((i) => i.product.id !== product.id);
        if (current === 0) return [...prev, { product, quantidade: next }];
        return prev.map((i) => (i.product.id === product.id ? { ...i, quantidade: next } : i));
      }),
    clear: () => setItems([]),
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
