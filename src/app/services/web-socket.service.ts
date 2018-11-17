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
  chat = [];
  constructor() { }

  connect(): Rx.Subject<MessageEvent> {
    this.socket = io('http://localhost:3000');
    // console.log(1);

    const observable = new Observable(obs => {
      // console.log(2);
      this.socket.on('connection-sucessful', (data) => {
        this.id = data;
        obs.next({from: 'admin', text: 'Welcome to Chat App'})
      });
      this.socket.on('message', (data) => {
        console.log('Received message from Websocket Server');
        if (data.from === this.id) {
          data.from = 'me';
        }
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
          text: data.trim(),
          date: now.getHours() + ':' + now.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2}),
        };
        this.socket.emit('message', JSON.stringify(message));
      },
    };

    return Rx.Subject.create(observer, observable);
  }
}
