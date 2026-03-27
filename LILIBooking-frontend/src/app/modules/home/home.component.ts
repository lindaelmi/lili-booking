import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HeaderComponent } from '../../layouts/header/header.component';
import { MapComponent } from '../../shared/components/map/map.component';

// Si vous n'utilisez plus ApiService, vous pouvez retirer l'import.
// Mais nous le gardons pour d'éventuelles évolutions futures.
// import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HeaderComponent,
    MapComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  bookingTypes = [
    { label: 'Hôtel', value: 'hotel', icon: 'fa-bed' }
  ];

  searchData = {
    bookingType: 'hotel',
    destination: '',
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    rooms: 1
  };

  showSuggestions = false;
  filteredDestinations: any[] = [];
  destinations: any[] = [];

  selectedContinent = 'Europe';
  dateError: string | null = null;

  reviews = [
    { avatar: 'JD', name: 'Jean Dupont', country: 'France', comment: 'Super expérience !', date: '15 janvier 2024', rating: 5 },
    { avatar: 'MS', name: 'Marie Simon', country: 'Belgique', comment: 'Voyage parfaitement organisé.', date: '10 janvier 2024', rating: 5 },
    { avatar: 'TR', name: 'Thomas Richard', country: 'Suisse', comment: 'Hôtel propre et bien situé.', date: '5 janvier 2024', rating: 4 }
  ];

  constructor(
    // private apiService: ApiService,  // commenté car non utilisé
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeDestinations();

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    this.searchData.checkIn = this.formatDateForInput(today);
    this.searchData.checkOut = this.formatDateForInput(tomorrow);
  }

  // ============================================
  // GÉNÉRATION D'IMAGE PERTINENTE POUR CHAQUE DESTINATION
  // ============================================
  getDestinationImage(destination: any): string {
    // Mapping d'images stables (Pexels)
    const images: { [key: string]: string } = {
      // Europe
      'Paris': 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Rome': 'https://images.pexels.com/photos/3532559/pexels-photo-3532559.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Barcelone': 'https://images.pexels.com/photos/401496/pexels-photo-401496.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Londres': 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Amsterdam': 'https://images.pexels.com/photos/408503/pexels-photo-408503.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Berlin': 'https://images.pexels.com/photos/220444/pexels-photo-220444.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Lisbonne': 'https://images.pexels.com/photos/3370842/pexels-photo-3370842.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Prague': 'https://images.pexels.com/photos/353453/pexels-photo-353453.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Athènes': 'https://images.pexels.com/photos/2929906/pexels-photo-2929906.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Vienne': 'https://images.pexels.com/photos/413885/pexels-photo-413885.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      // Asie
      'Tokyo': 'https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Bangkok': 'https://images.pexels.com/photos/995764/pexels-photo-995764.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Singapour': 'https://images.pexels.com/photos/1060486/pexels-photo-1060486.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Dubaï': 'https://images.pexels.com/photos/1173868/pexels-photo-1173868.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Séoul': 'https://images.pexels.com/photos/3184312/pexels-photo-3184312.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Pékin': 'https://images.pexels.com/photos/1181435/pexels-photo-1181435.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Hanoi': 'https://images.pexels.com/photos/1568634/pexels-photo-1568634.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Kuala Lumpur': 'https://images.pexels.com/photos/715546/pexels-photo-715546.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Mumbai': 'https://images.pexels.com/photos/396647/pexels-photo-396647.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      // Afrique
      'Marrakech': 'https://images.pexels.com/photos/1080192/pexels-photo-1080192.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Le Caire': 'https://images.pexels.com/photos/2711201/pexels-photo-2711201.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Le Cap': 'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Tunis': 'https://images.pexels.com/photos/1762377/pexels-photo-1762377.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Nairobi': 'https://images.pexels.com/photos/260602/pexels-photo-260602.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Zanzibar': 'https://images.pexels.com/photos/405152/pexels-photo-405152.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Dakar': 'https://images.pexels.com/photos/705659/pexels-photo-705659.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Casablanca': 'https://images.pexels.com/photos/259447/pexels-photo-259447.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    };

    return images[destination.name] || `https://via.placeholder.com/400x300?text=${encodeURIComponent(destination.name)}`;
  }

  // ============================================
  // DESTINATIONS – LISTE COMPLÈTE (sans champ image)
  // ============================================
  private initializeDestinations(): void {
    this.destinations = [
      // EUROPE
      { name: 'Paris', country: 'France', continent: 'Europe', description: 'La ville lumière', popularActivities: ['Tour Eiffel', 'Louvre', 'Seine'], hotelCount: 245, averagePrice: 150 },
      { name: 'Rome', country: 'Italie', continent: 'Europe', description: 'La ville éternelle', popularActivities: ['Colisée', 'Vatican', 'Fontaine de Trevi'], hotelCount: 312, averagePrice: 140 },
      { name: 'Barcelone', country: 'Espagne', continent: 'Europe', description: 'Capitale catalane', popularActivities: ['Sagrada Familia', 'Parc Güell', 'Ramblas'], hotelCount: 278, averagePrice: 135 },
      { name: 'Londres', country: 'Royaume-Uni', continent: 'Europe', description: 'Métropole cosmopolite', popularActivities: ['Big Ben', 'London Eye', 'Buckingham Palace'], hotelCount: 420, averagePrice: 180 },
      { name: 'Amsterdam', country: 'Pays-Bas', continent: 'Europe', description: 'Venise du Nord', popularActivities: ['Canaux', 'Musée Van Gogh', 'Maison d\'Anne Frank'], hotelCount: 190, averagePrice: 125 },
      { name: 'Berlin', country: 'Allemagne', continent: 'Europe', description: 'Ville historique et moderne', popularActivities: ['Mur de Berlin', 'Porte de Brandebourg', 'Île aux musées'], hotelCount: 235, averagePrice: 110 },
      { name: 'Lisbonne', country: 'Portugal', continent: 'Europe', description: 'Douceur de vivre', popularActivities: ['Tram 28', 'Tour de Belém', 'Alfama'], hotelCount: 150, averagePrice: 100 },
      { name: 'Prague', country: 'République tchèque', continent: 'Europe', description: 'Ville aux cent clochers', popularActivities: ['Pont Charles', 'Château de Prague', 'Horloge astronomique'], hotelCount: 165, averagePrice: 105 },
      { name: 'Athènes', country: 'Grèce', continent: 'Europe', description: 'Berceau de la civilisation', popularActivities: ['Acropole', 'Parthénon', 'Plaka'], hotelCount: 140, averagePrice: 95 },
      // ASIE
      { name: 'Tokyo', country: 'Japon', continent: 'Asie', description: 'Métropole futuriste', popularActivities: ['Shibuya', 'Senso-ji', 'Temple Meiji'], hotelCount: 198, averagePrice: 180 },
      { name: 'Bangkok', country: 'Thaïlande', continent: 'Asie', description: 'Capitale exotique', popularActivities: ['Palais royal', 'Marchés flottants', 'Wat Pho'], hotelCount: 275, averagePrice: 90 },
      { name: 'Singapour', country: 'Singapour', continent: 'Asie', description: 'Jardin futuriste', popularActivities: ['Gardens by the Bay', 'Marina Bay Sands', 'Sentosa'], hotelCount: 210, averagePrice: 160 },
      { name: 'Dubaï', country: 'Émirats arabes unis', continent: 'Asie', description: 'Cité du luxe', popularActivities: ['Burj Khalifa', 'Dubai Mall', 'Désert'], hotelCount: 350, averagePrice: 220 },
      { name: 'Séoul', country: 'Corée du Sud', continent: 'Asie', description: 'Dynamisme et tradition', popularActivities: ['Palais Gyeongbokgung', 'Myeongdong', 'Tour N Seoul'], hotelCount: 180, averagePrice: 120 },
      { name: 'Pékin', country: 'Chine', continent: 'Asie', description: 'Cité interdite', popularActivities: ['Cité interdite', 'Grande Muraille', 'Temple du Ciel'], hotelCount: 310, averagePrice: 110 },
      { name: 'Hanoi', country: 'Vietnam', continent: 'Asie', description: 'Charme colonial', popularActivities: ['Vieux quartier', 'Lac Hoan Kiem', 'Mausolée Hô Chi Minh'], hotelCount: 125, averagePrice: 70 },
      { name: 'Kuala Lumpur', country: 'Malaisie', continent: 'Asie', description: 'Tours jumelles', popularActivities: ['Petronas Towers', 'Batu Caves', 'Bukit Bintang'], hotelCount: 160, averagePrice: 85 },
      { name: 'Mumbai', country: 'Inde', continent: 'Asie', description: 'Bollywood et Porte de l\'Inde', popularActivities: ['Gateway of India', 'Marine Drive', 'Temples'], hotelCount: 190, averagePrice: 100 },
      // AFRIQUE
      { name: 'Marrakech', country: 'Maroc', continent: 'Afrique', description: 'Perle du sud', popularActivities: ['Médina', 'Jardin Majorelle', 'Place Jemaa el-Fna'], hotelCount: 150, averagePrice: 110 },
      { name: 'Le Caire', country: 'Égypte', continent: 'Afrique', description: 'Ville des pharaons', popularActivities: ['Pyramides', 'Sphinx', 'Musée égyptien'], hotelCount: 187, averagePrice: 130 },
      { name: 'Le Cap', country: 'Afrique du Sud', continent: 'Afrique', description: 'Entre montagne et océan', popularActivities: ['Table Mountain', 'Cape of Good Hope', 'Robben Island'], hotelCount: 200, averagePrice: 140 },
      { name: 'Tunis', country: 'Tunisie', continent: 'Afrique', description: 'Méditerranée et Carthage', popularActivities: ['Site de Carthage', 'Sidi Bou Saïd', 'Médina'], hotelCount: 95, averagePrice: 80 },
      { name: 'Nairobi', country: 'Kenya', continent: 'Afrique', description: 'Safari et nature', popularActivities: ['Parc national', 'Giraffe Centre', 'David Sheldrick'], hotelCount: 110, averagePrice: 120 },
      { name: 'Zanzibar', country: 'Tanzanie', continent: 'Afrique', description: 'Île aux épices', popularActivities: ['Stone Town', 'Plages', 'Prison Island'], hotelCount: 85, averagePrice: 150 },
      { name: 'Dakar', country: 'Sénégal', continent: 'Afrique', description: 'Culture et teranga', popularActivities: ['Île de Gorée', 'Monument de la Renaissance', 'Plages'], hotelCount: 70, averagePrice: 90 },
      { name: 'Casablanca', country: 'Maroc', continent: 'Afrique', description: 'Ville moderne', popularActivities: ['Hassan II Mosque', 'Corniche', 'Médina'], hotelCount: 130, averagePrice: 100 }
    ];
    this.destinations.sort((a, b) => a.country.localeCompare(b.country) || a.name.localeCompare(b.name));
  }

  filterByContinent(continent: string): void {
    this.selectedContinent = continent;
  }

  get filteredDestinationsByContinent(): any[] {
    return this.destinations.filter(d => d.continent === this.selectedContinent);
  }

  viewOffers(destination: any): void {
    this.router.navigate(['/search'], {
      queryParams: {
        destination: destination.name,
        checkIn: this.searchData.checkIn,
        checkOut: this.searchData.checkOut,
        adults: this.searchData.adults,
        children: this.searchData.children,
        rooms: this.searchData.rooms,
        type: 'hotel'
      }
    });
  }

  onDestinationSearch(event: any): void {
    const searchTerm = event.target.value;
    if (searchTerm && searchTerm.trim().length > 0) {
      this.filteredDestinations = this.destinations.filter(dest =>
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
      this.showSuggestions = this.filteredDestinations.length > 0;
    } else {
      this.filteredDestinations = [];
      this.showSuggestions = false;
    }
  }

  selectDestination(destination: any): void {
    this.searchData.destination = destination.name;
    this.filteredDestinations = [];
    this.showSuggestions = false;
  }

  hideSuggestions(): void {
    setTimeout(() => { this.showSuggestions = false; }, 200);
  }

  search(): void {
    this.dateError = null;
    if (!this.searchData.checkIn || !this.searchData.checkOut) {
      this.dateError = 'Veuillez sélectionner les dates d\'arrivée et de départ.';
      return;
    }
    const checkInDate = new Date(this.searchData.checkIn);
    const checkOutDate = new Date(this.searchData.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (checkInDate < today) {
      this.dateError = 'La date d\'arrivée ne peut pas être dans le passé.';
      return;
    }
    if (checkOutDate <= checkInDate) {
      this.dateError = 'La date de départ doit être postérieure à la date d\'arrivée.';
      return;
    }
    const cityOnly = this.searchData.destination.split(',')[0].trim();
    this.router.navigate(['/search'], {
      queryParams: {
        destination: cityOnly,
        checkIn: this.searchData.checkIn,
        checkOut: this.searchData.checkOut,
        adults: this.searchData.adults,
        children: this.searchData.children,
        rooms: this.searchData.rooms,
        type: 'hotel'
      }
    });
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getReviewStars(rating: number): { full: number; empty: number } {
    const full = Math.floor(rating);
    const empty = 5 - full;
    return { full, empty };
  }

  trackByDestinationName(index: number, destination: any): string { return destination?.name + destination?.country || index.toString(); }
  trackByReviewName(index: number, review: any): string { return review?.name || index.toString(); }
}