import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisproductosPageRoutingModule } from './misproductos-routing.module';

import { MisproductosPage } from './misproductos.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisproductosPageRoutingModule,
    SharedModule,
  ],
  declarations: [MisproductosPage],
})
export class MisproductosPageModule {}
