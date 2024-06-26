import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private snackBar: MatSnackBar) {}

  alert(message: string, icon: string = 'ok'): void {
    this.snackBar.open(message, icon, {
      duration: 2000,
      verticalPosition: 'top',
    });
  }
}
