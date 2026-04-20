import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CartItem } from '../../store/cart/cart.reducer';
import { selectCartItems, selectCartSubtotal } from '../../store/cart/cart.selectors';
import * as CartActions from '../../store/cart/cart.actions';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartItems$!: Observable<CartItem[]>;
  cartSubtotal$!: Observable<number>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.cartItems$   = this.store.select(selectCartItems);
    this.cartSubtotal$ = this.store.select(selectCartSubtotal);
  }

  increment(item: CartItem): void {
    this.store.dispatch(CartActions.updateQuantity({
      productId: item.product.id,
      quantity: item.quantity + 1
    }));
  }

  decrement(item: CartItem): void {
    this.store.dispatch(CartActions.updateQuantity({
      productId: item.product.id,
      quantity: item.quantity - 1
    }));
  }

  onQtyChange(event: Event, productId: string): void {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(val) && val > 0) {
      this.store.dispatch(CartActions.updateQuantity({ productId, quantity: val }));
    }
  }

  remove(productId: string): void {
    this.store.dispatch(CartActions.removeFromCart({ productId }));
  }

  clearCart(): void {
    this.store.dispatch(CartActions.clearCart());
  }

  onImgError(e: Event): void {
    (e.target as HTMLImageElement).src = '';
  }
}
