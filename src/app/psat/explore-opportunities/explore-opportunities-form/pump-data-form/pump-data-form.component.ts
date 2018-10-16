import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { PSAT } from '../../../../shared/models/psat';
import { PsatService } from '../../../psat.service';
import { Settings } from '../../../../shared/models/settings';
import { ConvertUnitsService } from '../../../../shared/convert-units/convert-units.service';
@Component({
  selector: 'app-pump-data-form',
  templateUrl: './pump-data-form.component.html',
  styleUrls: ['./pump-data-form.component.css']
})
export class PumpDataFormComponent implements OnInit {
  @Input()
  psat: PSAT;
  @Output('emitCalculate')
  emitCalculate = new EventEmitter<boolean>();
  @Output('changeField')
  changeField = new EventEmitter<string>();
  @Input()
  settings: Settings;
  @Input()
  exploreModIndex: number;

  showPumpData: boolean = false;
  showPumpType: boolean = false;
  showMotorDrive: boolean = false;
  showPumpSpecified: boolean = false;


  pumpTypes: Array<string> = [
    'End Suction Slurry',
    'End Suction Sewage',
    'End Suction Stock',
    'End Suction Submersible Sewage',
    'API Double Suction',
    'Multistage Boiler Feed',
    'End Suction ANSI/API',
    'Axial Flow',
    'Double Suction',
    'Vertical Turbine',
    'Large End Suction'
  ];
  drives: Array<string> = [
    'Direct Drive',
    'V-Belt Drive',
    'Notched V-Belt Drive',
    'Synchronous Belt Drive',
    'Specified Efficiency'
  ];

  tmpModificationPumpType: string;
  tmpBaselinePumpType: string;
  tmpModificationMotorDrive: string;
  tmpBaselineMotorDrive: string;
  baselineSpecifiedDriveEfficiency: number;
  modificationSpecifiedDriveEfficiency: number;

  specifiedError2: string = null;
  specifiedError1: string = null;
  baselineSpecifiedDriveEfficiencyError: string = null;
  modificationSpecifiedDriveEfficiencyError: string = null;

  pumpTypeTrueConst: boolean = true;
  constructor(private psatService: PsatService) {

  }

