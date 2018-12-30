import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm-logout',
  templateUrl: './confirm-logout.component.html',
  styleUrls: ['./confirm-logout.component.css']
})
export class ConfirmLogoutComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmLogoutComponent>) { }

  ngOnInit() {
  }

}
