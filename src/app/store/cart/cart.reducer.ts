import { createReducer, on, ActionReducer } from '@ngrx/store';
import { Product } from '../../core/models/product.model';
import * as CartActions from './cart.actions';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

const CART_STORAGE_KEY = 'amcart_cart';

function loadFromStorage(): CartState {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as CartState;
  } catch { /* ignore parse errors */ }
  return { items: [] };
}

function saveToStorage(state: CartState): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore quota errors */ }
}

const initialState: CartState = loadFromStorage();

const _cartReducer = createReducer(
  initialState,

  on(CartActions.addToCart, (state, { product }) => {
    const existing = state.items.find(i => i.product.id === product.id);
    const items = existing
      ? state.items.map(i => i.product.id === product.id
          ? { ...i, quantity: i.quantity + 1 }
          : i)
      : [...state.items, { product, quantity: 1 }];
    return { ...state, items };
  }),

  on(CartActions.removeFromCart, (state, { productId }) => ({
    ...state,
    items: state.items.filter(i => i.product.id !== productId),
  })),

  on(CartActions.updateQuantity, (state, { productId, quantity }) => {
    if (quantity <= 0) {
      return { ...state, items: state.items.filter(i => i.product.id !== productId) };
    }
    return {
      ...state,
      items: state.items.map(i => i.product.id === productId ? { ...i, quantity } : i),
    };
  }),

  on(CartActions.clearCart, state => ({ ...state, items: [] })),
);

/** Wrap reducer with localStorage persistence. */
export function cartReducer(state: CartState | undefined, action: any): CartState {
  const next = _cartReducer(state, action);
  saveToStorage(next);
  return next;
}
