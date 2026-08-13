import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { SnackbarService } from '../../services/snackbar.service';
import { Product } from '../../../core/models/product.model';
import * as CartActions from '../../../store/cart/cart.actions';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: Product;
  stars = [1, 2, 3, 4, 5];

  constructor(private store: Store, private snackbar: SnackbarService) {}

  addToCart(): void {
    this.store.dispatch(CartActions.addToCart({ product: this.product }));
    this.snackbar.show('Added to cart', { type: 'success' });
  }

  addToWishlist(): void {
    this.snackbar.show('Added to wishlist', { type: 'info' });
  }

  onImgError(e: Event): void {
    (e.target as HTMLImageElement).src = '';
  }
}
