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
    this.socket = io('/');
    // console.log(1);
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
      this.socket.on('message', (data) => {
        this.chat.push(data);
        // console.log(6);
        obs.next(data);
      });
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
          // this.pairingStatus = true;  // remove
            if (data.image) {
              this.partner_image = data.image;
            } else {
              this.partner_image = './../assets/images/user-placeholder.jpeg';
            }
            this.partner_name = data.name;
            this.partner_description = data.description;
            this.partner_gender = data.gender;
            this.partner_interested = data.interested;
          observer.next(data);
        }
      });
    });
  }

  logout() {
    this.socket.disconnect();
    this.pairingStatus = false;
    this.partner_image = './../assets/images/user-placeholder.jpeg';
    this.partner_name = null;
    this.partner_description = null;
    this.partner_gender = null;
    this.partner_interested = null;
  }
}
