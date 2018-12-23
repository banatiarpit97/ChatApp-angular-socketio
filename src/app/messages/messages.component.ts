import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages = [];
  colors = ['green', '#2255aa', '#d13131', '#c07e1c'];
  randomNumber = Math.floor(Math.random() * 4);
  constructor(private chat: ChatService) {
    console.log(this.randomNumber);

  }

  ngOnInit() {
    this.chat.messages.subscribe(msg => {
      // console.log(8);
      this.messages.push(msg);
    });
  }

}
