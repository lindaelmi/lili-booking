import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Hotel {
  id: number;
  name: string;
  location: string;
  description: string;
  rating: number;
  pricePerNight: number;
  imageUrl: string;
  amenities: string[];
  continent: string;
  rooms?: Room[];
  reviews?: Review[];
}

export interface Room {
  id: number;
  hotelId: number;
  type: string;
  description: string;
  price: number;
  capacity: number;
  features: string[];
  available: boolean;
}

export interface Review {
  id: number;
  hotelId: number;
  author: string;
  date: string;
  rating: number;
  comment: string;
  avatar: string;
}

export interface AvailabilityRequest {
  hotelId: number;
  roomType: string;
  checkin: string;
  checkout: string;
  guests: number;
}

export interface AvailabilityResponse {
  available: boolean;
  message: string;
  totalPrice: number;
  nights: number;
}

export interface SearchFilters {
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  continent?: string;
  checkin?: string;
  checkout?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private apiUrl = 'http://localhost:3000/api'; // URL de votre backend NestJS

  constructor(private http: HttpClient) { }

  /**
   * Récupère tous les hôtels
   */
  getAllHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.apiUrl}/hotels`);
  }

  /**
   * Récupère un hôtel par son ID
   */
  getHotelById(id: number): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.apiUrl}/hotels/${id}`);
  }

  /**
   * Vérifie la disponibilité d'une chambre
   */
  checkAvailability(request: AvailabilityRequest): Observable<AvailabilityResponse> {
    return this.http.post<AvailabilityResponse>(`${this.apiUrl}/availability`, request);
  }

  /**
   * Récupère la liste des continents
   */
  getContinents(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/continents`);
  }

  /**
   * Recherche d'hôtels avec filtres
   */
  searchHotels(filters: SearchFilters): Observable<Hotel[]> {
    return this.http.post<Hotel[]>(`${this.apiUrl}/hotels/search`, filters);
  }

  /**
   * Récupère les chambres d'un hôtel
   */
  getHotelRooms(hotelId: number): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/hotels/${hotelId}/rooms`);
  }

  /**
   * Récupère les avis d'un hôtel
   */
  getHotelReviews(hotelId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/hotels/${hotelId}/reviews`);
  }

  /**
   * Données de secours pour le développement
   */
  getFallbackHotels(): Hotel[] {
    return [
      {
        id: 1,
        name: 'Hôtel de Luxe Paris',
        location: 'Paris, France',
        description: 'Un hôtel de luxe au cœur de Paris avec une vue magnifique sur la Tour Eiffel.',
        rating: 4.8,
        pricePerNight: 300,
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        amenities: ['Wi-Fi gratuit', 'Piscine', 'Spa', 'Restaurant'],
        continent: 'Europe'
      },
      {
        id: 2,
        name: 'Resort Tropical Bali',
        location: 'Bali, Indonésie',
        description: 'Une expérience de resort tropical avec des villas privées et plage privée.',
        rating: 4.9,
        pricePerNight: 450,
        imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        amenities: ['Plage privée', 'Spa', 'Wi-Fi gratuit', 'Petit-déjeuner inclus'],
        continent: 'Asie'
      },
      {
        id: 3,
        name: 'New York Skyline Hotel',
        location: 'New York, USA',
        description: 'Hôtel moderne avec vue imprenable sur Manhattan et Central Park.',
        rating: 4.7,
        pricePerNight: 400,
        imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        amenities: ['Wi-Fi gratuit', 'Salle de sport', 'Room service 24h/24', 'Bar rooftop'],
        continent: 'Amérique'
      },
      {
        id: 4,
        name: 'Safari Lodge Kenya',
        location: 'Nairobi, Kenya',
        description: 'Lodge de luxe au cœur de la réserve naturelle pour une expérience safari unique.',
        rating: 4.6,
        pricePerNight: 350,
        imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        amenities: ['Safari inclus', 'Piscine naturelle', 'Restaurant gastronomique', 'Excursions guidées'],
        continent: 'Afrique'
      },
      {
        id: 5,
        name: 'Beach Resort Sydney',
        location: 'Sydney, Australie',
        description: 'Resort face à la plage avec accès direct à la mer et vue sur l\'opéra.',
        rating: 4.8,
        pricePerNight: 420,
        imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        amenities: ['Plage privée', 'Spa', 'Sports nautiques', 'Club pour enfants'],
        continent: 'Océanie'
      },
      {
        id: 6,
        name: 'Alpine Chalet Suisse',
        location: 'Zermatt, Suisse',
        description: 'Chalet traditionnel suisse avec vue sur le Cervin et accès aux pistes de ski.',
        rating: 4.9,
        pricePerNight: 500,
        imageUrl: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        amenities: ['Spa wellness', 'Sauna', 'Restaurant étoilé', 'Accès direct pistes'],
        continent: 'Europe'
      }
    ];
  }

  /**
   * Données de secours pour les détails d'un hôtel
   */
  getFallbackHotelDetails(id: number): Hotel {
    const fallbackHotels: { [key: number]: Hotel } = {
      1: {
        id: 1,
        name: 'Hôtel de Luxe Paris',
        location: 'Paris, France',
        description: 'Un hôtel de luxe 5 étoiles situé au cœur de Paris, offrant une vue imprenable sur la Tour Eiffel et les Champs-Élysées. Avec un service exceptionnel et des équipements de première classe, cet hôtel promet un séjour inoubliable.',
        rating: 4.8,
        pricePerNight: 300,
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        amenities: ['Wi-Fi gratuit', 'Piscine', 'Spa', 'Restaurant', 'Room service 24h/24', 'Salle de sport', 'Parking', 'Climatisation'],
        continent: 'Europe',
        rooms: [
          {
            id: 1,
            hotelId: 1,
            type: 'Chambre Supérieure',
            description: 'Chambre spacieuse avec vue sur la ville',
            price: 300,
            capacity: 2,
            features: ['Lit King Size', 'TV écran plat', 'Minibar', 'Salle de bain privée'],
            available: true
          },
          {
            id: 2,
            hotelId: 1,
            type: 'Suite Junior',
            description: 'Suite avec salon séparé et vue Tour Eiffel',
            price: 450,
            capacity: 2,
            features: ['Lit King Size', 'Salon séparé', 'Terrasse privée', 'Jacuzzi'],
            available: true
          },
          {
            id: 3,
            hotelId: 1,
            type: 'Suite Présidentielle',
            description: 'Suite de luxe avec service de majordome',
            price: 800,
            capacity: 4,
            features: ['Deux chambres', 'Salon spacieux', 'Cuisine équipée', 'Service majordome'],
            available: true
          }
        ],
        reviews: [
          {
            id: 1,
            hotelId: 1,
            author: 'Marie Dubois',
            date: '15/01/2024',
            rating: 5,
            comment: 'Séjour exceptionnel ! Le service était impeccable et la vue sur la Tour Eiffel était à couper le souffle.',
            avatar: 'M'
          },
          {
            id: 2,
            hotelId: 1,
            author: 'Thomas Martin',
            date: '10/01/2024',
            rating: 4,
            comment: 'Très bel hôtel avec des équipements modernes. Petit déjeuner délicieux.',
            avatar: 'T'
          },
          {
            id: 3,
            hotelId: 1,
            author: 'Sophie Leroy',
            date: '05/01/2024',
            rating: 5,
            comment: 'L\'expérience parfaite pour un week-end romantique. Nous reviendrons !',
            avatar: 'S'
          }
        ]
      },
      2: {
        id: 2,
        name: 'Resort Tropical Bali',
        location: 'Bali, Indonésie',
        description: 'Une expérience de resort tropical avec des villas privées et plage privée. Profitez du soleil, de la mer et du sable fin dans ce paradis tropical.',
        rating: 4.9,
        pricePerNight: 450,
        imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        amenities: ['Plage privée', 'Spa', 'Wi-Fi gratuit', 'Petit-déjeuner inclus', 'Piscine à débordement', 'Yoga matinal', 'Excursions incluses'],
        continent: 'Asie',
        rooms: [
          {
            id: 4,
            hotelId: 2,
            type: 'Villa Standard',
            description: 'Villa avec terrasse privée et jardin tropical',
            price: 450,
            capacity: 2,
            features: ['Lit double', 'Terrasse privée', 'Salle de bain extérieure', 'Cuisinette'],
            available: true
          },
          {
            id: 5,
            hotelId: 2,
            type: 'Villa Deluxe',
            description: 'Villa avec piscine privée et vue sur l\'océan',
            price: 650,
            capacity: 4,
            features: ['Deux chambres', 'Piscine privée', 'Cuisine équipée', 'Service quotidien'],
            available: true
          }
        ],
        reviews: [
          {
            id: 4,
            hotelId: 2,
            author: 'Jean Dupont',
            date: '20/01/2024',
            rating: 5,
            comment: 'Un véritable paradis sur terre ! Les villas sont magnifiques et le personnel adorable.',
            avatar: 'J'
          }
        ]
      }
    };

    return fallbackHotels[id] || fallbackHotels[1];
  }

  /**
   * Simule une vérification de disponibilité locale (fallback)
   */
  simulateLocalAvailability(request: AvailabilityRequest): AvailabilityResponse {
    // Simulation simple : 80% de chance d'être disponible
    const available = Math.random() > 0.2;
    
    const checkinDate = new Date(request.checkin);
    const checkoutDate = new Date(request.checkout);
    const nights = Math.ceil((checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 3600 * 24));
    
    // Prix fictif basé sur le type de chambre
    const basePrice = request.roomType.includes('Suite') ? 500 : 
                     request.roomType.includes('Villa') ? 600 : 
                     request.roomType.includes('Deluxe') ? 700 : 300;
    
    const totalPrice = basePrice * nights;
    
    return {
      available,
      message: available 
        ? `Chambre disponible pour ${nights} nuits` 
        : 'Désolé, cette chambre n\'est pas disponible pour les dates sélectionnées.',
      totalPrice,
      nights
    };
  }
}