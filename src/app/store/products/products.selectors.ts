import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from './products.reducer';

export const selectProductsState = createFeatureSelector<ProductsState>('products');

export const selectFeaturedProducts = createSelector(selectProductsState, s => s.featured);
export const selectNewArrivals = createSelector(selectProductsState, s => s.newArrivals);
export const selectSearchResult = createSelector(selectProductsState, s => s.searchResult);
export const selectSearchProducts = createSelector(selectProductsState, s => s.searchResult?.products ?? []);
export const selectSearchQuery = createSelector(selectProductsState, s => s.searchQuery);
export const selectProductsLoading = createSelector(selectProductsState, s => s.isLoading);
export const selectIsSearching = createSelector(selectProductsState, s => s.isSearching);
