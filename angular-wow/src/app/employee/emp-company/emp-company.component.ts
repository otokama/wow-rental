import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Company} from "../../_models/company";
import {CorporateService} from "../../_services/corporate.service";
import {NotificationService} from "../../_services/notification.service";

@Component({
  selector: 'app-emp-company',
  templateUrl: './emp-company.component.html',
  styleUrls: ['../displayTable.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class EmpCompanyComponent {
  company: Company[];
  displayColumns: string[] = ['Company Name', 'Company Discount', 'Registration Number'];
  namingColumns: string[] = ['corporateName', 'corporateDiscount', 'registrationNumber'];
  expandedElement: Company | null;
  constructor(private corporateService: CorporateService, private notif: NotificationService) {
    this.fetchCompany();
  }

  fetchCompany() {
    this.corporateService.getAllCorporate().subscribe(
        corporates => {
          if (corporates) {
            this.company = corporates;
          }
        }, error => {this.notif.showNotification('Cannot fetch company', 'Dismiss', true);}
    );
  }

  updateCompany(company) {
    console.log(company);
  }

  deleteCompany(company) {
    console.log(company);
  }

}
