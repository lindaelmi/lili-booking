import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import Chart from 'chart.js/auto';  // ← Import Chart.js

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('bookingsChart') bookingsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;

  today: Date = new Date();

  stats = {
    users: 0,
    hotels: 0,
    bookings: 0,
    revenue: 0
  };
  isLoading = true;
  errorMessage = '';

  private bookingsChart: Chart | undefined;
  private revenueChart: Chart | undefined;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  ngAfterViewInit(): void {
    // Les graphiques seront créés après le chargement des données
    if (!this.isLoading && !this.errorMessage) {
      this.createCharts();
    }
  }

  loadStats(): void {
    this.isLoading = true;
    console.log('📡 Chargement des stats...');
    this.apiService.getStats().subscribe({
      next: (data) => {
        console.log('✅ Statistiques reçues:', data);
        this.stats = data;
        this.isLoading = false;
        this.cdr.detectChanges();
        // Créer les graphiques après mise à jour de la vue
        setTimeout(() => this.createCharts(), 0);
      },
      error: (err) => {
        console.error('❌ Erreur chargement stats', err);
        this.errorMessage = 'Impossible de charger les statistiques.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private createCharts(): void {
    // Détruire les anciens graphiques s'ils existent
    this.bookingsChart?.destroy();
    this.revenueChart?.destroy();

    // Graphique des réservations (ligne)
    if (this.bookingsChartRef) {
      this.bookingsChart = new Chart(this.bookingsChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
          datasets: [{
            label: 'Réservations',
            data: [65, 59, 80, 81, 56, 55],
            borderColor: '#3b7ddd',
            backgroundColor: 'rgba(59,125,221,0.2)',
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true }
          }
        }
      });
    }

    // Graphique des revenus (barres)
    if (this.revenueChartRef) {
      this.revenueChart = new Chart(this.revenueChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
          datasets: [{
            label: 'Revenus (€)',
            data: [1200, 1900, 3000, 5000, 2300, 3400],
            backgroundColor: '#28a745'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true }
          }
        }
      });
    }
  }
}