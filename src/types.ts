export type PageRoute = 'landing' | 'app' | 'contact' | 'ngo-portal';

export type LocalLanguage = 'fr' | 'baoule' | 'dioula' | 'bete';

export type OrgType = 'ONG Environnementale' | 'Coopérative Faitière' | 'Institution Publique / ANADER' | 'Bailleur & Centre de Recherche';

export interface PartnerAccount {
  id: string;
  orgName: string;
  orgType: OrgType;
  contactPerson: string;
  email: string;
  phone: string;
  region: string;
  producerCount: number;
  registrationDate: string;
  badgeColor: string;
  logoEmoji: string;
  description?: string;
}

export interface GPSPoint {
  id: string;
  lat: number;
  lng: number;
  label: string;
  elevationMeters?: number;
}

export interface PlantedTreeMarker {
  id: string;
  species: string;
  category: 'ombrage' | 'cacao' | 'fruitier' | 'fertilite';
  xPercent: number; // 0-100% position on parcel map
  yPercent: number; // 0-100% position on parcel map
  ageYears: number;
  shadeContribution: number; // percentage
  healthStatus: 'optimal' | 'bon' | 'vigilance';
}

export interface ParcelCartography {
  parcelName: string;
  centerCoordinates: { lat: number; lng: number };
  boundaryPoints: GPSPoint[];
  areaHectares: number;
  polygonGeoJson?: string;
  altitudeMeters: number;
  shadePercentage: number;
  treesCount: {
    cacao: number;
    shadeTrees: number;
    foodCrops: number;
  };
  plantedTrees: PlantedTreeMarker[];
  rdueComplianceStatus: 'Conforme RDUE (Zéro Déforestation)' | 'Audit en cours' | 'Reboisement requis';
  waterwayDistance: string;
  soilSlope: string;
  satelliteImageOverlay?: string;
}

export interface FarmerProfile {
  name: string;
  phone: string;
  farmerCardCode: string; // Code unique de la Carte de Planteur (ex: CI-CCC-2024-88492)
  coopMatricule: string;
  region: string;
  pin: string;
  isRegistered: boolean;
  photoUrl?: string;
  cardIssueDate?: string;
  qrCodeData?: string;
  cartography?: ParcelCartography;
}

export interface SupervisedProducer {
  id: string;
  farmerCardCode: string; // Identifiant officiel de la Carte de Planteur (format Conseil Café-Cacao)
  name: string;
  photoUrl: string; // Photo authentique du producteur
  village: string;
  region?: string;
  size: string;
  treesAge: string;
  shade: string;
  shadeLevel: 'optimal' | 'intermediate' | 'warning';
  status: string;
  crops: string[];
  lastAudit: string;
  phone: string;
  cooperative?: string;
  cardStatus?: 'Active & Vérifiée' | 'En cours de renouvellement';
  cartography: ParcelCartography; // Cartographie satellite & GPS détaillée du champ
}

export interface FarmParcel {
  id: string;
  name: string;
  region: string;
  sizeHectares: number;
  cocoaTreeAgeYears: number;
  shadeLevel: 'Faible' | 'Moyen' | 'Important';
  soilType: 'Sablo-argileux' | 'Argileux' | 'Humifère' | 'Latéritique';
  hasWaterSource: boolean;
  recommendedCrops: RecommendedCrop[];
  healthScore: number; // 0 to 100
  shadeScore: number; // percentage
}

export interface RecommendedCrop {
  name: string;
  category: 'Cacao' | 'Vivrier' | 'Arbre d\'ombrage';
  icon: string;
  benefits: string;
  densityAdvice: string;
  waterNeed: 'Faible' | 'Moyen' | 'Élevé';
}

export interface AdviceItem {
  id: string;
  title: string;
  category: 'Fertilité' | 'Agroforesterie' | 'Diversification' | 'Taille';
  audioText: Record<LocalLanguage, string>;
  icon: string;
  isCompleted: boolean;
  dateAdded: string;
}

export interface ContactFormState {
  name: string;
  phone: string;
  email: string;
  organization: string;
  organizationType: 'producteur' | 'cooperative' | 'ong' | 'institution' | 'autre';
  message: string;
}

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastNotification {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  icon?: string;
}
