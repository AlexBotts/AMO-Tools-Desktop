import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WallSurfacesComponent } from './wall-surfaces.component';

describe('WallSurfacesComponent', () => {
  let component: WallSurfacesComponent;
  let fixture: ComponentFixture<WallSurfacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WallSurfacesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WallSurfacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
