import { TestBed, inject } from '@angular/core/testing';

import { SankeyChartService } from './sankey-chart.service';

describe('SankeyChartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SankeyChartService]
    });
  });

  it('should be created', inject([SankeyChartService], (service: SankeyChartService) => {
    expect(service).toBeTruthy();
  }));
});
