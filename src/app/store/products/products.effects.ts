import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import * as ProductActions from './products.actions';
import { ProductService } from '../../core/services/product.service';

@Injectable()
export class ProductsEffects {
  private actions$ = inject(Actions);
  private productService = inject(ProductService);

  loadFeatured$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadFeaturedProducts),
      switchMap(() =>
        this.productService.getFeaturedProducts().pipe(
          map(products => ProductActions.loadFeaturedProductsSuccess({ products })),
          catchError(err => of(ProductActions.loadFeaturedProductsFailure({ error: err.message ?? 'Failed to load' })))
        )
      )
    )
  );

  loadNewArrivals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadNewArrivals),
      switchMap(() =>
        this.productService.getNewArrivals().pipe(
          map(products => ProductActions.loadNewArrivalsSuccess({ products }))
        )
      )
    )
  );

  search$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.searchProducts),
      switchMap(({ query }) =>
        this.productService.searchProducts(query).pipe(
          map(result => ProductActions.searchProductsSuccess({ result })),
          catchError(err => of(ProductActions.searchProductsFailure({ error: err.message ?? 'Search failed' })))
        )
      )
    )
  );
}
