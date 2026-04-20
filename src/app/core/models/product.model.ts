export interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  /**
   * CDN URL for product card thumbnail (thumb variant from CloudFront).
   * Populated by ProductService from imageUrls.thumb when the real API is used.
   */
  imageUrl: string;
  /**
   * Full map of CDN image URLs returned by product-service.
   * Keys: 'main' (800×800), 'thumb' (400×400), 'zoom' (1200×1200).
   * Consumed by ngx-image-zoom on the product detail page.
   */
  imageUrls?: { main?: string; thumb?: string; zoom?: string };
  category: string;
  categoryId?: string;
  brand: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
  slug?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

export interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Banner {
  imageUrl: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}
