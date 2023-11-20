import { Component, Input, OnInit, inject } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() title!: string;
  @Input() role!: string;
  @Input() backButton!: string;
  @Input() isModal!: boolean;
  @Input() showMenu!: boolean;

  products: Product[] = [];

  utilsSvc = inject(UtilsService);
   // Datos de usuario
  user(): User{
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ngOnInit() {}

    // // Carrito de compras
    // addToCart(product: Product) {
    //   this.utilsSvc.presentModal({
    //     component: CartComponent
    //   })
    // }

  dismissModal(){
    this.utilsSvc.dismissModal();
  }

}
