export enum UserRole {
  MANAGER = 'MANAGER',
  SELLER = 'SELLER'
}

export interface User {
  id: string; // UUID
  name: string;
  role: UserRole;
  email?: string;
  pin: string;
}

export interface Drink {
  id: string; // UUID
  name: string;
  price: number; // FCFA
  stock: number;
  image: string;
  category: string;
  isActive: boolean;
}

export interface CartItem {
  drinkId: string;
  quantity: number;
  unitPrice: number;
  name: string;
  image: string;
}

export type SaleStatus = 'COMPLETED' | 'CANCELLED';

export interface Sale {
  id: string; // UUID
  date: string; // ISO 8601
  total: number;
  sellerId: string;
  sellerName: string;
  items: CartItem[];
  status: SaleStatus;
}

export interface StockMovement {
  id: string; // UUID
  drinkId: string;
  type: 'IN' | 'OUT';
  quantity: number;
  date: string;
  reason: string;
  createdBy?: string;
}