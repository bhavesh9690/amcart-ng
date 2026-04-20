import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { Product } from '../../core/models/product.model';
import * as ProductActions from '../../store/products/products.actions';
import { selectSearchProducts, selectSearchQuery, selectIsSearching } from '../../store/products/products.selectors';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, SearchBarComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit, OnDestroy {
  results$!: Observable<Product[]>;
  query$!: Observable<string>;
  searching$!: Observable<boolean>;
  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit(): void {
    this.results$  = this.store.select(selectSearchProducts);
    this.query$    = this.store.select(selectSearchQuery);
    this.searching$ = this.store.select(selectIsSearching);

    this.route.queryParamMap.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged((a, b) => a.get('q') === b.get('q'))
    ).subscribe(params => {
      const q = params.get('q') ?? '';
      if (q.trim()) {
        this.store.dispatch(ProductActions.searchProducts({ query: q }));
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
