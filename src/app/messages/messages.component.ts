import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages = [];
  constructor(private chat: ChatService) { }

  ngOnInit() {
    this.chat.messages.subscribe(msg => {
      // console.log(8);
      this.messages.push(msg);
        console.log(this.messages);
      // console.log(msg);
    });
  }

}
