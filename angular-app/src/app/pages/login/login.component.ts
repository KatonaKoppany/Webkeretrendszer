import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../shared/models/User';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', Validators.required);
  hide = true;

  constructor(
    private router: Router,
    private auth: AuthService,
    private alert: AlertService
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
          //TODO: átirányítás a kezdőlapra
        })
        .catch((error) => {
          this.alert.alert('Hibás bejelentkezési adatok!', 'OK');
        });
    } else {
      this.alert.alert('Hibás bejelentkezési adatok!', 'OK');
    }
  }

  navigateToReg() {
    this.router.navigate(['/signup']);
  }
}
