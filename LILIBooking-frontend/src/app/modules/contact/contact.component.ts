// src/app/modules/contact/contact.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../services/contact.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ] // 
})
export class ContactComponent {
  contactForm: FormGroup;
  submitted = false;
  isLoading = false;
  
  // Ajoutez ces propriétés
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private authService: AuthService
  ) {
    const currentUser = this.authService.getCurrentUser();

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });

    if (currentUser) {
      this.contactForm.patchValue({
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        email: currentUser.email
      });
    }
  }

  // Ajoutez ces getters pour accéder facilement aux contrôles du formulaire
  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get subject() { return this.contactForm.get('subject'); }
  get message() { return this.contactForm.get('message'); }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isLoading = true;
      this.errorMessage = ''; // Réinitialiser les messages
      this.successMessage = '';

      const currentUser = this.authService.getCurrentUser();
      const formData = {
        ...this.contactForm.value,
        userId: currentUser?.id
      };

      this.contactService.sendMessage(formData).subscribe({
        next: () => {
          this.submitted = true;
          this.successMessage = 'CONTACT.SUCCESS_MESSAGE'; // Utilisez votre clé de traduction
          this.contactForm.reset();
          this.isLoading = false;
          
          // Réinitialiser après 5 secondes
          setTimeout(() => {
            this.submitted = false;
            this.successMessage = '';
          }, 5000);
        },
        error: (error) => {
          console.error('Error sending message:', error);
          this.errorMessage = 'CONTACT.ERROR_MESSAGE'; // Utilisez votre clé de traduction
          this.isLoading = false;
          
          // Réinitialiser après 5 secondes
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.contactForm.markAllAsTouched();
    }
  }
}