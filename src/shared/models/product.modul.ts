export interface Product {
  name: string;
  price: number;
  description?: string;
  quantity: number;
  image?: string;
  selected: boolean;
  stars: number;
  reviews: number;
}

export interface Sizes {
  size: string;
}
