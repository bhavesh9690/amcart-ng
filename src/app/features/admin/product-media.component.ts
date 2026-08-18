import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { SnackbarService } from '../../shared/services/snackbar.service';

@Component({
  selector: 'app-product-media',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-media.component.html',
  styleUrls: ['./product-media.component.scss']
})
export class ProductMediaComponent implements OnInit {
  products: Product[] = [];
  selectedProductId = '';
  selectedFiles: FileList | null = null;
  uploading = false;

  constructor(private productService: ProductService, private snackbar: SnackbarService) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(p => this.products = p);
  }

  onFilesChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.selectedFiles = input.files;
  }

  upload() {
    if (!this.selectedProductId) {
      this.snackbar.show('Please select a product', { type: 'error' });
      return;
    }
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      this.snackbar.show('Please choose one or more image files', { type: 'error' });
      return;
    }
    this.uploading = true;
    this.productService.uploadProductImages(this.selectedProductId, this.selectedFiles).subscribe({
      next: () => {
        this.uploading = false;
        this.snackbar.show('Images uploaded', { type: 'success' });
      },
      error: (err) => {
        this.uploading = false;
        console.error('Upload error', err);
        this.snackbar.show('Upload failed', { type: 'error' });
      }
    });
  }
}
