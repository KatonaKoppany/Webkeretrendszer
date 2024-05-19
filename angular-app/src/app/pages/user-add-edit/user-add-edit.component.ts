import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../shared/services/user.service';
import { AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'app-user-add-edit',
  templateUrl: './user-add-edit.component.html',
  styleUrl: './user-add-edit.component.css',
})
export class UserAddEditComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UserAddEditComponent>,
    private user: UserService,
    private alert: AlertService
  ) {}

  selectedValue: string | undefined;

  userForm = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    //email: new FormControl('', Validators.required),
    phonenumber: new FormControl('', Validators.required),
  });

  /*
  carForm = new FormGroup({
    license_plate_number: new FormControl('', Validators.required),
    total_km: new FormControl('', Validators.required),
  });

  teacherForm = new FormGroup({
    teacher_ID: new FormControl(),
  });
  */
  teachers: any[] = [];

  ngOnInit(): void {
    console.log(this.data);

    if (this.data) {
      this.userForm.patchValue(this.data);
    }
  }
  onFormSubmit() {
    const formValue = this.userForm.value;
    this.data.firstname = formValue.firstname;
    this.data.lastname = formValue.lastname;
    this.data.phonenumber = formValue.phonenumber;

    this.user.update(this.data.id, this.data).then(() => {
      this.alert.alert('A felhasználó adatai módosultak!', 'Kész');
      this.dialogRef.close(true);
    });
  }
}
