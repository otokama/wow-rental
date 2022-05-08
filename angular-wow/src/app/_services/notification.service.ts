import {Injectable, NgZone} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public snackBar: MatSnackBar,
              private zone: NgZone) {}
  // TODO: change styling of snackbar: https://stackoverflow.com/questions/47901127/angular-5-material-snackbar-panelclass-config
  public showNotif(message, action, duration = 4000): void {
    const config = new MatSnackBarConfig();
    config.panelClass = ['green-snackbar'];
    config.duration = 4000;
    config.horizontalPosition = 'center';
    this.snackBar.open(message, action, config);
  }

  public showNotification(message, action, badness: boolean) {
    const config = new MatSnackBarConfig();
    if (badness) {
      config.panelClass = ['red-snackbar'];
    } else {
      config.panelClass = ['green-snackbar'];
    }
    config.duration = 4000;
    config.horizontalPosition = 'center';
    this.snackBar.open(message, action, config);
  }

  public notImplementedWarning(message, duration = 4000): void {

    // @ts-ignore
    this.snackBar.open(`"${message}" is not implemented`, 'error', { duration }).onAction().subscribe(() => {
    });
  }



}

