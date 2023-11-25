import { Injectable } from '@angular/core';
import { Cart } from '../models/cart.model';
import { Product } from '../models/product.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: Cart = { products: [] };

  constructor(private http: HttpClient) {}

  addToCart(product: Product) {
    const existingProduct = this.cart.products.find((p) => p.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      product.quantity = 1;
      this.cart.products.push(product);
    }
  }

  updateQuantity(product: Product, quantity: number): void {
    const existingProduct = this.cart.products.find((p) => p.id === product.id);

    if (existingProduct) {
      if (quantity < 1) {
        alert('La cantidad no puede ser menor a 1.');
        existingProduct.quantity = 1; // Establecer la cantidad a 1 si es menor a 1
      } else if (quantity > product.stock) {
        alert('No puedes agregar más de este producto. Stock insuficiente.');
        existingProduct.quantity = product.stock; // Revertir a la cantidad anterior
      } else {
        existingProduct.quantity = quantity;
      }
    }
  }

  removeFromCart(product: Product) {
    const index = this.cart.products.indexOf(product);
    if (index > -1) {
      this.cart.products.splice(index, 1);
    }
  }

  getTotal(): number {
    return this.cart.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  }

  getOrderId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  getSessionId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  getReturnUrl(): string {
    return window.location.origin + '/main/commit';
  }

  async getToken(): Promise<string> {
    const url = 'http://localhost:4000/generar_token';
    const body = {
      orderId: this.getOrderId(),
      sessionId: this.getSessionId(),
      amount: this.getTotal(),
      returnUrl: this.getReturnUrl(),
    };
    const response = await this.http.post<any>(url, body).toPromise();
    return response.token;
  }

  getCart(): Cart {
    return this.cart;
  }

  getPaymentDetails() {
    return {
      orderId: this.getOrderId(),
      sessionId: this.getSessionId(),
      amount: this.getTotal(),
      returnUrl: this.getReturnUrl(),
    };
  }
}
