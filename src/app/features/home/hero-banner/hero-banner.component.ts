import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Slide {
  bg: string;
  label: string;
  title: string;
  em: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero-banner.component.html',
})
export class HeroBannerComponent {
  current = 0;

  slides: Slide[] = [
    {
      bg: 'linear-gradient(135deg, #fce4d6 0%, #f5e6e8 100%)',
      label: 'New Season Arrivals',
      title: "Women's New",
      em: 'Collection 2026',
      subtitle: 'Discover the latest trends in women\'s fashion Ã¢â‚¬â€ from elegant jackets to everyday essentials.',
      ctaText: 'Shop Women',
      ctaLink: '/women'
    },
    {
      bg: 'linear-gradient(135deg, #e8ecf5 0%, #d6e0f0 100%)',
      label: 'Men\'s Essentials',
      title: "Style for",
      em: 'Every Man',
      subtitle: 'Smart casual and formal wear for the modern gentleman. Premium quality, exceptional value.',
      ctaText: 'Shop Men',
      ctaLink: '/men'
    },
    {
      bg: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
      label: 'Limited Time',
      title: 'Up to 50%',
      em: 'Off Sale',
      subtitle: 'Don\'t miss our biggest sale of the season. Hundreds of items at unbeatable prices.',
      ctaText: 'Shop Sale',
      ctaLink: '/sale'
    }
  ];

  next(): void { this.current = (this.current + 1) % this.slides.length; }
  prev(): void { this.current = (this.current - 1 + this.slides.length) % this.slides.length; }
}
