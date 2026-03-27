import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service'; // import du service API

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  editMode = false; // Indique si on est en mode édition
  editForm: any = {}; // Données du formulaire d'édition
  favorites: any[] = [];
  bookings: any[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user) {
        // Initialiser le formulaire avec les données actuelles
        this.editForm = {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phone: user.phone || '',
          email: user.email // l'email est généralement non modifiable
        };
      }
    });
    this.loadFavorites();
    this.loadBookings();
  }

  // Active/désactive le mode édition
  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      // Annuler les modifications : réinitialiser avec les données originales
      this.editForm = {
        firstName: this.user.firstName || '',
        lastName: this.user.lastName || '',
        phone: this.user.phone || '',
        email: this.user.email
      };
    }
  }

  // Sauvegarde des modifications
  saveProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Appel API pour mettre à jour l'utilisateur
    this.apiService.updateUser(this.user.id, this.editForm).subscribe({
      next: (updatedUser) => {
        // Mettre à jour l'utilisateur dans le service AuthService
        this.authService.updateUser(updatedUser);
        this.user = updatedUser;
        this.editMode = false;
        this.isLoading = false;
        this.successMessage = 'Profil mis à jour avec succès !';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Erreur mise à jour profil', err);
        this.errorMessage = 'Erreur lors de la mise à jour du profil.';
        this.isLoading = false;
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  loadFavorites(): void {
    this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  }

  loadBookings(): void {
    this.bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  }

  removeFavorite(hotelId: number): void {
    this.favorites = this.favorites.filter(fav => fav.id !== hotelId);
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/';
  }
}