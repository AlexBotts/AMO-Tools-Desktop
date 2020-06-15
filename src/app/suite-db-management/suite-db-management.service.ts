import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SuiteDbManagementService {

  selectedTab: BehaviorSubject<string>;
  constructor() { 
    this.selectedTab = new BehaviorSubject<string>('pumps');
  }
}
