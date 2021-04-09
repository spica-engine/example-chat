import { Injectable } from '@angular/core';
import { SpicaClient, SpicaResource } from './spica.facade';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  private spicaClient = new SpicaClient("https://example-chat-d5746.hq.spicaengine.com/api");
  public resources = {
    chatGroup: new SpicaResource("606d6cd8321600002c994891", this.spicaClient),
    chat: new SpicaResource("606d6d0f321600002c994893",this.spicaClient),
    users: new SpicaResource("606d6c1c321600002c99488e", this.spicaClient)
  }
  constructor() { 
  }
}


export interface User{
  _id?: string;
  id?: string;
  username?: string;
  email?: string;
  image?: string;
}

export interface ChatGroup{
  _id?: string;
  name?: string;
  created_at?: string;
  users?: User[];
  last_active?: {user: User, date:string, unread_messages_count: number}[];
  last_message?: string,
  last_message_time?: string;
  new_message_count?: number;
}

export interface Chat{
  _id?: string;
  message?: string;
  created_at?: string;
  owner?: string | User;
  chat?: string | ChatGroup;  
}