  ngOnInit() {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.exploreModIndex) {
      if (!changes.exploreModIndex.isFirstChange()) {
        this.init()
      }
    }
  }

  init() {
    this.tmpModificationPumpType = this.psatService.getPumpStyleFromEnum(this.psat.modifications[this.exploreModIndex].psat.inputs.pump_style);
    this.tmpBaselinePumpType = this.psatService.getPumpStyleFromEnum(this.psat.inputs.pump_style);
    this.tmpModificationMotorDrive = this.psatService.getDriveFromEnum(this.psat.modifications[this.exploreModIndex].psat.inputs.drive);
    this.tmpBaselineMotorDrive = this.psatService.getDriveFromEnum(this.psat.inputs.drive);
    this.baselineSpecifiedDriveEfficiency = this.psat.inputs.specifiedDriveEfficiency;
    this.modificationSpecifiedDriveEfficiency = this.psat.modifications[this.exploreModIndex].psat.inputs.specifiedDriveEfficiency;
    this.initPumpSpecified();
    this.initMotorDrive();
    this.initPumpType();
    this.initPumpData();
  }

  initPumpType() {
    if (this.tmpModificationPumpType != this.tmpBaselinePumpType) {
      this.showPumpType = true;
    }else{
      this.showPumpType = false;
    }
  }

  initMotorDrive() {
    if (this.tmpBaselineMotorDrive != this.tmpModificationMotorDrive) {
      this.showMotorDrive = true;
    }else{
      this.showMotorDrive = false;
    }
  }

  initPumpSpecified() {
    if (this.psat.modifications[this.exploreModIndex].psat.inputs.pump_specified != this.psat.inputs.pump_specified) {
      this.showPumpSpecified = true;
    }else{
      this.showPumpSpecified = false;
    }

  }

  initPumpData() {
    if (this.showMotorDrive || this.showPumpSpecified || this.showPumpType) {
      this.showPumpData = true;
    }else{
      this.showPumpData = false;
    }
  }

  togglePumpData() {
    if (this.showPumpData == false) {
      this.showPumpSpecified = false;
      this.showPumpType = false;
      this.showMotorDrive = false;
      this.togglePumpSpecified();
      this.togglePumpType();
      this.toggleMotorDrive();
    }
  }
  togglePumpSpecified() {
    if (this.showPumpSpecified == false) {
      this.psat.modifications[this.exploreModIndex].psat.inputs.pump_specified = this.psat.inputs.pump_specified;
      this.calculate();
    }
  }

  togglePumpType() {
    if (this.showPumpType == false) {
      this.psat.modifications[this.exploreModIndex].psat.inputs.pump_style = this.psat.inputs.pump_style;
      this.tmpModificationPumpType = this.psatService.getPumpStyleFromEnum(this.psat.inputs.pump_style);
      this.calculate();
    }
  }
  toggleMotorDrive() {
    if (this.showMotorDrive === false) {
      this.psat.modifications[this.exploreModIndex].psat.inputs.drive = this.psat.inputs.drive;
      this.tmpModificationMotorDrive = this.psatService.getDriveFromEnum(this.psat.inputs.drive);
      this.calculate();
    }
  }

  setPumpTypes() {
    this.checkPumpTypes();
    this.psat.inputs.pump_style = this.psatService.getPumpStyleEnum(this.tmpBaselinePumpType);
    this.psat.modifications[this.exploreModIndex].psat.inputs.pump_style = this.psatService.getPumpStyleEnum(this.tmpModificationPumpType);
    if (!this.psat.modifications[this.exploreModIndex].psat.inputs.pump_specified) {
      this.psat.modifications[this.exploreModIndex].psat.inputs.pump_specified = 90;
    }
    if (!this.psat.inputs.pump_specified) {
      this.psat.inputs.pump_specified = 90;
    }
    this.calculate();
  }

  setMotorDrive() {
    this.psat.inputs.drive = this.psatService.getDriveEnum(this.tmpBaselineMotorDrive);
    this.psat.modifications[this.exploreModIndex].psat.inputs.drive = this.psatService.getDriveEnum(this.tmpModificationMotorDrive);
    this.calculate();
  }

  setSpecifiedMotorDriveEfficiency() {
    this.checkEfficiency(this.baselineSpecifiedDriveEfficiency, 5);
    this.checkEfficiency(this.modificationSpecifiedDriveEfficiency, 6);
    if (this.baselineSpecifiedDriveEfficiencyError == null) {
      this.psat.inputs.specifiedDriveEfficiency = this.baselineSpecifiedDriveEfficiency;
    }
    if (this.modificationSpecifiedDriveEfficiencyError == null) {
      this.psat.modifications[this.exploreModIndex].psat.inputs.specifiedDriveEfficiency = this.modificationSpecifiedDriveEfficiency;
    }
    this.calculate();
  }

  checkEfficiency(val: number, num: number) {
    if (num != 5 && num != 6) {
      this.calculate();
    }
    if (val > 100) {
      this.setErrorMessage(num, "Unrealistic efficiency, shouldn't be greater then 100%");
      return false;
    }
    else if (val == 0) {
      this.setErrorMessage(num, "Cannot have 0% efficiency");
      return false;
    }
    else if (val < 0) {
      this.setErrorMessage(num, "Cannot have negative efficiency");
      return false;
    }
    else {
      this.setErrorMessage(num, null);
      return true;
    }
  }
  setErrorMessage(num: number, str: string) {
    if (num == 3) {
      this.specifiedError1 = str;
    } else if (num == 4) {
      this.specifiedError2 = str;
    } else if (num == 5) {
      this.baselineSpecifiedDriveEfficiencyError = str;
    } else if (num == 6) {
      this.modificationSpecifiedDriveEfficiencyError = str;
    }

  }

  checkPumpTypes() {
    if (this.tmpModificationPumpType == 'Specified Optimal Efficiency') {
      this.showPumpSpecified = true;
    } else {
      this.psat.modifications[this.exploreModIndex].psat.inputs.pump_specified = null;
    }
    if (this.tmpBaselinePumpType == 'Specified Optimal Efficiency') {
      this.showPumpSpecified = true;
    } else {
      this.psat.inputs.pump_specified = null;
    }
    if (this.tmpModificationPumpType != 'Specified Optimal Efficiency' && this.tmpBaselinePumpType != 'Specified Optimal Efficiency') {
      this.showPumpSpecified = false;
    }
  }

  calculate() {
    this.emitCalculate.emit(true);
  }

  focusField(str: string) {
    this.changeField.emit(str);
  }
}