import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class AdminBookingsComponent implements OnInit {
  bookings: any[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoading = true;
    // Pour l'exemple, on utilise localStorage (à remplacer par un vrai endpoint backend)
    const stored = localStorage.getItem('bookings');
    this.bookings = stored ? JSON.parse(stored) : [];
    this.isLoading = false;
    // Si vous avez un endpoint backend pour les réservations, utilisez :
    // this.apiService.getBookings().subscribe(...)
  }
}