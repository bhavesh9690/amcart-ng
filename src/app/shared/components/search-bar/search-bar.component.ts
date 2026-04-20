import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  searchControl = new FormControl('');
  suggestions: string[] = [];
  showSuggestions = false;

  constructor(private router: Router, private productService: ProductService) {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(q => !!q && q.length >= 2),
      switchMap(q => this.productService.getSuggestions(q!))
    ).subscribe(s => {
      this.suggestions = s;
      this.showSuggestions = s.length > 0;
    });
  }

  onSearch(): void {
    const q = this.searchControl.value?.trim();
    if (q) { this.showSuggestions = false; this.router.navigate(['/search'], { queryParams: { q } }); }
  }

  selectSuggestion(s: string): void {
    this.searchControl.setValue(s);
    this.showSuggestions = false;
    this.router.navigate(['/search'], { queryParams: { q: s } });
  }

  hideSuggestions(): void {
    setTimeout(() => { this.showSuggestions = false; }, 150);
  }
}
