import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../../../core/models/product.model';
import { selectNewArrivals } from '../../../store/products/products.selectors';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-new-arrivals',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './new-arrivals.component.html',
})
export class NewArrivalsComponent implements OnInit {
  products$!: Observable<Product[]>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.products$ = this.store.select(selectNewArrivals);
  }
}
