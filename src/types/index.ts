// Product Types
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  subCategory: string;
  tags: string[];
  variants: ProductVariant[];
  inventory: {
    quantity: number;
    trackQuantity: boolean;
    allowBackorder: boolean;
  };
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  status: 'active' | 'draft' | 'archived';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  name: string;
  price?: number;
  comparePrice?: number;
  sku?: string;
  inventory: {
    quantity: number;
    trackQuantity: boolean;
  };
  options: {
    size?: string;
    color?: string;
    material?: string;
  };
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  parentCategory?: string;
  status: 'active' | 'inactive';
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  avatar?: string;
  addresses: Address[];
  phone?: string;
  dateOfBirth?: Date;
  preferences: {
    newsletter: boolean;
    notifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

// Order Types
export interface Order {
  _id: string;
  orderNumber: string;
  user: string | User;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: {
    type: 'razorpay' | 'cod';
    transactionId?: string;
    status: 'pending' | 'completed' | 'failed';
  };
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  pricing: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
  tracking?: {
    carrier: string;
    trackingNumber: string;
    url?: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  product: string | Product;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  total: number;
}

// Review Types
export interface Review {
  _id: string;
  product: string | Product;
  user: string | User;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

// Cart Types
export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  price: number;
}

// Policy Types
export interface Policy {
  _id: string;
  type: 'privacy' | 'terms' | 'refund' | 'shipping';
  title: string;
  content: string;
  lastUpdated: Date;
  version: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface CheckoutForm {
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: 'razorpay' | 'cod';
  notes?: string;
}