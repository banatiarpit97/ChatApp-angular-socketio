import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.css']
})
export class NewMessageComponent implements OnInit {

  constructor(private chat: ChatService) { }

  ngOnInit() {
  }

  sendMessage(message) {
    // console.log(3);
    console.log(message.value);
    this.chat.sendMsg(message.value);
    message.value = '';
  }

}
