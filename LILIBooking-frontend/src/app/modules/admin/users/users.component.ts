import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  isLoading = true;
  errorMessage = '';

  editingUser: any = null;
  newRole: string = '';

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef   // ← Ajouté
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.apiService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
        this.cdr.detectChanges(); // ← Force la mise à jour
      },
      error: (err) => {
        console.error('Erreur chargement utilisateurs', err);
        this.errorMessage = 'Impossible de charger la liste des utilisateurs.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteUser(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.apiService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== id);
          this.cdr.detectChanges(); // ← Important après modification de la liste
        },
        error: (err) => {
          console.error('Erreur suppression', err);
          alert('Erreur lors de la suppression.');
        }
      });
    }
  }

  startEditRole(user: any): void {
    this.editingUser = user;
    this.newRole = user.role;
  }

  saveRole(): void {
    if (this.editingUser && this.newRole) {
      // Simulation, mais vous pouvez appeler l'API réelle ici
      this.editingUser.role = this.newRole;
      this.editingUser = null;
      this.newRole = '';
      alert('Rôle mis à jour (simulation)');
      this.cdr.detectChanges(); // Mise à jour de l'affichage
    }
  }

  cancelEdit(): void {
    this.editingUser = null;
    this.newRole = '';
  }
}