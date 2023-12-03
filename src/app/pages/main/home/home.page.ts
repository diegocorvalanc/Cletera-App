import { Component, OnInit, inject } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { orderBy } from 'firebase/firestore';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CartComponent } from 'src/app/shared/components/cart/cart.component';
import { CartService } from 'src/app/services/cart.service';
import { ModalController } from '@ionic/angular';
import { ProductDetailComponent } from 'src/app/shared/components/product-detail/product-detail.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  products: Product[] = [];
  loading: boolean = false;

  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private cartService: CartService,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  rateProduct(product: Product, rating: number) {
    // Asignar el rating al producto
    product.rating = rating;

    // Guardar el rating en Firestore
    this.saveRatingToFirestore(product.id, rating)
      .then(() => {
        console.log('Rating guardado en Firestore');
      })
      .catch((error) => {
        console.error('Error al guardar el rating en Firestore:', error);
        // Puedes manejar el error según tus necesidades
      });
  }

  private saveRatingToFirestore(
    productId: string,
    rating: number
  ): Promise<void> {
    // Actualizar el documento en Firestore con el nuevo rating
    const productRef = this.firestore.collection('Producto').doc(productId);
    return productRef.update({ rating });
  }

  // Datos de usuario
  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getProducts();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getProducts();
      event.target.complete();
    }, 1000);
  }

  getProducts() {
    let path = `Producto/`;

    this.loading = true;

    let query = [orderBy('stock', 'desc')];

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        console.log(res);
        this.products = res;

        this.loading = false;
        sub.unsubscribe();
      },
    });
  }

  async addProduct() {
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { product: null },
    });

    if (success) this.getProducts();
  }

  async updateProduct(product: Product) {
    const currentUser = this.user();

    if (
      currentUser.uid !== product.creatorUid &&
      currentUser.role !== 'Admin'
    ) {
      this.utilsSvc.presentToast({
        message: 'No tienes permiso para editar este producto.',
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
      return;
    }

    let success = await this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { product },
    });

    if (success) this.getProducts();
  }

  async confirmDeleteProduct(product: Product) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar Producto!',
      message: '¿Quieres eliminar este producto?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteProduct(product);
          },
        },
      ],
    });
  }

  async deleteProduct(product: Product) {
    // Obtén el usuario actual
    const currentUser = this.user();

    if (
      currentUser.uid === product.creatorUid ||
      currentUser.role === 'Admin'
    ) {
      let path = `Producto/${product.id}`;

      const loading = await this.utilsSvc.loading();
      await loading.present();

      let imagePath = await this.firebaseSvc.getFilePath(product.image);
      await this.firebaseSvc.deleteFile(imagePath);

      this.firebaseSvc
        .deleteDocument(path)
        .then(async (res) => {
          this.products = this.products.filter((p) => p.id !== product.id);

          this.utilsSvc.presentToast({
            message: 'Producto eliminado exitosamente',
            duration: 1500,
            color: 'success',
            position: 'middle',
            icon: 'checkmark-circle-outline',
          });
        })
        .catch((error) => {
          console.log(error);

          this.utilsSvc.presentToast({
            message: error.message,
            duration: 2500,
            color: 'primary',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    } else {
      this.utilsSvc.presentToast({
        message: 'No tienes permiso para eliminar este producto.',
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    }
  }

  // Carrito de compras
  addToCart(product: Product) {
    this.cartService.addToCart(product);

    this.utilsSvc.presentModal({
      component: CartComponent,
    });
  }

  navigateToProductList() {
    this.router.navigate(['/product-list']);
  }

  // Detalle de producto
  async openProductDetail(product: any) {
    const modal = await this.modalController.create({
      component: ProductDetailComponent,
      componentProps: {
        product: product,
      },
    });
    return await modal.present();
  }
}
