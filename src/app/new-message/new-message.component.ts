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
  }

  ngOnInit() { }

  sendMessage(message) {
    // console.log(3);
    this.chat.sendMsg(message);
    this.message = '';
  }
}
