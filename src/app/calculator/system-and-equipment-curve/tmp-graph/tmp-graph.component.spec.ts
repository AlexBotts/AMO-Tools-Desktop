import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TmpGraphComponent } from './tmp-graph.component';

describe('TmpGraphComponent', () => {
  let component: TmpGraphComponent;
  let fixture: ComponentFixture<TmpGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmpGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmpGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
