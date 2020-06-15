import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolidLiquidFuelsComponent } from './solid-liquid-fuels.component';

describe('SolidLiquidFuelsComponent', () => {
  let component: SolidLiquidFuelsComponent;
  let fixture: ComponentFixture<SolidLiquidFuelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolidLiquidFuelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolidLiquidFuelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
