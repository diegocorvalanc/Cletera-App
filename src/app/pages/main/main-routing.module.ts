import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfilePageModule),
      },
      {
        path: 'nosotros',
        loadChildren: () =>
          import('./nosotros/nosotros.module').then(
            (m) => m.NosotrosPageModule
          ),
      },
      {
        path: 'informa2',
        loadChildren: () =>
          import('./informa2/informa2.module').then(
            (m) => m.Informa2PageModule
          ),
      },
      {
        path: 'commit',
        loadChildren: () =>
          import('./commit/commit.module').then((m) => m.CommitPageModule),
      },
      {
        path: 'contacto',
        loadChildren: () => import('./contacto/contacto.module').then( m => m.ContactoPageModule),
      },
      {
        path: 'misproductos',
        loadChildren: () => import('./misproductos/misproductos.module').then( m => m.MisproductosPageModule)
      },

    ],
  },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
