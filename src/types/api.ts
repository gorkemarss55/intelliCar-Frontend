

export type FuelType = 'GASOLINE' | 'DIESEL' | 'HYBRID' | 'ELECTRIC'
export type Transmission = 'MANUAL' | 'AUTOMATIC'
export type CarStatus = 'ACTIVE' | 'PENDING_REVIEW' | 'SOLD' | 'INACTIVE'
export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'
export type UserRole = 'BUYER' | 'SELLER' | 'ADMIN'

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

// ---------- Auth & kullanıcı ----------
export interface LoginRequest { email: string; password: string }
export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  role: UserRole
}
export interface AuthResponse {
  accessToken: string
  refreshToken: string
  userId: string
  email: string
  role: UserRole
}
export interface UserResponse {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: UserRole
  createdAt: string
}
export interface SellerSummary {
  id: string
  firstName: string
  lastName: string
  phone: string
}

// ---------- İlanlar ----------
export interface CarImage {
  id: string
  imageUrl: string
  isPrimary: boolean
}
export interface CarImageRequest { imageUrl: string; isPrimary: boolean }

export interface CarListItem {
  id: string
  brand: string
  model: string
  year: number
  mileage: number
  price: number
  fuelType: FuelType
  transmission: Transmission
  city: string
  primaryImageUrl: string | null
  createdAt: string
}

export type MyCarListItem = CarListItem & { status?: CarStatus }

export interface CarDetail {
  id: string
  brand: string
  model: string
  year: number
  mileage: number
  price: number
  fuelType: FuelType
  transmission: Transmission
  city: string
  description: string
  status: CarStatus
  viewCount: number
  seller: SellerSummary
  images: CarImage[]
  createdAt: string
}
export interface CarCreateRequest {
  brand: string
  model: string
  year: number
  mileage: number
  price: number
  fuelType: FuelType
  transmission: Transmission
  city: string
  description: string
  images: CarImageRequest[]
}
export interface CarUpdateRequest {
  price: number
  mileage: number
  description: string
  status: CarStatus
}
export interface CarListParams {
  brand?: string
  model?: string
  city?: string
  minPrice?: number
  maxPrice?: number
  minYear?: number
  maxYear?: number
  fuelType?: FuelType
  transmission?: Transmission
  page?: number
  size?: number
  sort?: string
}

// ---------- Teklifler ----------
export interface OfferCreateRequest { carId: string; offeredPrice: number; note?: string }
export interface OfferResponse {
  id: string
  carId: string
  carTitle: string
  offeredPrice: number
  status: OfferStatus
  note: string | null
  buyer: UserResponse
  createdAt: string
}

// ---------- Yapay zekâ ----------
export interface BudgetRecommendationRequest {
  budget: number
  preferences?: string
  fuelType?: FuelType
  transmission?: Transmission
  city?: string
  limit?: number
}
export interface RecommendedCar {
  rank: number
  score: number
  carId: string
  brand: string
  model: string
  year: number
  mileage: number
  price: number
  fuelType: FuelType
  transmission: Transmission
  city: string
  primaryImageUrl: string | null
  reason: string
  pros: string[]
  cons: string[]
}
export interface BudgetRecommendationResponse {
  budget: number
  candidatesAnalyzed: number
  summary: string
  recommendations: RecommendedCar[]
}

export interface PriceEstimateRequest {
  brand: string
  model: string
  year: number
  mileage: number
  fuelType: FuelType
  transmission: Transmission
  city?: string
  description?: string
}
export type Confidence = 'LOW' | 'MEDIUM' | 'HIGH'
export interface PriceEstimate {
  minPrice: number
  suggestedPrice: number
  maxPrice: number
  currency: string
  confidence: Confidence
  aiAssisted: boolean
  explanation: string
  factors: string[]
  market: { comparablesCount: number; sameModelCount: number; min: number; median: number; max: number }
  comparables: { carId: string; brand: string; model: string; year: number; mileage: number; price: number; city: string }[]
  disclaimer: string
}
