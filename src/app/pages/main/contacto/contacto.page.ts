import { Component, Input, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { Contacto } from 'src/app/models/contacto.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
})
export class ContactoPage implements OnInit {
  @Input() user: User;
  @Input() contacto: Contacto;
  options: string[] = [
    'Reparación de bicicletas',
    'Venta de bicicletas',
    'Accesorios para bicicletas',
    'Ropa y equipo ciclista',
    'Componentes y repuestos',
    'Talleres de personalización',
    'Asesoramiento y entrenamiento',
    'Servicios de mantenimiento',
    '(Otros servicios)',
  ];

  form = new FormGroup({
    name: new FormControl({ value: '', disabled: true }),
    email: new FormControl({ value: '', disabled: true }),
    telefono: new FormControl({ value: '', disabled: true }),
    mensaje: new FormControl('', [Validators.maxLength(500)]),
    option: new FormControl(''),
    otroRecomendacion: new FormControl({ value: '', disabled: true }),
    id: new FormControl(''),
  });

  constructor(
    @Inject(FirebaseService) private firebaseSvc: FirebaseService,
    @Inject(UtilsService) private utilsSvc: UtilsService
  ) {}

  ngOnInit() {
    this.getOptions();

    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.form.patchValue({
          name: user.displayName || '',
          email: user.email || '',
          telefono: '', // Dejamos el teléfono en blanco por ahora, lo actualizaremos después
          id: user.uid,
        });

        try {
          const userData = await this.firebaseSvc.getDocument(`users/${user.uid}`);
          // Actualizamos el teléfono si está disponible en Firestore
          this.form.patchValue({
            telefono: userData && userData['telefono'] !== undefined ? userData['telefono'] : '',
          });
        } catch (error) {
          console.error('Error al obtener datos del usuario desde Firestore:', error);
        }
      }
    });

    this.form.get('option').valueChanges.subscribe((selectedOption) => {
      if (selectedOption === '(Otros servicios)') {
        this.form.get('otroRecomendacion').enable();
      } else {
        this.form.get('otroRecomendacion').disable();
        this.form.get('otroRecomendacion').setValue('');
      }
    });
  }

  async getOptions() {
    const uid = this.user && this.user.uid ? this.user.uid : '';
    const docData = await this.firebaseSvc.getDocument(`users/${uid}`);
    this.options = docData && docData['option'] !== undefined ? docData['option'] : [];
  }

  async submitForm() {
    try {
      if (this.form.invalid) {
        console.error('Formulario no válido. Revise los campos.');
        return;
      }

      const { name, email, telefono, mensaje, option, otroRecomendacion, id } =
        this.form.value;

      // Validar que el teléfono tenga un valor definido y sea válido
      const telefonoValue = telefono !== undefined ? telefono : '';
      if (telefonoValue && (isNaN(Number(telefonoValue)) || telefonoValue.length !== 8)) {
        console.error('Número de teléfono no válido.');
        return;
      }

      // Obtener datos del usuario actual en Firestore
      const userData = await this.firebaseSvc.getDocument(`users/${id}`);

      const contactoData: Contacto = {
        id: id,
        name: userData && userData['name'] !== undefined ? userData['name'] : '',
        email: userData && userData['email'] !== undefined ? userData['email'] : '',
        telefono: userData && userData['telefono'] !== undefined ? userData['telefono'] : '',
        mensaje,
        option: otroRecomendacion ? 'Otro: ' + otroRecomendacion : option,
      };

      await this.firebaseSvc.addContacto(contactoData);

      this.utilsSvc.presentToast({
        message: 'Mensaje enviado exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });

      // Limpiar solo el mensaje y la opción
      this.form.patchValue({
        mensaje: '',
        option: '',
      });
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);

      this.utilsSvc.presentToast({
        message: 'Error al enviar el mensaje',
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    }
  }
}
