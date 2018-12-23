import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { WebSocketService } from '../services/web-socket.service';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.css']
})
export class NewMessageComponent implements OnInit {
  message;
  constructor(private chat: ChatService, private ws: WebSocketService) {
    console.log(this.ws.pairingStatus);
  }

  ngOnInit() {
  }

  sendMessage(message) {
    // console.log(3);
    console.log(message);
    this.chat.sendMsg(message);
    this.message = '';
  }
}
