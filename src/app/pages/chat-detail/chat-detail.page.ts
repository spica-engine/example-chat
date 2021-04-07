import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ChatGroup, DataService, User } from 'src/app/services/data.service';

@Component({
  selector: 'app-chat-detail',
  templateUrl: './chat-detail.page.html',
  styleUrls: ['./chat-detail.page.scss'],
})
export class ChatDetailPage implements OnInit {

  me: User;
  groupId: string;
  chatGroup: ChatGroup;
  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  async ngOnInit() {
    this.me = await this.authService.getUser();
    this.groupId = this.route.snapshot.paramMap.get("chat_id");
    this.chatGroup = await this.dataService.resources.chatGroup.get(this.groupId, {queryParams: {relation: true}}).toPromise()
  }

  async deleteGroup(chatGroup){
    chatGroup.last_active = chatGroup.last_active.filter(user => user.user != this.me._id);
    await this.dataService.resources.chatGroup.patch(this.groupId, {last_active: chatGroup.last_active}).toPromise();
    this.router.navigateByUrl("chats")
  }

}
