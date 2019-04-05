import { Component, OnInit, Input } from '@angular/core';
import { SSMTInputs } from '../../../../shared/models/steam/ssmt';
import { Settings } from '../../../../shared/models/settings';

@Component({
  selector: 'app-header-summary',
  templateUrl: './header-summary.component.html',
  styleUrls: ['./header-summary.component.css']
})
export class HeaderSummaryComponent implements OnInit {
  @Input()
  baselineInputData: SSMTInputs;
  @Input()
  modificationInputData: Array<{ name: string, inputData: SSMTInputs }>;
  @Input()
  settings: Settings;
  @Input()
  printView: boolean;

  collapse: boolean = true;
  numMods: number = 0;

  constructor() { }

  ngOnInit() {
    if (this.modificationInputData) {
      this.numMods = this.modificationInputData.length;
    }
  }

  toggleCollapse() {
    this.collapse = !this.collapse;
  }

}
