import { createReducer, on } from '@ngrx/store';
import { Product, SearchResult } from '../../core/models/product.model';
import * as ProductActions from './products.actions';

export interface ProductsState {
  featured: Product[];
  newArrivals: Product[];
  searchResult: SearchResult | null;
  searchQuery: string;
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  featured: [],
  newArrivals: [],
  searchResult: null,
  searchQuery: '',
  isLoading: false,
  isSearching: false,
  error: null,
};

export const productsReducer = createReducer(
  initialState,
  on(ProductActions.loadFeaturedProducts, state => ({ ...state, isLoading: true })),
  on(ProductActions.loadFeaturedProductsSuccess, (state, { products }) => ({ ...state, featured: products, isLoading: false })),
  on(ProductActions.loadFeaturedProductsFailure, (state, { error }) => ({ ...state, error, isLoading: false })),
  on(ProductActions.loadNewArrivalsSuccess, (state, { products }) => ({ ...state, newArrivals: products })),
  on(ProductActions.searchProducts, (state, { query }) => ({ ...state, isSearching: true, searchQuery: query })),
  on(ProductActions.searchProductsSuccess, (state, { result }) => ({ ...state, searchResult: result, isSearching: false })),
  on(ProductActions.searchProductsFailure, (state, { error }) => ({ ...state, error, isSearching: false })),
  on(ProductActions.clearSearch, state => ({ ...state, searchResult: null, searchQuery: '' })),
);
