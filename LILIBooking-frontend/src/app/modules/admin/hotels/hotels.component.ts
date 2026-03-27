import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-hotels',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class AdminHotelsComponent implements OnInit {
  hotels: any[] = [];
  isLoading = true;
  errorMessage = '';

  showModal = false;
  editingHotel: any = null;
  hotelForm: any = {
    name: '',
    city: '',
    country: '',
    continent: '',
    stars: 3,
    pricePerNight: 0,
    description: '',
    amenities: '',
    rating: 4.5,
    reviewCount: 0,
    isActive: true
  };

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef   // ← Ajouté
  ) {}

  ngOnInit(): void {
    this.loadHotels();
  }

  loadHotels(): void {
    this.isLoading = true;
    this.apiService.getHotels().subscribe({
      next: (data) => {
        this.hotels = data;
        this.isLoading = false;
        this.cdr.detectChanges(); // ← Force la mise à jour
      },
      error: (err) => {
        console.error('Erreur chargement hôtels', err);
        this.errorMessage = 'Impossible de charger la liste des hôtels.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openAddModal(): void {
    this.editingHotel = null;
    this.hotelForm = {
      name: '',
      city: '',
      country: '',
      continent: '',
      stars: 3,
      pricePerNight: 0,
      description: '',
      amenities: '',
      rating: 4.5,
      reviewCount: 0,
      isActive: true
    };
    this.showModal = true;
  }

  openEditModal(hotel: any): void {
    this.editingHotel = hotel;
    this.hotelForm = { ...hotel };
    if (Array.isArray(this.hotelForm.amenities)) {
      this.hotelForm.amenities = this.hotelForm.amenities.join(', ');
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveHotel(): void {
    const hotelData = { ...this.hotelForm };
    if (typeof hotelData.amenities === 'string') {
      hotelData.amenities = hotelData.amenities.split(',').map((a: string) => a.trim());
    }

    if (this.editingHotel) {
      this.apiService.updateHotel(this.editingHotel.id, hotelData).subscribe({
        next: () => {
          this.loadHotels(); // recharge la liste (déjà avec detectChanges dans loadHotels)
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur mise à jour', err);
          alert('Erreur lors de la mise à jour.');
        }
      });
    } else {
      this.apiService.createHotel(hotelData).subscribe({
        next: () => {
          this.loadHotels();
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur création', err);
          alert('Erreur lors de la création.');
        }
      });
    }
  }

  deleteHotel(id: number): void {
    if (confirm('Supprimer cet hôtel ?')) {
      this.apiService.deleteHotel(id).subscribe({
        next: () => {
          this.hotels = this.hotels.filter(h => h.id !== id);
          this.cdr.detectChanges(); // Mise à jour après suppression
        },
        error: (err) => {
          console.error('Erreur suppression', err);
          alert('Erreur lors de la suppression.');
        }
      });
    }
  }
}