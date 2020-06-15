import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SuiteDbManagementService } from '../suite-db-management.service';

@Component({
  selector: 'app-management-navbar',
  templateUrl: './management-navbar.component.html',
  styleUrls: ['./management-navbar.component.css']
})
export class ManagementNavbarComponent implements OnInit {

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

  selectTab(str: string) {
    this.suiteDbManagementService.selectedTab.next(str);
  }
}
