import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Informa2Page } from './informa2.page';

const routes: Routes = [
  {
    path: '',
    component: Informa2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Informa2PageRoutingModule {}
