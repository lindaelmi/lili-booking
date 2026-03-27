import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { FavoritesService } from '../services/favorites.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-5">
      <div class="row mb-4">
        <div class="col-12">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a routerLink="/">Accueil</a></li>
              <li class="breadcrumb-item active">Mes Favoris</li>
            </ol>
          </nav>
          <h1 class="mb-3">Mes Favoris</h1>
          <p class="text-muted">Retrouvez tous vos hôtels favoris</p>
        </div>
      </div>

      <!-- État de chargement -->
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
        <p class="mt-3">Chargement de vos favoris...</p>
      </div>

      <!-- Message d'erreur -->
      <div *ngIf="error" class="alert alert-danger">
        <i class="fas fa-exclamation-triangle"></i> {{ error }}
        <button class="btn btn-sm btn-outline-danger ms-3" (click)="loadFavorites()">Réessayer</button>
      </div>

      <!-- Liste des favoris -->
      <div *ngIf="!loading && !error">
        <div *ngIf="favoriteHotels.length === 0" class="alert alert-info text-center">
          <i class="fas fa-heart fa-2x mb-2"></i>
          <h4>Aucun hôtel favori pour le moment</h4>
          <p>Explorez nos hôtels et ajoutez vos coups de cœur en cliquant sur l'icône ❤️</p>
          <a routerLink="/hotels" class="btn btn-primary mt-2">Découvrir nos hôtels</a>
        </div>

        <div class="row g-4" *ngIf="favoriteHotels.length > 0">
          <div class="col-md-6 col-lg-4" *ngFor="let hotel of favoriteHotels">
            <div class="card h-100 shadow-sm">
              <div class="position-relative">
                <img [src]="getHotelImage(hotel)" class="card-img-top" alt="{{ hotel.name }}" style="height: 200px; object-fit: cover;">
                <button class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2" 
                        (click)="removeFavorite(hotel.id)"
                        title="Retirer des favoris">
                  <i class="fas fa-heart-broken"></i>
                </button>
              </div>
              <div class="card-body">
                <h5 class="card-title">{{ hotel.name }}</h5>
                <p class="card-text text-muted">
                  <i class="fas fa-map-marker-alt"></i> {{ hotel.city }}, {{ hotel.country }}
                </p>
                <p class="card-text">{{ hotel.description | slice:0:100 }}...</p>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="h5 text-primary mb-0">{{ hotel.pricePerNight }}€ <small>/ nuit</small></span>
                  <a [routerLink]="['/hotel', hotel.id]" class="btn btn-outline-primary">Voir détails</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .breadcrumb {
      background-color: transparent;
      padding: 0;
    }
    .card {
      transition: transform 0.2s;
    }
    .card:hover {
      transform: translateY(-5px);
    }
    .btn-danger {
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class FavoritesComponent implements OnInit {
  loading = false;
  error: string | null = null;
  favoriteHotels: any[] = [];

  // 🖼️ Images thématiques hôtel (chambres, piscines, restaurants, etc.)
  private hotelThemedImages: string[] = [
    'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',     // chambre moderne
    'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',     // piscine extérieure
    'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',     // restaurant élégant
    'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',     // jardin avec terrasse
    'https://images.pexels.com/photos/704555/pexels-photo-704555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',     // spa
    'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',   // lit confortable
    'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',     // bar lounge
    'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',     // piscine intérieure
    'https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',     // suite de luxe
    'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',     // terrasse avec vue
    'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',     // salle de réunion
    'https://images.pexels.com/photos/250700/pexels-photo-250700.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',     // gym
    'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',   // chambre avec balcon
    'https://images.pexels.com/photos/1893341/pexels-photo-1893341.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',   // piscine à débordement
    'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',     // restaurant terrasse
    'https://images.pexels.com/photos/1648772/pexels-photo-1648772.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',   // lobby élégant
    'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',     // petit-déjeuner
    'https://images.pexels.com/photos/210604/pexels-photo-210604.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',     // salle de bain luxe
    'https://images.pexels.com/photos/264379/pexels-photo-264379.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',     // cheminée dans un salon
    'https://images.pexels.com/photos/259863/pexels-photo-259863.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'      // vue sur l'océan
  ];

  constructor(
    private apiService: ApiService,
    private favoritesService: FavoritesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.loading = true;
    this.error = null;

    const favoriteIds = this.favoritesService.getFavorites();

    if (favoriteIds.length === 0) {
      this.favoriteHotels = [];
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.apiService.getHotels().subscribe({
      next: (hotels) => {
        this.favoriteHotels = hotels.filter(hotel => favoriteIds.includes(hotel.id));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des hôtels', err);
        this.error = 'Impossible de charger vos favoris. Vérifiez la connexion au serveur.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  removeFavorite(hotelId: number): void {
    this.favoritesService.removeFavorite(hotelId);
    this.loadFavorites();
  }

  getHotelImage(hotel: any): string {
    // 1. Image propre de l’hôtel si elle existe (peut venir de l’API)
    if (hotel.image) return hotel.image;
    if (hotel.imageUrl) return hotel.imageUrl;

    // 2. Mapping personnalisé pour des hôtels précis (optionnel)
    const customImages: { [key: number]: string } = {
      // Exemple : si vous voulez une image spécifique pour l’hôtel ID 1
      // 1: 'https://...'
    };
    if (customImages[hotel.id]) {
      return customImages[hotel.id];
    }

    // 3. Image thématique hôtel basée sur l’ID (stable)
    const index = (hotel.id - 1) % this.hotelThemedImages.length;
    return this.hotelThemedImages[index];
  }
}