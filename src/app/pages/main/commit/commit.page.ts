import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-commit',
  templateUrl: './commit.page.html',
  styleUrls: ['./commit.page.scss'],
})
export class CommitPage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  orderId: string;
  sessionId: string;
  amount: number;

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit() {
    let data = {};
    this.route.queryParamMap.subscribe(async (queryParams) => {
      data['queryParams'] = queryParams.keys.reduce((obj, key) => {
        obj[key] = queryParams.get(key);
        return obj;
      }, {});

      // Obtener datos de la orden de compra
      const paymentDetails = this.cartService.getPaymentDetails();
      this.orderId = paymentDetails.orderId;
      this.sessionId = paymentDetails.sessionId;
      this.amount = paymentDetails.amount;

      data['paymentDetails'] = paymentDetails;

      // Almacenar `data` de la manera que prefieras
      console.log(data); // Por ahora, solo lo estamos registrando en la consola
    });
  }

  //Flujos:
  //1. Flujo normal (OK): solo llega token_ws
  //2. Timeout (más de 10 minutos en el formulario de Transbank): llegan TBK_ID_SESION y TBK_ORDEN_COMPRA
  //3. Pago abortado (con botón anular compra en el formulario de Webpay): llegan TBK_TOKEN, TBK_ID_SESION, TBK_ORDEN_COMPRA
  //4. Caso atipico: llega todos token_ws, TBK_TOKEN, TBK_ID_SESION, TBK_ORDEN_COMPRA
}
