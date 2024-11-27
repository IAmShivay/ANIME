export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'anime' | 'science' | 'accessories';
  subCategory: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}