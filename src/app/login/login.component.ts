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
  gender = 'male';
  loginForm;
  constructor(fb: FormBuilder, public ws: WebSocketService, private router: Router) {
    this.loginForm = fb.group({
      name: ['', Validators.required],
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
    this.router.navigate(['/messages']);
    console.log(this.loginForm.value);
  }

}
