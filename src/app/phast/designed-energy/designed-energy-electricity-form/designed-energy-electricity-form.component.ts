import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DesignedEnergyElectricity } from '../../../shared/models/phast/designedEnergy';

@Component({
  selector: 'app-designed-energy-electricity-form',
  templateUrl: './designed-energy-electricity-form.component.html',
  styleUrls: ['./designed-energy-electricity-form.component.css']
})
export class DesignedEnergyElectricityFormComponent implements OnInit {
  @Input()
  inputs: DesignedEnergyElectricity;
  @Output('emitCalculate')
  emitCalculate = new EventEmitter<boolean>();
  @Output('emitSave')
  emitSave = new EventEmitter<boolean>();
  @Output('changeField')
  changeField = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  focusField(str: string) {
    this.changeField.emit(str);
  }

  calculate() {
    this.emitSave.emit(true);
    this.emitCalculate.emit(true);
  }

}
