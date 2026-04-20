import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Category } from '../../../core/models/product.model';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss'
})
export class NavMenuComponent {
  @Input() set categories(cats: Category[] | null) {
    this.womenCat = cats?.find(c => c.slug === 'women') ?? null;
    this.menCat = cats?.find(c => c.slug === 'men') ?? null;
  }
  womenCat: Category | null = null;
  menCat: Category | null = null;
}
