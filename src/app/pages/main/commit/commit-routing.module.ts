import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommitPage } from './commit.page';

const routes: Routes = [
  {
    path: '',
    component: CommitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommitPageRoutingModule {}
