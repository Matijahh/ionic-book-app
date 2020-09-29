import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReadBookDetailPageRoutingModule } from './read-book-detail-routing.module';

import { ReadBookDetailPage } from './read-book-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReadBookDetailPageRoutingModule
  ],
  declarations: [ReadBookDetailPage]
})
export class ReadBookDetailPageModule {}
