import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReadBookDetailPage } from './read-book-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ReadBookDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReadBookDetailPageRoutingModule {}
