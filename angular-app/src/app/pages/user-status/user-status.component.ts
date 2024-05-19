import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from '../../shared/services/alert.service';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/User';

@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
  styleUrl: './user-status.component.css',
})
export class UserStatusComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private alert: AlertService,
    private user: UserService,
    private dialogRef: MatDialogRef<UserStatusComponent>
  ) {}

  userForm = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    email: new FormControl(''),
  });

  ngOnInit(): void {
    if (this.data) {
      this.userForm.patchValue(this.data.userData);
    }
  }

  onFormSubmit() {
    if (this.data.userData.status === 'disabled') {
      this.data.userData.status = 'active';
    } else {
      this.data.userData.status = 'disabled';
    }

    this.user
      .update(this.data.id as string, this.data.userData as User)
      .then(() => {
        this.alert.alert('A felhaszáló státusza módosult!', 'Kész');
        this.dialogRef.close(true);
      });
  }
}
