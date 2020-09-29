import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExplorePage } from './explore.page';

const routes: Routes = [
  {
    path: ':bookId',
    loadChildren: () => import('../book-detail/book-detail.module').then( m => m.BookDetailPageModule)
  },
  {
    path: '',
    component: ExplorePage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExplorePageRoutingModule {}
