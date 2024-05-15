import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServicesService } from '../../shared/services/auth-services.service';
import { UserServiceService } from '../../shared/services/user-service.service';
import { User } from '../../shared/models/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', Validators.required);
  hide = true;
  alert = true;

  constructor(
    private router: Router,
    private auth: AuthServicesService,
    private user: UserServiceService
  ) {}

  loginFormData = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  async onSubmit() {
    const email = this.loginFormData.get('email')?.value;
    const password = this.loginFormData.get('password')?.value;
    if (this.loginFormData.valid) {
      this.auth
        .login(email as string, password as string)
        .then((cred) => {
          console.log(cred);
          //TODO: ha a felhasználó belép irányítsa át
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  navigateToReg() {
    this.router.navigate(['/signup']);
  }
}
