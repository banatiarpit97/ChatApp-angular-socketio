import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
// tslint:disable-next-line:import-blacklist
import * as Rx from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket;
  public id;
  public name;
  public gender;
  public interested;
  public description;
  public image;
  partner_image = './../assets/images/user-placeholder.jpeg';
  partner_name;
  partner_description;
  partner_gender;
  partner_interested;
  chat = [];
  pairingStatus = false;
  pairedOnce;
  constructor() {
  }

  connect(): Rx.Subject<MessageEvent> {
    console.log(this.image, this.description);
    this.socket = io('http://localhost:3000');
    console.log(1);

    // this.socket.on('connect', () => {
    //     this.socket.emit('credentials', JSON.stringify({});
    // });
    const observable = new Observable(obs => {
      // console.log(2);
      this.socket.on('connection-sucessful', (data) => {
        this.id = data;
        this.socket.emit('credentials', JSON.stringify({
          name: this.name,
          description: this.description,
          image: this.image,
          gender: this.gender,
          interested: this.interested,
        }));
        obs.next({from: 'admin', text: 'Welcome to Chat App'});
      });
      // this.socket.on('pairing-info', (data) => {
      //   data = JSON.parse(data);
      //   console.log('Your pairing status', data);
      //   if (data.status) {
      //     this.pairingStatus = true;
      //     obs.next({ from: 'admin', text: `You have been connected with ${data.name}`});
      //     obs.next({ from: 'admin', text: 'You can start sending messages now' });
      //   } else if (!data.status) {
      //     this.pairingStatus = false;
      //     obs.next({ from: 'admin', text: 'Finding you a suitable partner...' });
      //   }
      // });
      this.socket.on('message', (data) => {
        console.log('Received message from Websocket Server');
        if (data.from === this.id) {
          data.from = 'me';
        }
        this.chat.push(data);
        // console.log(6);
        obs.next(data);
      });
      // this.socket.on('partner-disconnect', (data) => {
      //   console.log('Your partner disconnected', data);
      //   if (data) {
      //     obs.next({from: 'admin', text: 'Your partner disconnected'});
      //     obs.next({ from: 'admin', text: 'Finding you a new partner...'});
      //   }
      // });
      return () => {
        this.socket.disconnect();
      };
    });

    const observer = {
      next: (data: any) => {
        const now = new Date();
        // console.log(5);
        const message = {
          from: 'me',
          text: data.trim(),
          date: now.getHours() + ':' + now.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2}),
        };
        // this.chat.push(message);
        this.socket.emit('message', JSON.stringify(message));
      },
    };

    return Rx.Subject.create(observer, observable);
  }

  partnerInformation() {
    return new Observable((observer) => {
      this.socket.on('partner-information', (data) => {
        if (data) {
          data = JSON.parse(data);
          this.pairingStatus = data.status;
          console.log(data);
          // if (data.status) {
            if (data.image) {
              this.partner_image = data.image;
            }
            this.partner_name = data.name;
            this.partner_description = data.description;
            this.partner_gender = data.gender;
            this.partner_interested = data.interested;
          // } else {
          //   this.messages.push({ from: 'admin', text: 'Your partner disconnected' });
          //   this.messages.push({ from: 'admin', text: 'Finding you a suitable partner...' });
          //   this.partner_name = null;
          //   this.partner_description = null;
          //   this.partner_gender = null;
          //   this.partner_interested = null;
          // }
          observer.next(data);
        }
      });
    });
  }

  logout() {
    this.socket.disconnect();
    this.pairingStatus = false;
    this.partner_image = null;
    this.partner_name = null;
    this.partner_description = null;
    this.partner_gender = null;
    this.partner_interested = null;
  }
}
