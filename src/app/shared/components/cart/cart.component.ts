import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cart } from 'src/app/models/cart.model';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cart: Cart;
  total: number;
  token: string;

  constructor(private cartService: CartService, private router: Router) {}

  async ngOnInit() {
    this.cart = this.cartService.getCart();
    this.total = this.cartService.getTotal();
    this.token = await this.cartService.getToken();
  }

  removeFromCart(product: Product): void {
    this.cartService.removeFromCart(product);
    this.total = this.cartService.getTotal();
  }

  async updateQuantity(product: Product, quantity: number): Promise<void> {
    this.cartService.updateQuantity(product, quantity);
    this.total = this.cartService.getTotal();
    this.token = await this.cartService.getToken();
  }
}
