import { Injectable } from '@angular/core';
import { PSAT } from '../../../shared/models/psat';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FSAT } from '../../../shared/models/fans';

@Injectable()
export class MotorPerformanceService {
  motorPerformanceInputs: MotorPerformanceInputs;
  constructor(private formBuilder: FormBuilder) { }

  initFormFromPsat(psat: PSAT): FormGroup {
    return this.formBuilder.group({
      frequency: [psat.inputs.line_frequency, [Validators.required]],
      horsePower: [psat.inputs.motor_rated_power, [Validators.required]],
      motorRPM: [psat.inputs.motor_rated_speed, [Validators.required]],
      efficiencyClass: [psat.inputs.efficiency_class, [Validators.required]],
      motorVoltage: [psat.inputs.motor_rated_voltage, [Validators.required]],
      fullLoadAmps: [psat.inputs.motor_rated_fla, [Validators.required]],
      sizeMargin: [1, [Validators.required]],
      efficiency: [psat.inputs.efficiency, [Validators.min(0), Validators.max(100)]]
    });
  }

  initFormFromFsat(fsat: FSAT): FormGroup{
    return this.formBuilder.group({
      frequency: [fsat.fanMotor.lineFrequency, [Validators.required]],
      horsePower: [fsat.fanMotor.motorRatedPower, [Validators.required]],
      motorRPM: [fsat.fanMotor.motorRpm, [Validators.required]],
      efficiencyClass: [fsat.fanMotor.efficiencyClass, [Validators.required]],
      motorVoltage: [fsat.fanMotor.motorRatedVoltage, [Validators.required]],
      fullLoadAmps: [fsat.fanMotor.fullLoadAmps, [Validators.required]],
      sizeMargin: [1, [Validators.required]],
      efficiency: [fsat.fanMotor.specifiedEfficiency, [Validators.min(0), Validators.max(100)]]
    });
  }

  initForm(): FormGroup {
   return this.formBuilder.group({
      frequency: [50, [Validators.required]],
      horsePower: [200, [Validators.required, Validators.min(0)]],
      motorRPM: [1780, [Validators.required]],
      efficiencyClass: [1, [Validators.required]],
      motorVoltage: [460, [Validators.required]],
      fullLoadAmps: [225.4, [Validators.required]],
      sizeMargin: [1, [Validators.required]],
      efficiency: [0, [Validators.min(0), Validators.max(100)]]
    });
  }

  initFormFromObj(inputs: MotorPerformanceInputs): FormGroup {
    return this.formBuilder.group({
      frequency: [inputs.frequency, [Validators.required]],
      horsePower: [inputs.horsePower, [Validators.required]],
      motorRPM: [inputs.motorRPM, [Validators.required]],
      efficiencyClass: [inputs.efficiencyClass, [Validators.required]],
      motorVoltage: [inputs.motorVoltage, [Validators.required]],
      fullLoadAmps: [inputs.fullLoadAmps, [Validators.required]],
      sizeMargin: [1, [Validators.required]],
      efficiency: [inputs.efficiency, [Validators.min(0), Validators.max(100)]]
    });
  }

  getObjFromForm(form: FormGroup): MotorPerformanceInputs {
    return {
      frequency: form.controls.frequency.value,
      horsePower: form.controls.horsePower.value,
      motorRPM: form.controls.motorRPM.value,
      efficiencyClass: form.controls.efficiencyClass.value,
      motorVoltage: form.controls.motorVoltage.value,
      fullLoadAmps: form.controls.fullLoadAmps.value,
      sizeMargin: form.controls.sizeMargin.value,
      efficiency: form.controls.efficiency.value,
    };
  }
}


export interface MotorPerformanceInputs {
  frequency: number;
  horsePower: number;
  motorRPM: number;
  efficiencyClass: number;
  motorVoltage: number;
  fullLoadAmps: number;
  sizeMargin: number;
  efficiency: number;
}
