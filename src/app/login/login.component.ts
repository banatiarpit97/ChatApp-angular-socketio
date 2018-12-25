import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WebSocketService } from '../services/web-socket.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  gender;
  loginForm;
  noteImage: any = './assets/images/user-placeholder.jpeg';
  constructor(fb: FormBuilder, public ws: WebSocketService, private router: Router) {
    this.loginForm = fb.group({
      image: [null],
      name: ['', Validators.required],
      description: ['', Validators.required],
      gender: ['', Validators.required],
      interested: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  login() {
    this.ws.name = this.loginForm.value.name;
    this.ws.gender = this.loginForm.value.gender;
    this.ws.interested = this.loginForm.value.interested;
    this.ws.description = this.loginForm.value.description;
    this.ws.image = this.loginForm.value.image;
    this.router.navigate(['/messages']);
    console.log(this.loginForm.value);
  }

  imgUpload(e: Event) {
    // this.editImage = true;
    const file = (e.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      console.log(reader.result);
      this.noteImage = reader.result;
      this.loginForm.patchValue({ image: reader.result });
      this.loginForm.get('image').updateValueAndValidity();
    };
    reader.readAsDataURL(file);
  }

}
