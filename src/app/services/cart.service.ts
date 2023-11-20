import { Injectable } from '@angular/core';
import { Cart } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Cart = { products: [] };

  addToCart(product: Product) {
    this.cart.products.push(product);
  }

  removeFromCart(product: Product) {
    const index = this.cart.products.indexOf(product);
    if (index > -1) {
      this.cart.products.splice(index, 1);
    }
  }

  getTotal(): number {
    return this.cart.products.reduce((total, product) => total + product.price, 0);
  }

  getCart(): Cart {
    return this.cart;
  }
}