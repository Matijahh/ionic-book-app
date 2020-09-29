import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReadPage } from './read.page';

const routes: Routes = [
  {
    path: '',
    component: ReadPage
  },
  {
    path: ':readBookId',
    loadChildren: () => import('./read-book-detail/read-book-detail.module').then( m => m.ReadBookDetailPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReadPageRoutingModule {}
