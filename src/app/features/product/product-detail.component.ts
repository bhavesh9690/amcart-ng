import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Product } from '../../core/models/product.model';
import { Store } from '@ngrx/store';
import * as CartActions from '../../store/cart/cart.actions';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent {
  product$!: Observable<Product | undefined>;
  stars = [1, 2, 3, 4, 5];

  constructor(private route: ActivatedRoute, private productService: ProductService, private store: Store, private snackbar: SnackbarService) {
    this.product$ = this.route.paramMap.pipe(
      map(pm => pm.get('id') || ''),
      switchMap(id => this.productService.getProductById(id))
    );
  }

  addToCart(product: Product | undefined) {
    if (product) {
      this.store.dispatch(CartActions.addToCart({ product }));
      this.snackbar.show('Added to cart', { type: 'success' });
    }
  }
}
