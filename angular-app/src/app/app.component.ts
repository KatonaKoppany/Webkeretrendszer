import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor(public auth: AuthService) {}
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    this.auth.isUserLoggedIn().subscribe((user) => {
      if (user) {
        this.isLoggedIn = true;
      }
    });
  }
  title = 'Forgalmi napló';
}
