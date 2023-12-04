import { Component, OnInit, inject } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CartService } from 'src/app/services/cart.service';
import { ModalController } from '@ionic/angular';
import { ProductDetailComponent } from 'src/app/shared/components/product-detail/product-detail.component';
import { orderBy } from 'firebase/firestore';

@Component({
  selector: 'app-misproductos',
  templateUrl: './misproductos.page.html',
  styleUrls: ['./misproductos.page.scss'],
})
export class MisproductosPage implements OnInit {
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

  // Datos de usuario
  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    try {
      const currentUser = this.user();

      if (currentUser.role === 'Cletero') {
        this.router.navigate(['/main/home']);
        this.utilsSvc.presentToast({
          message:
            'Usuario Cletero no tiene permiso para usar la vista <Mis Productos>.',
          duration: 1000,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      }
    } catch (error) {
      console.error('Error al verificar el rol del usuario:', error);
    }
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

    const currentUser = this.user();

    let query = [orderBy('stock', 'desc')];

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        console.log(res);

        // Filtra los productos por creatorUid
        this.products = res.filter(
          (product) => product.creatorUid === currentUser.uid
        );

        this.loading = false;
        sub.unsubscribe();
      },
    });
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
