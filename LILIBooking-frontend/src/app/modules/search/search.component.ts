import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // ← AJOUT
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  criteria = {
    destination: '',
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    rooms: 1,
    type: 'hotel'
  };

  hotels: any[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef // ← INJECTION
  ) {
    console.log('🆕 SearchComponent instancié (constructeur)');
  }

  ngOnInit(): void {
    console.log('🔄 ngOnInit appelé');
    this.route.queryParams.subscribe(params => {
      console.log('📦 QueryParams reçus:', params);
      this.criteria = {
        destination: params['destination'] || '',
        checkIn: params['checkIn'] || '',
        checkOut: params['checkOut'] || '',
        adults: +params['adults'] || 1,
        children: +params['children'] || 0,
        rooms: +params['rooms'] || 1,
        type: params['type'] || 'hotel'
      };
      this.searchHotels();
    });
  }

  searchHotels(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.apiService.searchHotels(this.criteria).pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges(); // ← FORCE LA MISE À JOUR DU TEMPLATE
        console.log('🔚 finalize appelé, isLoading = false, detectChanges forcé');
      })
    ).subscribe({
      next: (data) => {
        this.hotels = data || [];
        this.cdr.detectChanges(); // ← FORCE LA MISE À JOUR
        console.log('✅ Résultats reçus:', this.hotels.length);
        console.log('🏨 Premier hôtel:', this.hotels[0]);
      },
      error: (err) => {
        console.error('❌ Erreur recherche:', err);
        this.errorMessage = 'Impossible de charger les résultats.';
        this.cdr.detectChanges(); // ← FORCE LA MISE À JOUR
      }
    });
  }

  getStarsArray(stars: number): number[] {
    return Array(stars).fill(0);
  }

  formatPrice(price: number): string {
    return price ? price.toFixed(2) : '0.00';
  }

  getHotelImage(hotel: any): string {
    const colors: Record<string, string> = {
      'Europe': '#4A90E2',
      'Asie': '#FF6B6B',
      'Afrique': '#FFD700',
      'Amérique': '#20B2AA',
      'Océanie': '#9370DB',
      'default': '#CCCCCC'
    };
    const color = colors[hotel.continent] || colors['default'];
    const text = hotel.continent || 'Hôtel';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="${color}" rx="10" ry="10"/>
      <path d="M100,100 L150,50 L250,50 L300,100 Z" fill="white" fill-opacity="0.3"/>
      <rect x="120" y="100" width="60" height="50" fill="white" fill-opacity="0.4"/>
      <rect x="220" y="100" width="60" height="50" fill="white" fill-opacity="0.4"/>
      <text x="200" y="180" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle">${text}</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
  }

  addToFavorites(hotel: any): void {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favorites.find((fav: any) => fav.id === hotel.id)) {
      favorites.push({ id: hotel.id, name: hotel.name, city: hotel.city, price: hotel.pricePerNight });
      localStorage.setItem('favorites', JSON.stringify(favorites));
      alert(`${hotel.name} ajouté aux favoris !`);
    } else {
      alert(`${hotel.name} déjà dans vos favoris.`);
    }
  }

  trackByHotelId(index: number, hotel: any): number {
    return hotel.id;
  }
}