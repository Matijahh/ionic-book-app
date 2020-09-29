import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WtrDetailPage } from './wtr-detail.page';

const routes: Routes = [
  {
    path: '',
    component: WtrDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WtrDetailPageRoutingModule {}
