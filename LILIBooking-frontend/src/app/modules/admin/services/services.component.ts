import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class AdminServicesComponent implements OnInit {
  services: any[] = [];
  newService = { name: '', price: 0, description: '' };

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    // Exemple statique, à remplacer par un appel API
    this.services = [
      { id: 1, name: 'Petit-déjeuner', price: 15, description: 'Buffet petit-déjeuner' },
      { id: 2, name: 'Spa', price: 50, description: 'Accès au spa' },
      { id: 3, name: 'Transfert aéroport', price: 80, description: 'Navette aller-retour' }
    ];
  }

  addService(): void {
    if (this.newService.name && this.newService.price > 0) {
      const newId = Math.max(...this.services.map(s => s.id), 0) + 1;
      this.services.push({ id: newId, ...this.newService });
      this.newService = { name: '', price: 0, description: '' };
    }
  }

  deleteService(id: number): void {
    if (confirm('Supprimer ce service ?')) {
      this.services = this.services.filter(s => s.id !== id);
    }
  }
}