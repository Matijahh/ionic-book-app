import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WantToReadPageRoutingModule } from './want-to-read-routing.module';

import { WantToReadPage } from './want-to-read.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WantToReadPageRoutingModule
  ],
  declarations: [WantToReadPage]
})
export class WantToReadPageModule {}
