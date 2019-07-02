import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SuiteDbService } from '../../../../../suiteDb/suite-db.service';
import { LossesService } from '../../../../../phast/losses/losses.service';
import { PhastService } from '../../../../../phast/phast.service';
import { FormGroup, Validators } from '@angular/forms';
import { Settings } from '../../../../../shared/models/settings';
import { ConvertUnitsService } from '../../../../../shared/convert-units/convert-units.service';

@Component({
  selector: 'app-stack-loss-by-volume',
  templateUrl: './stack-loss-by-volume.component.html',
  styleUrls: ['./stack-loss-by-volume.component.css']
})
export class StackLossByVolumeComponent implements OnInit {
  @Input()
  stackLossForm: FormGroup;
  @Output('emitCalculate')
  emitCalculate = new EventEmitter<FormGroup>();
  @Output('changeField')
  changeField = new EventEmitter<string>();
  @Input()
  settings: Settings;

  options: any;
  calculationMethods: Array<string> = [
    'Excess Air',
    'Oxygen in Flue Gas'
  ];
  calculationExcessAir: number = 0.0;
  calculationFlueGasO2: number = 0.0;
  calcMethodExcessAir: boolean;
  stackTemperatureWarning: boolean = false;
  tempMin: number;
  constructor(private suiteDbService: SuiteDbService, private phastService: PhastService, private convertUnitsService: ConvertUnitsService) { }

  ngOnInit() {
    this.options = this.suiteDbService.selectGasFlueGasMaterials();
    if (this.stackLossForm) {
      if (this.stackLossForm.controls.gasTypeId.value && this.stackLossForm.controls.gasTypeId.value !== '') {
        if (this.stackLossForm.controls.CH4.value === '' || !this.stackLossForm.controls.CH4.value) {
          this.setProperties();
        }
      }
    }
    this.setCalcMethod();
    this.setCombustionValidation();
    this.setFuelTempValidation();
    this.tempMin = 212;
    if (this.settings.unitsOfMeasure == 'Metric') {
      this.tempMin = this.convertUnitsService.value(this.tempMin).from('F').to('C');
      this.tempMin = this.convertUnitsService.roundVal(this.tempMin, 1);
    }
    this.checkStackLossTemp();
  }
  focusOut() {
    this.changeField.emit('default');
  }
  focusField(str: string) {
    this.changeField.emit(str);
  }

  setCombustionValidation() {
    this.stackLossForm.controls.combustionAirTemperature.setValidators([Validators.required, Validators.max(this.stackLossForm.controls.flueGasTemperature.value)]);
    this.stackLossForm.controls.combustionAirTemperature.reset(this.stackLossForm.controls.combustionAirTemperature.value);
    if (this.stackLossForm.controls.combustionAirTemperature.value) {
      this.stackLossForm.controls.combustionAirTemperature.markAsDirty();
    }
    this.calculate();
  }

  setFuelTempValidation() {
    this.stackLossForm.controls.flueGasTemperature.setValidators([Validators.required, Validators.min(this.stackLossForm.controls.combustionAirTemperature.value)]);
    this.stackLossForm.controls.flueGasTemperature.reset(this.stackLossForm.controls.flueGasTemperature.value);
    if (this.stackLossForm.controls.flueGasTemperature.value) {
      this.stackLossForm.controls.flueGasTemperature.markAsDirty();
    }
    this.calculate();
  }

  calcExcessAir() {
    let input = {
      CH4: this.stackLossForm.controls.CH4.value,
      C2H6: this.stackLossForm.controls.C2H6.value,
      N2: this.stackLossForm.controls.N2.value,
      H2: this.stackLossForm.controls.H2.value,
      C3H8: this.stackLossForm.controls.C3H8.value,
      C4H10_CnH2n: this.stackLossForm.controls.C4H10_CnH2n.value,
      H2O: this.stackLossForm.controls.H2O.value,
      CO: this.stackLossForm.controls.CO.value,
      CO2: this.stackLossForm.controls.CO2.value,
      SO2: this.stackLossForm.controls.SO2.value,
      O2: this.stackLossForm.controls.O2.value,
      o2InFlueGas: this.stackLossForm.controls.o2InFlueGas.value,
      excessAir: this.stackLossForm.controls.excessAirPercentage.value
    };

    if (!this.calcMethodExcessAir) {
      if (this.stackLossForm.controls.o2InFlueGas.status === 'VALID') {
        this.calculationExcessAir = this.phastService.flueGasCalculateExcessAir(input);
        this.stackLossForm.patchValue({
          excessAirPercentage: this.calculationExcessAir,
        });
      } else {
        this.calculationExcessAir = 0;
        this.stackLossForm.patchValue({
          excessAirPercentage: this.calculationExcessAir,
        });
      }
    }

    if (this.calcMethodExcessAir) {
      if (this.stackLossForm.controls.excessAirPercentage.status === 'VALID') {
        this.calculationFlueGasO2 = this.phastService.flueGasCalculateO2(input);
        this.stackLossForm.patchValue({
          o2InFlueGas: this.calculationFlueGasO2,
        });
      } else {
        this.calculationFlueGasO2 = 0;
        this.stackLossForm.patchValue({
          o2InFlueGas: this.calculationFlueGasO2,
        });
      }
    }
    this.calculate();
  }

  setProperties() {
    let tmpFlueGas = this.suiteDbService.selectGasFlueGasMaterialById(this.stackLossForm.controls.gasTypeId.value);
    this.stackLossForm.patchValue({
      CH4: this.roundVal(tmpFlueGas.CH4, 4),
      C2H6: this.roundVal(tmpFlueGas.C2H6, 4),
      N2: this.roundVal(tmpFlueGas.N2, 4),
      H2: this.roundVal(tmpFlueGas.H2, 4),
      C3H8: this.roundVal(tmpFlueGas.C3H8, 4),
      C4H10_CnH2n: this.roundVal(tmpFlueGas.C4H10_CnH2n, 4),
      H2O: this.roundVal(tmpFlueGas.H2O, 4),
      CO: this.roundVal(tmpFlueGas.CO, 4),
      CO2: this.roundVal(tmpFlueGas.CO2, 4),
      SO2: this.roundVal(tmpFlueGas.SO2, 4),
      O2: this.roundVal(tmpFlueGas.O2, 4)
    });
    this.calculate();
  }
  roundVal(val: number, digits: number) {
    let test = Number(val.toFixed(digits));
    return test;
  }

  calculate() {
    this.checkStackLossTemp();
    this.emitCalculate.emit(this.stackLossForm);
  }

  setFuelTemp() {
    this.stackLossForm.patchValue({
      fuelTemperature: this.stackLossForm.controls.combustionAirTemperature.value
    });
    this.calculate();
  }

  changeMethod() {
    this.stackLossForm.patchValue({
      o2InFlueGas: 0,
      excessAirPercentage: 0
    });
    this.setCalcMethod();
  }

  setCalcMethod() {
    if (this.stackLossForm.controls.oxygenCalculationMethod.value === 'Excess Air') {
      this.calcMethodExcessAir = true;
    } else {
      this.calcMethodExcessAir = false;
    }
    this.calcExcessAir();
  }

  checkStackLossTemp() {
    if (this.stackLossForm.controls.flueGasTemperature.value && this.stackLossForm.controls.flueGasTemperature.value < this.tempMin) {
      this.stackTemperatureWarning = true;
    } else {
      this.stackTemperatureWarning = false;
    }
  }

}
