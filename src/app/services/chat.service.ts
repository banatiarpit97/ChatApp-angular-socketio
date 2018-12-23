import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
// tslint:disable-next-line:import-blacklist
import { Observable, Subject } from 'rxjs/Rx';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  messages: Subject<any>;
  constructor(private wsService: WebSocketService) {
    this.messages = <Subject<any>>wsService
      .connect()
      .map((response: any): any => {
        // console.log(7);
        // console.log(response);
        return response;
      });
  }

  sendMsg(msg) {
    // console.log(4);
    this.messages.next(msg);
  }

}
