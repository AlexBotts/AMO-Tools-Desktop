import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SuiteDbManagementService } from './suite-db-management.service';

@Component({
  selector: 'app-suite-db-management',
  templateUrl: './suite-db-management.component.html',
  styleUrls: ['./suite-db-management.component.css']
})
export class SuiteDbManagementComponent implements OnInit {

  selectedTab: string;
  selectedTabSub: Subscription;
  constructor(private suiteDbManagementService: SuiteDbManagementService) { }

  ngOnInit(): void {
    this.selectedTabSub = this.suiteDbManagementService.selectedTab.subscribe(val => {
      this.selectedTab = val;
    });
  }

  ngOnDestroy() {
    this.selectedTabSub.unsubscribe();
  }

}
