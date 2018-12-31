import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WebSocketService } from '../services/web-socket.service';

@Component({
  selector: 'app-send-image',
  templateUrl: './send-image.component.html',
  styleUrls: ['./send-image.component.css']
})
export class SendImageComponent implements OnInit {
  send = true;
  image: any = './../assets/images/send-image-placeholder.png';
  text;
  constructor(public dialogRef: MatDialogRef<SendImageComponent>, private ws: WebSocketService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      if (!data.send) {
        this.send = false;
        this.image = data.message.image;
        this.text = data.message.text;
      } else {
        this.send = true;
      }
    }

  ngOnInit() {
    if (this.send) {
      document.getElementById('imageInput').click();
    }

    // setTimeout(() => {
    //   document.getElementById('imageInput').click();
    // }, 0);
  }

  openInput(inputElement) {
    if (this.send) {
      inputElement.click();
    }
  }

  imgUpload(e: Event) {
    const file = (e.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.image = reader.result;
    };
    reader.readAsDataURL(file);
  }

  sendImage() {
    if (this.image && this.image !== './../assets/images/send-image-placeholder.png') {
      this.ws.sendImage(this.image, this.text);
      this.dialogRef.close();
    }
  }

}
