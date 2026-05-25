export type ProductCategory = 'EV' | 'Battery' | 'Appliances' | 'Industrial' | 'Solar';

export interface Product {
  id: number;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  description: string;
  images: string[];
  rating: number;
  specs: Record<string, string>;
  inStock: boolean;
  isNew?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: { productId: number; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  createdAt: Date;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  productId?: number;
  message: string;
  createdAt: Date;
  read: boolean;
}
