// Simple product interface for static data
interface SimpleProduct {
  _id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  subCategory: string;
  tags: string[];
  variants: any[];
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

export const products: SimpleProduct[] = [
  {
    _id: '1',
    name: 'Attack on Titan Scout Regiment Jacket',
    price: 89.99,
    description: 'Premium quality Scout Regiment jacket with embroidered Wings of Freedom',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'],
    category: 'anime',
    subCategory: 'outerwear',
    tags: ['anime', 'jacket', 'attack-on-titan'],
    variants: [],
    inventory: {
      quantity: 10,
      trackQuantity: true,
      allowBackorder: false
    },
    seo: {
      title: 'Attack on Titan Scout Regiment Jacket',
      description: 'Premium quality Scout Regiment jacket with embroidered Wings of Freedom'
    },
    status: 'active',
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    name: 'Demon Slayer Katana Collection',
    price: 149.99,
    description: 'Handcrafted replica of Tanjiro\'s Nichirin Blade',
    images: ['https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=800'],
    category: 'anime',
    subCategory: 'collectibles',
    tags: ['anime', 'katana', 'demon-slayer'],
    variants: [],
    inventory: {
      quantity: 5,
      trackQuantity: true,
      allowBackorder: false
    },
    seo: {
      title: 'Demon Slayer Katana Collection',
      description: 'Handcrafted replica of Tanjiro\'s Nichirin Blade'
    },
    status: 'active',
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '3',
    name: 'My Hero Academia Plus Ultra Hoodie',
    price: 59.99,
    description: 'Comfortable hoodie featuring UA High School emblem',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'],
    category: 'anime',
    subCategory: 'clothing',
    tags: ['anime', 'hoodie', 'my-hero-academia'],
    variants: [],
    inventory: {
      quantity: 15,
      trackQuantity: true,
      allowBackorder: false
    },
    seo: {
      title: 'My Hero Academia Plus Ultra Hoodie',
      description: 'Comfortable hoodie featuring UA High School emblem'
    },
    status: 'active',
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '4',
    name: 'Molecular Structure T-Shirt',
    price: 29.99,
    description: 'Cool molecular design printed with eco-friendly ink',
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800'],
    category: 'science',
    subCategory: 't-shirts',
    tags: ['science', 't-shirt', 'molecular'],
    variants: [],
    inventory: {
      quantity: 20,
      trackQuantity: true,
      allowBackorder: false
    },
    seo: {
      title: 'Molecular Structure T-Shirt',
      description: 'Cool molecular design printed with eco-friendly ink'
    },
    status: 'active',
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '5',
    name: 'Anime Art Collection Backpack',
    price: 49.99,
    description: 'Stylish backpack with original anime artwork',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'],
    category: 'accessories',
    subCategory: 'bags',
    tags: ['accessories', 'backpack', 'anime'],
    variants: [],
    inventory: {
      quantity: 8,
      trackQuantity: true,
      allowBackorder: false
    },
    seo: {
      title: 'Anime Art Collection Backpack',
      description: 'Stylish backpack with original anime artwork'
    },
    status: 'active',
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];