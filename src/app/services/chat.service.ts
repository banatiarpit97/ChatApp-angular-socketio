import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
// tslint:disable-next-line:import-blacklist
import { Observable, Subject } from 'rxjs/Rx';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  messages: Subject<any>;
  constructor(private wsService: WebSocketService, private router: Router) {}


  init() {
    this.router.navigate(['/messages']);
    this.messages = <Subject<any>>this.wsService
      .connect()
      .map((response: any): any => {
        // console.log(7);
        return response;
      });
  }

  sendMsg(msg) {
    // console.log(4);
    this.messages.next(msg);
  }

}
