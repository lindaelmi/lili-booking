import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <!-- Grille principale -->
          <div class="footer-grid">
            <!-- Colonne 1 : Logo et description -->
            <div class="footer-col">
              <div class="brand">
                <i class="fas fa-hotel"></i>
                <span>LILIBooking</span>
              </div>
              <p class="description">
                Réservez vos hôtels, transports et excursions dans le monde entier.
                Meilleures offres garanties pour vos voyages.
              </p>
              <div class="social-links">
                <a href="#" class="social-link" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                <a href="#" class="social-link" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                <a href="#" class="social-link" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                <a href="#" class="social-link" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
              </div>
            </div>

            <!-- Colonne 2 : Liens rapides -->
            <div class="footer-col">
              <h4 class="footer-title">Liens rapides</h4>
              <ul class="footer-links">
                <li><a routerLink="/"><i class="fas fa-chevron-right"></i> Accueil</a></li>
                <li><a routerLink="/hotels"><i class="fas fa-chevron-right"></i> Hôtels</a></li>
                <li><a routerLink="/excursions"><i class="fas fa-chevron-right"></i> Excursions</a></li>
                <li><a routerLink="/transports"><i class="fas fa-chevron-right"></i> Transports</a></li>
                <li><a routerLink="/contact"><i class="fas fa-chevron-right"></i> Contact</a></li>
              </ul>
            </div>

            <!-- Colonne 3 : Contact -->
            <div class="footer-col">
              <h4 class="footer-title">Contact</h4>
              <ul class="contact-info">
                <li>
                  <i class="fas fa-envelope"></i>
                  <a href="mailto:contact@lilibooking.com">contact@lilibooking.com</a>
                </li>
                <li>
                  <i class="fas fa-phone-alt"></i>
                  <a href="tel:+33123456789">+33 1 23 45 67 89</a>
                </li>
                <li>
                  <i class="fas fa-map-marker-alt"></i>
                  <span>123 Avenue des Champs-Élysées, 75008 Paris, France</span>
                </li>
              </ul>
            </div>

            <!-- Colonne 4 : Newsletter -->
            <div class="footer-col">
              <h4 class="footer-title">Newsletter</h4>
              <p class="newsletter-text">
                Inscrivez-vous pour recevoir nos meilleures offres
              </p>
              <form class="newsletter-form" (submit)="$event.preventDefault()">
                <div class="input-group">
                  <input type="email" placeholder="Votre email" aria-label="Email">
                  <button type="submit" aria-label="S'inscrire">
                    <i class="fas fa-paper-plane"></i>
                  </button>
                </div>
              </form>
              <p class="newsletter-note">
                En vous inscrivant, vous acceptez notre 
                <a href="#">politique de confidentialité</a>
              </p>
            </div>
          </div>

          <!-- Barre de séparation décorative -->
          <div class="footer-divider">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <!-- Bas de page : copyright et liens légaux -->
          <div class="footer-bottom">
            <p class="copyright">&copy; 2025 LILIBooking. Tous droits réservés.</p>
            <div class="legal-links">
              <a href="#">Mentions légales</a>
              <a href="#">Politique de confidentialité</a>
              <a href="#">Conditions générales</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
      margin-top: auto;
    }

    .footer {
      background: linear-gradient(135deg, #2c3e50 0%, #1a2a3a 100%);
      color: #fff;
      padding: 4rem 0 2rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      position: relative;
      overflow: hidden;
    }

    /* Bande colorée en haut */
    .footer::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 5px;
      background: linear-gradient(90deg, #446965, #d9bb80, #005a60);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
      position: relative;
      z-index: 1;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2.5rem;
      margin-bottom: 3rem;
    }

    /* Brand */
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .brand i {
      font-size: 2.2rem;
      color: #d9bb80;
    }

    .brand span {
      font-size: 1.8rem;
      font-weight: 600;
      background: linear-gradient(135deg, #fff, #d9bb80);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .description {
      color: rgba(255,255,255,0.7);
      line-height: 1.7;
      margin-bottom: 1.8rem;
      font-size: 0.95rem;
    }

    /* Réseaux sociaux */
    .social-links {
      display: flex;
      gap: 1rem;
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
      color: #fff;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .social-link:hover {
      background: #446965;
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(68,105,101,0.4);
    }

    /* Titres des colonnes */
    .footer-title {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 1.8rem;
      position: relative;
      padding-bottom: 0.8rem;
    }

    .footer-title::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 50px;
      height: 3px;
      background: #d9bb80;
      border-radius: 2px;
    }

    /* Liens rapides */
    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-links li {
      margin-bottom: 0.8rem;
    }

    .footer-links a {
      color: rgba(255,255,255,0.7);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      transition: all 0.3s ease;
    }

    .footer-links a i {
      font-size: 0.8rem;
      color: #d9bb80;
    }

    .footer-links a:hover {
      color: #fff;
      transform: translateX(5px);
    }

    /* Contact */
    .contact-info {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .contact-info li {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1.2rem;
      color: rgba(255,255,255,0.7);
    }

    .contact-info i {
      color: #d9bb80;
      font-size: 1.1rem;
      margin-top: 0.2rem;
      width: 20px;
    }

    .contact-info a {
      color: rgba(255,255,255,0.7);
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .contact-info a:hover {
      color: #fff;
    }

    /* Newsletter */
    .newsletter-text {
      color: rgba(255,255,255,0.7);
      margin-bottom: 1.2rem;
      font-size: 0.95rem;
    }

    .newsletter-form {
      margin-bottom: 1rem;
    }

    .input-group {
      display: flex;
      background: rgba(255,255,255,0.1);
      border-radius: 50px;
      padding: 0.3rem;
      border: 1px solid rgba(255,255,255,0.1);
      transition: all 0.3s ease;
    }

    .input-group:focus-within {
      border-color: #d9bb80;
      box-shadow: 0 0 0 3px rgba(217,187,128,0.2);
    }

    .input-group input {
      flex: 1;
      background: transparent;
      border: none;
      padding: 0.8rem 1.2rem;
      color: #fff;
      font-size: 0.95rem;
      outline: none;
    }

    .input-group input::placeholder {
      color: rgba(255,255,255,0.5);
    }

    .input-group button {
      background: #446965;
      border: none;
      border-radius: 50px;
      width: 45px;
      height: 45px;
      color: #fff;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .input-group button:hover {
      background: #005a60;
      transform: scale(1.05);
    }

    .newsletter-note {
      color: rgba(255,255,255,0.5);
      font-size: 0.8rem;
    }

    .newsletter-note a {
      color: #d9bb80;
      text-decoration: none;
    }

    .newsletter-note a:hover {
      text-decoration: underline;
    }

    /* Diviseur décoratif */
    .footer-divider {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin: 2rem 0;
    }

    .footer-divider span {
      width: 50px;
      height: 3px;
      background: linear-gradient(90deg, #446965, #d9bb80, #005a60);
      border-radius: 2px;
      opacity: 0.5;
      animation: pulse 2s infinite;
    }

    .footer-divider span:nth-child(2) {
      width: 100px;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }

    /* Bas de page */
    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.6);
      font-size: 0.9rem;
    }

    .copyright {
      margin: 0;
    }

    .legal-links {
      display: flex;
      gap: 2rem;
    }

    .legal-links a {
      color: rgba(255,255,255,0.6);
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .legal-links a:hover {
      color: #d9bb80;
    }

    /* Responsive */
    @media (max-width: 992px) {
      .footer-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .footer {
        padding: 3rem 0 1.5rem;
      }
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      .footer-bottom {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
      .legal-links {
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
      }
    }
  `]
})
export class FooterComponent {}