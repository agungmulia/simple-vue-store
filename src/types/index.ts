export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  accessToken?: string;
}

export interface Cart {
  id: number;
  userId: number;
  products: Product[];
  total: number;
  totalProducts: number;
  totalQuantity: number;
  discountedTotal: number;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  thumbnail: string;
  rating: number;
  stock: number;
  tags: string[];
  discountPercentage: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}
