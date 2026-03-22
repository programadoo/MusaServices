export interface Product {
  id: string | number;
  name: string;
  price: number;
  description?: string;
  image?: string;
  aiImage: string;
  selected: boolean;
  stars: number;
  reviews: number;
  
  // Agrega estas propiedades para la IA:
  aiCategory?: "dresses" | "upper_body" | "lower_body"; 
  aiDescription?: string;
}