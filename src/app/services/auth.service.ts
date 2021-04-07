import { Injectable } from '@angular/core';
import { DataService, User } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User;
  userId: string;
  constructor(private dataService: DataService) { 
  }

  async setUser(){
    let userID = this.getUserId();
    let user = await this.dataService.resources.users.getAll({queryParams: {filter: {id: userID}}}).toPromise();
    if(user.length)
      this.user = user[0];
    else
      this.user = await this.dataService.resources.users.post({
        id: userID,
        username: "user_" + this.makeid(5),
        email: "user_" + this.makeid(5) + "@test.com",
        image: ""
      }).toPromise();
    return this.user;
  }

  async getUser(){
    if(this.user)
      return this.user;
    return await this.setUser();
  }

  getUserId(): string{
    if(localStorage.getItem("userId")){
      this.userId = localStorage.getItem("userId");
    }else{
      this.userId = this.makeid(50);
      localStorage.setItem("userId", this.userId);
    }
    return this.userId;
  }

  makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
}