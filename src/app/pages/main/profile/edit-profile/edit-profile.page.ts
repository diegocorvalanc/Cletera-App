import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface UserData {
  direccion?: string;
  telefono?: string;
  comuna?: string;
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  form = new FormGroup({
    name: new FormControl(''),
    password: new FormControl('', [Validators.min(0)]),
    direccion: new FormControl(''),
    telefono: new FormControl('', [
      Validators.pattern(/^[0-9]*$/),
      Validators.maxLength(8),
      Validators.minLength(8),
    ]),
    comuna: new FormControl(''),
  });

  utilSvc: UtilsService;

  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  constructor(
    private router: Router,
    private firebaseSvc: FirebaseService,
    private utilsService: UtilsService
  ) {
    this.utilSvc = utilsService;
  }

  async ngOnInit() {
    try {
      // Obtener el usuario actual
      const currentUser = this.firebaseSvc.getAuth().currentUser;
      if (currentUser) {
        // Obtener información adicional del usuario desde Firestore
        const userData = (await this.firebaseSvc.getDocument(`users/${currentUser.uid}`)) as UserData;
        if (userData) {
          // Preenlazar todos los campos con los datos del usuario
          this.form.patchValue({
            name: currentUser.displayName || '',
            direccion: userData['direccion'] || '',
            telefono: userData['telefono'] || '',
            comuna: userData['comuna'] || '',
          });
        }
      }
    } catch (error) {
      console.error('Error al obtener información del usuario:', error);
    }
  }

  async updateProfile() {
    try {
      const user = this.firebaseSvc.getAuth().currentUser;
      if (!user) {
        console.error('Usuario no autenticado');
        return;
      }

      const { name, direccion, telefono, comuna } = this.form.value;

      // Verificar si al menos un campo está completo
      if (!name && !direccion && !telefono && !comuna) {
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

      // Actualizar datos en la autenticación
      if (name) {
        await this.firebaseSvc.updateUser(name);
      }

      // Actualizar datos en la base de datos
      await this.firebaseSvc.updateDocument(`users/${user.uid}`, {
        name: name,
        direccion: direccion || '',
        telefono: telefono || '',
        comuna: comuna || '',
      });

      this.utilSvc.presentToast({
        message: 'Perfil actualizado exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
      this.router.navigate(['/main/profile']);
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
}
