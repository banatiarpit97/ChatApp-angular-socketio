import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { WebSocketService } from '../services/web-socket.service';

@Component({
  selector: 'app-send-image',
  templateUrl: './send-image.component.html',
  styleUrls: ['./send-image.component.css']
})
export class SendImageComponent implements OnInit {
  send_image: any = './../assets/images/send-image-placeholder.png';
  send_text;
  constructor(public dialogRef: MatDialogRef<SendImageComponent>, private ws: WebSocketService) { }

  ngOnInit() {
    document.getElementById('image').click();
  }

  imgUpload(e: Event) {
    const file = (e.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.send_image = reader.result;
      console.log(this.send_image);
    };
    reader.readAsDataURL(file);
  }

  sendImage() {
    if (this.send_image && this.send_image !== './../assets/images/send-image-placeholder.png') {
      console.log(this.send_image);
      this.ws.sendImage(this.send_image, this.send_text);
      this.dialogRef.close();
    }
  }

}
