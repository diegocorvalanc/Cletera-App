export interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
  stock: number;
  rating: number;
  quantity: number;
  tname: string; // Nombre de la tienda
  creatorUid: string; // UID del creador del producto
}
