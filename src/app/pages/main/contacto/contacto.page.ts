import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'firebase/auth';
import { Contacto } from 'src/app/models/contacto.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
})
export class ContactoPage implements OnInit {
  @Input() user: User;
  @Input() contacto: Contacto;
  options: any[];

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', [
      Validators.pattern(/^[0-9]*$/),
      Validators.maxLength(8),
    ]),
    mensaje: new FormControl(''),
    tname: new FormControl(''),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
    this.getOptions();
  }

  async getOptions() {
    const uid = this.user.uid;
    const docData = await this.firebaseSvc.getDocument(`users/${uid}`);
    this.options = docData['tname'];
  }
}
