import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiteDbManagementComponent } from './suite-db-management.component';

describe('SuiteDbManagementComponent', () => {
  let component: SuiteDbManagementComponent;
  let fixture: ComponentFixture<SuiteDbManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuiteDbManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiteDbManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
