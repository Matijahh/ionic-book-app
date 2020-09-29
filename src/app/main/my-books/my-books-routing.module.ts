import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyBooksPage } from './my-books.page';

const routes: Routes = [
  {
    path: '',
    component: MyBooksPage
  },
  {
    path: 'read',
    loadChildren: () => import('./read/read.module').then( m => m.ReadPageModule)
  },
  {
    path: 'want-to-read',
    loadChildren: () => import('./want-to-read/want-to-read.module').then( m => m.WantToReadPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyBooksPageRoutingModule {}
