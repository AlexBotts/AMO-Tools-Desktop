import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtmosphereGasComponent } from './atmosphere-gas.component';

describe('AtmosphereGasComponent', () => {
  let component: AtmosphereGasComponent;
  let fixture: ComponentFixture<AtmosphereGasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtmosphereGasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtmosphereGasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
