import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  pages = [
    { title: 'Inicio', url: '/main/home', icon: 'home-outline' },
    { title: 'Perfil', url: '/main/profile', icon: 'person-outline' },
    {
      title: 'Mis Productos',
      url: '/main/misproductos',
      icon: 'clipboard-outline',
    },
    { title: 'Informa2', url: '/main/informa2', icon: 'newspaper-outline' },
    {
      title: 'Contactenos',
      url: '/main/contacto',
      icon: 'chatbubbles-outline',
    },
    { title: 'Nosotros', url: '/main/nosotros', icon: 'book-outline' },
  ];

  router = inject(Router);
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  currentPath: string = '';

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event?.url) this.currentPath = event.url;
    });
  }

  // Datos de usuario
  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  // Cerrar sesión
  signOut() {
    this.firebaseSvc.signOut();
  }
}
