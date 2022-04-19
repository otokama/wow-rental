import {Injectable, NgZone} from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public snackBar: MatSnackBar,
              private zone: NgZone) {}
  // TODO: change styling of snackbar: https://stackoverflow.com/questions/47901127/angular-5-material-snackbar-panelclass-config
  public showNotif(message, action, duration = 4000): void {
    this.snackBar.open(message, action, { duration }).onAction().subscribe(() => {
      console.log('Notififcation action performed');
    });
  }


  public notImplementedWarning(message, duration = 4000): void {

    // @ts-ignore
    this.snackBar.open(`"${message}" is not implemented`, 'error', { duration }).onAction().subscribe(() => {
    });
  }



}

