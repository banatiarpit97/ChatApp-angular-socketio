import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { WebSocketService } from '../services/web-socket.service';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.css']
})
export class NewMessageComponent implements OnInit {
  @Input() partner_name: string;
  message;
  constructor(private chat: ChatService, private ws: WebSocketService) {
    console.log(this.ws.pairingStatus);
  }

  ngOnInit() {
    if (this.partner_name) {
      console.log(1, this.partner_name);
    } else {
      console.log(2);
    }
  }

  sendMessage(message) {
    // console.log(3);
    console.log(message);
    this.chat.sendMsg(message);
    this.message = '';
  }
}
