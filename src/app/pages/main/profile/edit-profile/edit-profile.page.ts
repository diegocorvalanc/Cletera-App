import { Component, Input, OnInit, inject } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  @Input() user: User;

  form = new FormGroup({
    name: new FormControl(''),
    email: new FormControl('', [Validators.email]),
    password: new FormControl('', [Validators.min(0)]),
    direccion: new FormControl(''),
    telefono: new FormControl('', [Validators.pattern(/^[0-9]*$/), Validators.maxLength(8)]),
    comuna: new FormControl(''),
  });

  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);

  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  ngOnInit() {
    // Verificar si this.user está definido antes de acceder a sus propiedades
    if (this.user) {
      this.form.patchValue({
        name: this.user.name || '',
        email: this.user.email || '',
        direccion: this.user.direccion || '',
        telefono: this.user.telefono || '+569',
        comuna: this.user.comuna || '',
      });
    }
  }

  // Método para actualizar el perfil del usuario
  async updateProfile() {
    try {
      // Obtener el UID del usuario actual
      const user = this.firebaseSvc.getAuth().currentUser;
      if (!user) {
        console.error('Usuario no autenticado');
        return;
      }

      const uid = user.uid;

      const { name, email, direccion, telefono, comuna } = this.form.value;

      // Obtener los datos actuales del usuario
      const currentUserData = await this.firebaseSvc.getDocument(`users/${uid}`);

      // Verificar si al menos un campo está completo
      if (!name && !email && !direccion && !telefono && !comuna) {
        console.error('Por favor, complete al menos un campo.');
        return;
      }

      // Validar el número de teléfono
      if (telefono && isNaN(Number(telefono))) {
        console.error('El número de teléfono debe contener solo números.');
        return;
      }

      // Validar la longitud del número de teléfono
      if (telefono && telefono.length !== 8) {
        console.error('El número de teléfono debe contener 8 dígitos.');
        return;
      }

      // Validar el correo electrónico
      if (email && !this.isValidEmail(email)) {
        console.error('Formato de correo electrónico no válido.');
        return;
      }

      // Función auxiliar para obtener propiedades dinámicamente
      const getPropertyValue = (property: string) => currentUserData[property];

      // Actualizar datos en la base de datos
      await this.firebaseSvc.updateDocument(`users/${uid}`, {
        name: name || getPropertyValue('name'),
        email: email || getPropertyValue('email'),
        direccion: direccion || getPropertyValue('direccion'),
        telefono: telefono || getPropertyValue('telefono'),
        comuna: comuna || getPropertyValue('comuna'),
      });

      // Actualizar datos en la autenticación (opcional)
      if (name) {
        await this.firebaseSvc.updateUser(name);
      }

      this.utilSvc.presentToast({
        message: 'Perfil actualizado exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);

      this.utilSvc.presentToast({
        message: 'Error al actualizar el perfil',
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    }
  }

  // Función para validar el formato del correo electrónico
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
