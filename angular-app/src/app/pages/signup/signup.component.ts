import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../shared/models/User';
import { AuthServicesService } from '../../shared/services/auth-services.service';
import { UserServiceService } from '../../shared/services/user-service.service';
import { SchoolServicesService } from '../../shared/services/school-services.service';
import { School } from '../../shared/models/School';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  firstname = new FormControl('', Validators.required);
  lastname = new FormControl('', Validators.required);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', Validators.required);
  schoolname = new FormControl('', Validators.required);
  phonenumber = new FormControl('', Validators.required);
  hide = true;
  alert = true;

  constructor(
    private router: Router,
    private auth: AuthServicesService,
    private user: UserServiceService,
    private school: SchoolServicesService
  ) {}

  registerFormData = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    phonenumber: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    schoolname: new FormControl(''),
    teacher: new FormControl(''),
  });

  async onSubmit() {
    if (this.registerFormData.valid) {
      const formdata = this.registerFormData.value;
      const user: User = {
        firstname: <string>formdata.firstname,
        lastname: <string>formdata.lastname,
        email: <string>formdata.email,
        password: <string>formdata.password,
        phonenumber: <string>formdata.phonenumber,
        role: <string>formdata.role,
      };

      this.auth
        .signup(user.email as string, user.password as string)
        .then((cred) => {
          this.user
            .create(cred.user?.uid as string, user as User)
            .then((res) => {
              if (formdata.role == '1') {
                const school: School = {
                  admin_ID: <string>cred.user?.uid,
                  name: <string>formdata.schoolname,
                  user_IDs: [],
                };
                //TODO: ha a felhasználó belép irányítsa át
                this.school.create(school);
              }
              if (formdata.role == '2') {
                //TODO: oktató reg
              } else {
                //TODO: diák reg
              }
            });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log('Nem valid' + this.registerFormData.value);
    }
  }

  selectedRole: string | undefined;
  onRoleChange(event: any) {
    this.selectedRole = event.value;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
