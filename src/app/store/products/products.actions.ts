import { createAction, props } from '@ngrx/store';
import { Product, SearchResult } from '../../core/models/product.model';

export const loadFeaturedProducts = createAction('[Products] Load Featured');
export const loadFeaturedProductsSuccess = createAction('[Products] Load Featured Success', props<{ products: Product[] }>());
export const loadFeaturedProductsFailure = createAction('[Products] Load Featured Failure', props<{ error: string }>());

export const loadNewArrivals = createAction('[Products] Load New Arrivals');
export const loadNewArrivalsSuccess = createAction('[Products] Load New Arrivals Success', props<{ products: Product[] }>());

export const searchProducts = createAction('[Products] Search', props<{ query: string }>());
export const searchProductsSuccess = createAction('[Products] Search Success', props<{ result: SearchResult }>());
export const searchProductsFailure = createAction('[Products] Search Failure', props<{ error: string }>());
export const clearSearch = createAction('[Products] Clear Search');
