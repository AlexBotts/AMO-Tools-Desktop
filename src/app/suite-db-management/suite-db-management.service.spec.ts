import { TestBed } from '@angular/core/testing';

import { SuiteDbManagementService } from './suite-db-management.service';

describe('SuiteDbManagementService', () => {
  let service: SuiteDbManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuiteDbManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
