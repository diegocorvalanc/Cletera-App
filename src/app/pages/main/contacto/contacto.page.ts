import { Component, Input, OnInit, inject } from '@angular/core';
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
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', [
      Validators.pattern(/^[0-9]*$/),
      Validators.maxLength(8),
    ]),
    mensaje: new FormControl(''),
    option: new FormControl(''),
    otroRecomendacion: new FormControl({ value: '', disabled: true }),
    id: new FormControl(''),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
    this.getOptions();

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.form.patchValue({
          id: user.uid,
        });
      }
    });

    this.form.get('option').valueChanges.subscribe((selectedOption) => {
      // Modificado para comparar con la opción correspondiente
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
    // Modificado para obtener las opciones desde 'option' en lugar de 'options'
    this.options = docData['option'] || [];
  }

  async submitForm() {
    try {
      if (this.form.invalid) {
        console.error('Formulario no válido. Revise los campos.');
        return;
      }

      const { name, email, telefono, mensaje, option, otroRecomendacion, id } = this.form.value;

      const contactoData: Contacto = {
        id: id,
        name,
        email,
        telefono,
        mensaje,
        // Modificado para comparar con la opción correspondiente
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
