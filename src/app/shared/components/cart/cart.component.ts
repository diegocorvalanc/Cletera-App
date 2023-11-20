import { Component, OnInit } from '@angular/core';
import { Cart } from 'src/app/models/cart.model';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: Cart;
  total: number;

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.cart = this.cartService.getCart();
    this.total = this.cartService.getTotal();
  }

  removeFromCart(product: Product): void {
    this.cartService.removeFromCart(product);
    this.total = this.cartService.getTotal();
  }

  updateQuantity(product: Product, quantity: number): void {
    this.cartService.updateQuantity(product, quantity);
    this.total = this.cartService.getTotal();
  }
}