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
  // partner_image = './../assets/images/user-placeholder.jpeg';
  // partner_name;
  // partner_description;
  // partner_gender;
  // partner_interested;
  constructor(private chat: ChatService, public ws: WebSocketService, private router: Router) {
    console.log(this.randomNumber);

  }

  ngOnInit() {
    this.chat.messages.subscribe(msg => {
      // console.log(8);
      this.messages.push(msg);
    });
    this.ws.partnerInformation().subscribe((data: any) => {
      console.log('partner-data', data);
      if (data.status) {
        this.randomNumber = Math.floor(Math.random() * 4);
        this.ws.pairedOnce = true;
        this.messages.push({ from: 'admin', text: `You have been connected with ${data.name}`});
        this.messages.push({ from: 'admin', text: 'You can start sending messages now' });
        // if (data.image) {
        //   this.partner_image = data.image;
        // }
        // this.partner_name = data.name;
        // this.partner_description = data.description;
        // this.partner_gender = data.gender;
        // this.partner_interested = data.interested;
      } else {
        if (this.ws.pairedOnce) {
          this.messages.push({ from: 'admin', text: 'Your partner disconnected'});
          this.messages.push({ from: 'admin', text: 'Finding you a new partner...' });
        } else {
          this.messages.push({ from: 'admin', text: 'Finding you a suitable partner...' });
        }
        // this.messages.push({ from: 'admin', text: 'Your partner disconnected'});
        // this.partner_name = null;
        // this.partner_description = null;
        // this.partner_gender = null;
        // this.partner_interested = null;
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
