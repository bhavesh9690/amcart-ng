import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.reducer';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems  = createSelector(selectCartState, s => s.items);

export const selectCartCount  = createSelector(selectCartItems,
  items => items.reduce((sum, i) => sum + i.quantity, 0));

export const selectCartSubtotal = createSelector(selectCartItems,
  items => items.reduce((sum, i) => {
    const price = i.product.salePrice ?? i.product.price;
    return sum + price * i.quantity;
  }, 0));
