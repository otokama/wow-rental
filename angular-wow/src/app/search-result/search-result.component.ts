import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReserveService } from '../_services/reserve.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  pickUpLoc; pickupBranch: string;
  dropOffLoc; dropOffBranch: string;
  pickUpDate: Date;
  dropOffDate: Date;
  constructor(private route: ActivatedRoute, private router: Router,
              private reserveService: ReserveService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.pickUpLoc = params.pickUpLoc;
      this.pickUpDate = params.pickUpDate;
      this.dropOffLoc = params.dropOffLoc;
      this.dropOffDate = params.dropOffDate;
      this.initBranchName();
    })
    if (!this.pickUpLoc || !this.pickUpDate
        || !this.dropOffLoc || !this.dropOffDate) {
      this.router.navigate(['/']);
    }
  }

  initBranchName() {
    if (this.pickUpLoc && this.dropOffLoc) {
      this.pickupBranch = this.reserveService.getBranchName((this.pickUpLoc));
      this.dropOffBranch = this.reserveService.getBranchName(this.dropOffLoc);
    }
  }



}