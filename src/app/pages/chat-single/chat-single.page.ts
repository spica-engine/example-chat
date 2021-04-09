import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Chat, ChatGroup, DataService, User } from 'src/app/services/data.service';

@Component({
  selector: 'app-chat-single',
  templateUrl: './chat-single.page.html',
  styleUrls: ['./chat-single.page.scss'],
})
export class ChatSinglePage implements OnInit {

  @ViewChild(IonContent, {read: IonContent, static: false}) private content: IonContent;

  message: string;
  chatId: string;
  messages: Observable<any>;
  user: User;
  chatGroup: ChatGroup;
  usersInChatGroup: object = {};
  constructor(private dataService:DataService, private authService: AuthService, private route: ActivatedRoute) { }

  async ngOnInit() {
    this.chatId = this.route.snapshot.paramMap.get("chat_id");
    this.user = await this.authService.getUser();
    this.chatGroup = await this.dataService.resources.chatGroup.get(this.chatId, {queryParams: {relation: true}}).toPromise();
    this.chatGroup.users.forEach((user) => {
      this.usersInChatGroup[user._id] = user;
    });
    this.messages = this.dataService.resources.chat.getAllRealtime({filter: {chat: this.chatId}, sort: {_id: 1}}).pipe(
      tap(() => this.content.scrollToBottom(300))
    );
    this.chatGroup.last_active.map(lastActive => {
      if(lastActive.user == this.user._id) 
        lastActive.date = new Date().toISOString();
        lastActive.unread_messages_count = 0;
      return lastActive   
    })
    this.dataService.resources.chatGroup.update(this.chatId, this.chatGroup).toPromise().then(res => {
      console.log("Chat group updated", res);
    });

  }

  ionViewDidEnter(){
  }

  sendMessage(){
    this.dataService.resources.chat.post({
      message: this.message,
      owner: this.user._id,
      chat: this.chatId,
      created_at: new Date()
    });

    this.chatGroup.last_active = this.chatGroup.last_active.map((user) => {
      if(user.user != this.user._id)
        user.unread_messages_count = user.unread_messages_count + 1;
      return user;
    });

    this.dataService.resources.chatGroup.patch(this.chatGroup._id,{
      last_message: this.message,
      last_message_time: new Date(),
      last_active: this.chatGroup.last_active
    })
    this.message = "";
  }

}
