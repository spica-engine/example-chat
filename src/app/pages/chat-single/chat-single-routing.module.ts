import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatSinglePage } from './chat-single.page';

const routes: Routes = [
  {
    path: '',
    component: ChatSinglePage
  },
  {
    path: 'chat-detail',
    loadChildren: () => import('../../pages/chat-detail/chat-detail.module').then( m => m.ChatDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatSinglePageRoutingModule {}
