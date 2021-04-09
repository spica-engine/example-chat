import { Component, OnInit } from '@angular/core';
import { ChatGroup, DataService, User } from 'src/app/services/data.service';
import { of, forkJoin, Observable, combineLatest, zip } from 'rxjs'
import { map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ModalController } from '@ionic/angular';
import { UsersPage } from '../users/users.page';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {

  chats: Observable<ChatGroup[]>;
  user: User;
  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private modalController: ModalController) {
  }


  async ngOnInit() {
    /*
    this.dataService.resources.users.post({
      id: this.makeid(50),
      username: this.makeid(20),
      email: this.makeid(10)
    })*/
    this.user = await this.authService.getUser();
    this.getChats();
  }

  getChats() {
    console.log("Fetching chats")
    this.chats = this.dataService.resources.chatGroup
      .getAllRealtime({
        filter: {
          users: { $in: [this.user._id] },
          'last_active.user': this.user._id
        }
      })
      .pipe(
        map((chats) => {
          chats = chats.map((chat: ChatGroup) => {
            let userObject = chat.last_active.filter(user => user.user == this.user._id)[0];
            chat.new_message_count = userObject.unread_messages_count;
            return chat;
          })
          return chats;
        }),
        tap(console.log),
        map(chats => chats.sort((a, b) => {
          if (b["last_message_time"] && a["last_message_time"])
            return new Date(b["last_message_time"]).getTime() - new Date(a["last_message_time"]).getTime()
          return -1;
        }))
      );
  }

  async createNewGroup() {
    const modal = await this.modalController.create({
      component: UsersPage,
    })

    await modal.present();
    const { data } = await modal.onWillDismiss() as {data:{users: User[]}};
    if (data.users.length) {
      let name = (data.users.length == 1) ? data.users[0].username : "Chat Group " + Math.round(Math.random() * 100);
      data.users.push(this.user);
      this.dataService.resources.chatGroup.post({
        name: name,
        users: data.users.map(user => user._id),
        created_at: new Date(),
        last_active: data.users.map(user => { return { user: user._id, date: new Date() } })
      })
    }
  }
}
