import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Settings } from '../../../shared/models/settings';
import { Assessment } from '../../../shared/models/assessment';
import { PHAST } from '../../../shared/models/phast/phast';

@Component({
  selector: 'app-losses-result-panel',
  templateUrl: './losses-result-panel.component.html',
  styleUrls: ['./losses-result-panel.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LossesResultPanelComponent implements OnInit {
  @Input()
  lossesTab: string;
  @Input()
  currentField: string;
  @Input()
  settings: Settings;
  @Input()
  phast: PHAST;
  @Input()
  toggleCalculate: boolean;
  @Input()
  modification: PHAST;
  @Input()
  inSetup: boolean;

  tabSelect: string = 'results';
  constructor() { }

  ngOnInit() {
    console.log(this.phast);
  }

  setTab(str: string){
    this.tabSelect = str;
  }
}
