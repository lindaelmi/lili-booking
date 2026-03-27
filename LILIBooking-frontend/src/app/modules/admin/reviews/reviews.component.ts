import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class AdminReviewsComponent implements OnInit {
  reviews: any[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef   // ← Injection
  ) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    // Exemple avec données statiques
    setTimeout(() => {
      this.reviews = [
        { id: 1, author: 'Jean Dupont', hotel: 'Hôtel Plaza Athénée', rating: 5, comment: 'Super expérience !', date: '15/01/2024' },
        { id: 2, author: 'Marie Simon', hotel: 'Le Bristol', rating: 5, comment: 'Voyage parfait.', date: '10/01/2024' },
        { id: 3, author: 'Thomas Richard', hotel: 'Ritz Paris', rating: 4, comment: 'Très bien.', date: '05/01/2024' }
      ];
      this.isLoading = false;
      this.cdr.detectChanges(); // ← Force la mise à jour
    }, 500);
  }

  deleteReview(id: number): void {
    if (confirm('Supprimer cet avis ?')) {
      this.reviews = this.reviews.filter(r => r.id !== id);
      this.cdr.detectChanges(); // ← Mise à jour après suppression
      // Appel API pour suppression réelle
    }
  }
}