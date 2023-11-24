import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Informa2PageRoutingModule } from './informa2-routing.module';

import { Informa2Page } from './informa2.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Informa2PageRoutingModule,
    SharedModule,
  ],
  declarations: [Informa2Page],
})
export class Informa2PageModule {}
