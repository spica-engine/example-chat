import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'message-single',
  templateUrl: './message-single.component.html',
  styleUrls: ['./message-single.component.scss'],
})
export class MessageSingleComponent implements OnInit {

  @Input() isCurrentUser: boolean;
  @Input() message: string;
  @Input() avatar: string;
  constructor() { }

  ngOnInit() {}

}
