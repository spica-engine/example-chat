import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatSinglePageRoutingModule } from './chat-single-routing.module';

import { ChatSinglePage } from './chat-single.page';
import { MessageSingleComponent } from 'src/app/components/message-single/message-single.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatSinglePageRoutingModule
  ],
  declarations: [
    ChatSinglePage,
    MessageSingleComponent
  ]
})
export class ChatSinglePageModule { }
