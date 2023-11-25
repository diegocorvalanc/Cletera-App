import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignUpTallerPage } from './sign-up-taller.page';

const routes: Routes = [
  {
    path: '',
    component: SignUpTallerPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignUpTallerPageRoutingModule {}
