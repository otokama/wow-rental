import {Component, OnInit, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NotificationService} from '../../../_services/notification.service';
import {ReserveService} from '../../../_services/reserve.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {BranchLocation} from '../../../_models/branch';


@Component({
  selector: 'app-select-location',
  templateUrl: './select-location.component.html',
  styleUrls: ['./select-location.component.css']
})
export class SelectLocationComponent implements OnInit {
  fieldControl = new FormControl('', [Validators.required]);
  location: BranchLocation;
  pickup: boolean;
  sameLoc: boolean;
  options: BranchLocation[];
  filteredOptions: Observable<BranchLocation[]>;
  constructor( public dialogRef: MatDialogRef<SelectLocationComponent>,
               @Inject(MAT_DIALOG_DATA) data, private notif: NotificationService, private reserveService: ReserveService) {
    this.location = data.location;
    this.pickup = data.pickup;
  }

  ngOnInit() {
    this.sameLoc = false;
    this.options = this.reserveService.getAllBranchLocation();
    this.filteredOptions = this.fieldControl.valueChanges
        .pipe(
            startWith('*'),
            map(val => typeof val === 'string' ? val : val.name),
            map(name => name ? this._filter(name) : this.options.slice())
        );
  }

  save() {
    if (this.location) {
      if (this.location.val !== undefined) {
        this.dialogRef.close({locationID: this.location.val, sameLoc: this.sameLoc});
      } else {
        this.notif.showNotif('Select a valid location', 'Dismiss');
      }
    } else {
      this.notif.showNotif('Select a location', 'Dismiss');
    }
  }

  displayLoc(loc: BranchLocation): string {
    return loc && loc.name ? loc.name : '';
  }

  private _filter(name: string): BranchLocation[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  enterKeyHandler(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      this.save();
    }
  }
}
