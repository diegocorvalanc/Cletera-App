import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommitPageRoutingModule } from './commit-routing.module';

import { CommitPage } from './commit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommitPageRoutingModule
  ],
  declarations: [CommitPage]
})
export class CommitPageModule {}
