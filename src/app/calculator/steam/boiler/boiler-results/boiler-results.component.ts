import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Settings } from '../../../../shared/models/settings';
import { BoilerOutput, BoilerInput } from '../../../../shared/models/steam';
import { SteamService } from '../../steam.service';

@Component({
  selector: 'app-boiler-results',
  templateUrl: './boiler-results.component.html',
  styleUrls: ['./boiler-results.component.css']
})
export class BoilerResultsComponent implements OnInit {
  @Input()
  settings: Settings;
  @Input()
  results: BoilerOutput;
  @Input()
  inputData: BoilerInput;
  energyMeasurement: string;

  @ViewChild('copyTable0') copyTable0: ElementRef;
  table0String: any;
  @ViewChild('copyTable1') copyTable1: ElementRef;
  table1String: any;
  @ViewChild('copyTable2') copyTable2: ElementRef;
  table2String: any;
  @ViewChild('copyTable3') copyTable3: ElementRef;
  table3String: any;


  constructor(private steamService: SteamService) { }

  ngOnInit() {
    if (this.settings.steamEnergyMeasurement == 'kWh') {
      this.energyMeasurement = 'kW';
    } else {
      this.energyMeasurement = this.settings.steamEnergyMeasurement + '/hr';
    }
  }

  getDisplayUnit(unit: string) {
    if (unit) {
      return this.steamService.getDisplayUnit(unit);
    } else {
      return unit;
    }
  }

  updateTable0String() {
    this.table0String = this.copyTable0.nativeElement.innerText;
  }

  updateTable1String() {
    this.table1String = this.copyTable1.nativeElement.innerText;
  }

  updateTable2String() {
    this.table2String = this.copyTable2.nativeElement.innerText;
  }
  
  updateTable3String() {
    this.table3String = this.copyTable3.nativeElement.innerText;
  }
}
