import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DataService, User } from 'src/app/services/data.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  user: User;
  allUsers: Observable<User[]>;
  choosenUsers = [];
  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private modalController: ModalController
    ) { }

  async ngOnInit() {
    this.user = await this.authService.getUser();
    this.allUsers = this.dataService.resources.users.getAll({queryParams: {filter: `_id != "${this.user._id}"`}});
  }

  toggleUser(user){
    if(this.choosenUsers.filter(choosenUser => choosenUser._id == user._id).length){
      this.choosenUsers.splice(this.choosenUsers.map(user => user._id).indexOf(user._id), 1);
    }else{
      this.choosenUsers.push(user);
    }
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'users': this.choosenUsers
    });
  }

  cancle(){
    this.modalController.dismiss({
      'users': []
    })
  }

}
