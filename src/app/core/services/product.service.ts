import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Product, SearchResult, Category } from '../models/product.model';
import { environment } from '../../../environments/environment';

/** Maps imageUrls.thumb → imageUrl for backward compatibility with product-card components. */
function normalizeProductImage(p: Product): Product {
  return {
    ...p,
    inStock: p.inStock ?? true,
    imageUrl: p.imageUrl || p.imageUrls?.thumb || '',
  };
}

// --- Mock Data (used when environment.useMockApi = true) ---
const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Velvet Sweater For Her', price: 700, salePrice: 560, imageUrl: 'assets/images/pr1.jpg', category: 'women', brand: 'AmCart', rating: 4, reviewCount: 12, inStock: true, isNewArrival: false, isFeatured: true },
  { id: '2', name: 'Classic Leather Jacket', price: 1200, imageUrl: 'assets/images/pr2.jpg', category: 'women', brand: 'AmCart', rating: 5, reviewCount: 8, inStock: true, isNewArrival: true, isFeatured: true },
  { id: '3', name: 'Slim Fit Oxford Shirt', price: 450, imageUrl: 'assets/images/pr3.jpg', category: 'men', brand: 'AmCart', rating: 4, reviewCount: 21, inStock: true, isNewArrival: false, isFeatured: true },
  { id: '4', name: 'Men Autumn Jacket', price: 980, salePrice: 800, imageUrl: 'assets/images/pr4.jpg', category: 'men', brand: 'AmCart', rating: 3, reviewCount: 5, inStock: true, isNewArrival: true, isFeatured: true },
  { id: '5', name: 'Women Summer Dress', price: 350, imageUrl: 'assets/images/pr5.jpg', category: 'women', brand: 'AmCart', rating: 5, reviewCount: 30, inStock: true, isNewArrival: true, isFeatured: false },
  { id: '6', name: 'Casual Denim Jeans', price: 600, imageUrl: 'assets/images/pr6.jpg', category: 'men', brand: 'AmCart', rating: 4, reviewCount: 15, inStock: false, isNewArrival: true, isFeatured: false },
  { id: '7', name: 'Floral Blouse', price: 280, salePrice: 199, imageUrl: 'assets/images/pr7.jpg', category: 'women', brand: 'AmCart', rating: 4, reviewCount: 9, inStock: true, isNewArrival: true, isFeatured: false },
  { id: '8', name: 'Men Polo Shirt', price: 320, imageUrl: 'assets/images/pr8.jpg', category: 'men', brand: 'AmCart', rating: 4, reviewCount: 18, inStock: true, isNewArrival: true, isFeatured: false },
];

const MOCK_CATEGORIES: Category[] = [
  {
    id: '1', name: 'Women', slug: 'women', children: [
      { id: '11', name: 'Jackets', slug: 'jackets', children: [
        { id: '111', name: 'Shirts', slug: 'shirts' },
        { id: '112', name: 'Jumpers & Cardigans', slug: 'jumpers' },
        { id: '113', name: 'Autumn Jackets', slug: 'autumn-jackets' },
        { id: '114', name: 'Winter Jackets', slug: 'winter-jackets' },
        { id: '115', name: 'Leather Jackets', slug: 'leather-jackets' },
      ]},
      { id: '12', name: 'Accessories', slug: 'accessories', children: [
        { id: '121', name: 'Bags', slug: 'bags' },
        { id: '122', name: 'Beauty', slug: 'beauty' },
        { id: '123', name: 'Glasses', slug: 'glasses' },
        { id: '124', name: 'Underwear', slug: 'underwear' },
      ]},
      { id: '13', name: 'Shoes', slug: 'shoes', children: [
        { id: '131', name: 'Heels', slug: 'heels' },
        { id: '132', name: 'Flats', slug: 'flats' },
        { id: '133', name: 'Boots', slug: 'boots' },
      ]},
    ]
  },
  {
    id: '2', name: 'Men', slug: 'men', children: [
      { id: '21', name: 'Tops', slug: 'tops', children: [
        { id: '211', name: 'Shirts', slug: 'shirts' },
        { id: '212', name: 'T-Shirts', slug: 't-shirts' },
        { id: '213', name: 'Polo', slug: 'polo' },
        { id: '214', name: 'Suits & Blazers', slug: 'suits' },
      ]},
      { id: '22', name: 'Bottoms', slug: 'bottoms', children: [
        { id: '221', name: 'Jeans', slug: 'jeans' },
        { id: '222', name: 'Shorts', slug: 'shorts' },
        { id: '223', name: 'Trousers', slug: 'trousers' },
      ]},
      { id: '23', name: 'Footwear', slug: 'footwear', children: [
        { id: '231', name: 'Sneakers', slug: 'sneakers' },
        { id: '232', name: 'Formal Shoes', slug: 'formal-shoes' },
        { id: '233', name: 'Boots', slug: 'boots' },
      ]},
    ]
  }
];

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private api: ApiService) {}

  getFeaturedProducts(): Observable<Product[]> {
    if (environment.useMockApi) return of(MOCK_PRODUCTS.filter(p => p.isFeatured));
    return this.api.get<{ content: Product[] }>('/api/v1/products/featured').pipe(
      map(res => res.content.map(normalizeProductImage))
    );
  }

  getNewArrivals(): Observable<Product[]> {
    if (environment.useMockApi) return of(MOCK_PRODUCTS.filter(p => p.isNewArrival));
    return this.api.get<{ content: Product[] }>('/api/v1/products/new-arrivals').pipe(
      map(res => res.content.map(normalizeProductImage))
    );
  }

  searchProducts(query: string, page = 0, size = 12): Observable<SearchResult> {
    if (environment.useMockApi) {
      const filtered = MOCK_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      );
      return of({ products: filtered, total: filtered.length, page, pageSize: size });
    }
    return this.api.get<SearchResult>('/api/v1/search', { q: query, page: String(page), size: String(size) });
  }

  getSuggestions(query: string): Observable<string[]> {
    if (environment.useMockApi) {
      const suggestions = MOCK_PRODUCTS
        .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
        .map(p => p.name)
        .slice(0, 5);
      return of(suggestions);
    }
    return this.api.get<string[]>('/api/v1/search/suggest', { q: query });
  }

  getCategories(): Observable<Category[]> {
    if (environment.useMockApi) return of(MOCK_CATEGORIES);
    return this.api.get<Category[]>('/api/v1/categories');
  }
}
