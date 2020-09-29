import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WantToReadPage } from './want-to-read.page';

const routes: Routes = [
  {
    path: '',
    component: WantToReadPage
  },
  {
    path: ':wtrBookId',
    loadChildren: () => import('./wtr-detail/wtr-detail.module').then( m => m.WtrDetailPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WantToReadPageRoutingModule {}
