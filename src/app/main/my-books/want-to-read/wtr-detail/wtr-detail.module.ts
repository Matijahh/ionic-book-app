import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WtrDetailPageRoutingModule } from './wtr-detail-routing.module';

import { WtrDetailPage } from './wtr-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WtrDetailPageRoutingModule
  ],
  declarations: [WtrDetailPage]
})
export class WtrDetailPageModule {}
