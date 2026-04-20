import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../../core/models/product.model';
import * as ProductActions from '../../store/products/products.actions';
import { selectFeaturedProducts, selectNewArrivals, selectProductsLoading } from '../../store/products/products.selectors';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { HeroBannerComponent } from './hero-banner/hero-banner.component';
import { FeaturedProductsComponent } from './featured-products/featured-products.component';
import { NewArrivalsComponent } from './new-arrivals/new-arrivals.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, HeroBannerComponent, FeaturedProductsComponent, NewArrivalsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(ProductActions.loadFeaturedProducts());
    this.store.dispatch(ProductActions.loadNewArrivals());
  }
}
