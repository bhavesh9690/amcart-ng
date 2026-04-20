import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Category } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { NavMenuComponent } from '../nav-menu/nav-menu.component';
import { LoginDropdownComponent } from '../login-dropdown/login-dropdown.component';
import { selectIsLoggedIn, selectCurrentUserEmail } from '../../../store/auth/auth.selectors';
import { selectCartCount, selectCartSubtotal } from '../../../store/cart/cart.selectors';
import * as AuthActions from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchBarComponent, NavMenuComponent, LoginDropdownComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;
  userEmail$!: Observable<string | null>;
  categories$!: Observable<Category[]>;
  cartCount$!: Observable<number>;
  cartSubtotal$!: Observable<number>;
  showLogin = false;

  constructor(private store: Store, private productService: ProductService) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
    this.userEmail$ = this.store.select(selectCurrentUserEmail);
    this.categories$ = this.productService.getCategories();
    this.cartCount$ = this.store.select(selectCartCount);
    this.cartSubtotal$ = this.store.select(selectCartSubtotal);
  }

  toggleLogin(): void { this.showLogin = !this.showLogin; }

  logout(): void { this.store.dispatch(AuthActions.logout()); }
}
