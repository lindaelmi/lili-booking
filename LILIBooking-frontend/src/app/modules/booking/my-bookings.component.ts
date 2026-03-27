// src/app/modules/booking/my-bookings.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-5">
      <div class="row mb-4">
        <div class="col-12">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a routerLink="/">Accueil</a></li>
              <li class="breadcrumb-item active">Mes réservations</li>
            </ol>
          </nav>
          <h1 class="mb-3">Mes réservations</h1>
          <p class="text-muted">Retrouvez toutes vos réservations d'hôtels</p>
        </div>
      </div>

      <!-- Mode démo actif -->
      <div *ngIf="demoMode && !loading" class="alert alert-info">
        <i class="fas fa-flask"></i> Mode démonstration (fonctionnalité en développement).<br>
        <button class="btn btn-sm btn-outline-secondary mt-2" (click)="disableDemo()">Retour au mode normal</button>
      </div>

      <!-- Chargement -->
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
        <p class="mt-3">Chargement de vos réservations...</p>
      </div>

      <!-- Erreur non gérée -->
      <div *ngIf="error && !demoMode" class="alert alert-danger">
        <i class="fas fa-exclamation-triangle"></i> {{ error }}
        <button class="btn btn-sm btn-outline-danger ms-3" (click)="loadBookings()">Réessayer</button>
      </div>

      <!-- Liste des réservations -->
      <div *ngIf="!loading && (!error || demoMode)">
        <div *ngIf="bookings.length === 0 && !demoMode" class="alert alert-info text-center">
          <i class="fas fa-calendar-alt fa-2x mb-2"></i>
          <h4>Aucune réservation pour le moment</h4>
          <p>Effectuez votre première réservation d'hôtel dès maintenant !</p>
          <a routerLink="/hotels" class="btn btn-primary mt-2">Rechercher un hôtel</a>
        </div>

        <div class="row g-4" *ngIf="bookings.length > 0">
          <div class="col-md-6 col-lg-4" *ngFor="let booking of bookings">
            <div class="card h-100 shadow-sm">
              <div class="position-relative">
                <img [src]="getHotelImage(booking.hotel)" class="card-img-top" alt="{{ booking.hotel.name }}" style="height: 200px; object-fit: cover;">
                <span class="badge bg-success position-absolute bottom-0 start-0 m-2">Confirmée</span>
              </div>
              <div class="card-body">
                <h5 class="card-title">{{ booking.hotel.name }}</h5>
                <p class="card-text text-muted">
                  <i class="fas fa-map-marker-alt"></i> {{ booking.hotel.city }}, {{ booking.hotel.country }}
                </p>
                <div class="mb-2">
                  <i class="fas fa-calendar-check"></i> <strong>Arrivée :</strong> {{ booking.checkIn | date:'dd/MM/yyyy' }}<br>
                  <i class="fas fa-calendar-times"></i> <strong>Départ :</strong> {{ booking.checkOut | date:'dd/MM/yyyy' }}
                </div>
                <p>
                  <i class="fas fa-user"></i> {{ booking.adults }} adulte(s)
                  <span *ngIf="booking.children > 0">, {{ booking.children }} enfant(s)</span>
                  <br>
                  <i class="fas fa-bed"></i> {{ booking.rooms }} chambre(s)
                </p>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="h5 text-primary mb-0">{{ booking.totalPrice }}€ <small>total</small></span>
                  <a [routerLink]="['/hotel', booking.hotel.id]" class="btn btn-outline-primary">Voir l'hôtel</a>
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
    .badge {
      background-color: #28a745;
    }
  `]
})
export class MyBookingsComponent implements OnInit {
  bookings: any[] = [];
  loading = false;
  error: string | null = null;
  demoMode = false;

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.error = null;
    this.demoMode = false;
    this.cdr.detectChanges();

    this.apiService.getMyBookings().subscribe({
      next: (data: any[]) => {
        this.bookings = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erreur chargement réservations', err);
        if (err.status === 404) {
          this.enableDemoMode();
        } else {
          this.error = 'Impossible de charger vos réservations. Vérifiez votre connexion.';
          this.loading = false;
        }
        this.cdr.detectChanges();
      }
    });
  }

  enableDemoMode(): void {
    this.demoMode = true;
    this.error = null;
    this.loading = false;
    this.bookings = [
      {
        id: 1,
        hotel: {
          id: 1,
          name: 'Hôtel Plaza Athénée',
          city: 'Paris',
          country: 'France',
          image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'
        },
        checkIn: '2025-05-10',
        checkOut: '2025-05-15',
        adults: 2,
        children: 1,
        rooms: 1,
        totalPrice: 1250
      },
      {
        id: 2,
        hotel: {
          id: 2,
          name: 'Le Bristol',
          city: 'Paris',
          country: 'France',
          image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg'
        },
        checkIn: '2025-06-20',
        checkOut: '2025-06-25',
        adults: 2,
        children: 0,
        rooms: 1,
        totalPrice: 3250
      },
      {
        id: 3,
        hotel: {
          id: 3,
          name: 'Hôtel de Crillon',
          city: 'Paris',
          country: 'France',
          image: 'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg'
        },
        checkIn: '2025-07-01',
        checkOut: '2025-07-05',
        adults: 2,
        children: 0,
        rooms: 1,
        totalPrice: 2800
      }
    ];
  }

  disableDemo(): void {
    this.demoMode = false;
    this.bookings = [];
    this.loadBookings();
  }

  // Méthode améliorée pour récupérer l'image de l'hôtel
  getHotelImage(hotel: any): string {
    // 1. Essayer les différents champs possibles (selon votre API)
    const image = hotel.imageUrl || hotel.image || hotel.photo;
    if (image) {
      if (image.startsWith('http')) return image;
      // Si l'image est un chemin relatif, on ajoute l'URL de base
      return `http://localhost:3000${image}`;
    }

    // 2. Fallback : images aléatoires basées sur l'ID de l'hôtel
    const hotelImages = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564501049412-61c2a30805a0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564501049412-61c2a30805a0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
    ];
    const index = (hotel.id - 1) % hotelImages.length;
    return hotelImages[index];
  }
}