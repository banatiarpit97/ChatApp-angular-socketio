import { Component, OnInit, HostBinding } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { WebSocketService } from '../services/web-socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages = [];
  colors = ['green', '#2255aa', '#d13131', '#c07e1c'];
  randomNumber;
  constructor(private chat: ChatService, public ws: WebSocketService, private router: Router) {
    console.log(this.randomNumber);

  }

  ngOnInit() {
    this.chat.messages.subscribe(msg => {
      // console.log(8);
      msg.text = msg.text.split('\n');
      this.messages.push(msg);
      const scrollableArea = document.querySelector('mat-sidenav-content');
      setTimeout(() => {scrollableArea.scrollTop = scrollableArea.scrollHeight; }, 0);
    });
    this.ws.partnerInformation().subscribe((data: any) => {
      if (data.status) {
        this.randomNumber = Math.floor(Math.random() * 4);
        this.ws.pairedOnce = true;
        this.messages.push({ from: 'admin', text: `You have been connected with ${data.name}`});
        this.messages.push({ from: 'admin', text: 'You can start sending messages now' });
      } else {
        if (this.ws.pairedOnce) {
          this.messages.push({ from: 'admin', text: 'Your partner disconnected'});
          this.messages.push({ from: 'admin', text: 'Finding you a new partner...' });
        } else {
          this.messages.push({ from: 'admin', text: 'Finding you a suitable partner...' });
        }
      }
    });
  }

  logout() {
    this.ws.logout();
    if (this.ws.pairedOnce) {
      this.messages.push({ from: 'admin', text: 'Your partner disconnected' });
      this.messages.push({ from: 'admin', text: 'Finding you a new partner...' });
    } else {
      this.messages.push({ from: 'admin', text: 'Finding you a suitable partner...' });
    }
    this.router.navigate(['/login']);
  }

}
