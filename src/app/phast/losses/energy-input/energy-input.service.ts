import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EnergyInput } from '../../../shared/models/phast/losses/energyInput';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class EnergyInputService {

  deleteLossIndex: BehaviorSubject<number>;
  addLossBaselineMonitor: BehaviorSubject<any>;
  addLossModificationMonitor: BehaviorSubject<any>;
  constructor(private formBuilder: FormBuilder) {
    this.deleteLossIndex = new BehaviorSubject<number>(null);
    this.addLossBaselineMonitor = new BehaviorSubject<any>(null);
    this.addLossModificationMonitor = new BehaviorSubject<any>(null);
  }

  setDelete(num: number) {
    this.deleteLossIndex.next(num);
  }
  addLoss(bool: boolean) {
    if (bool) {
      this.addLossModificationMonitor.next(true);
    } else {
      this.addLossBaselineMonitor.next(true);
    }
  }
  initForm() {
    return this.formBuilder.group({
      naturalGasHeatInput: ['', Validators.required],
      naturalGasFlow: ['', Validators.required],
      measuredOxygenFlow: ['', Validators.required],
      coalCarbonInjection: ['', Validators.required],
      coalHeatingValue: ['', Validators.required],
      electrodeUse: ['', Validators.required],
      electrodeHeatingValue: ['', Validators.required],
      otherFuels: ['', Validators.required],
      electricityInput: ['', Validators.required]
    })
  }

  getLossFromForm(form: any): EnergyInput {
    let tmpEnergyInput: EnergyInput = {
      naturalGasHeatInput: form.value.naturalGasHeatInput,
      naturalGasFlow: form.value.naturalGasFlow,
      measuredOxygenFlow: form.value.measuredOxygenFlow,
      coalCarbonInjection: form.value.coalCarbonInjection,
      coalHeatingValue: form.value.coalHeatingValue,
      electrodeUse: form.value.electrodeUse,
      electrodeHeatingValue: form.value.electrodeHeatingValue,
      otherFuels: form.value.otherFuels,
      electricityInput: form.value.electricityInput
    }
    return tmpEnergyInput;
  }

  getFormFromLoss(loss: EnergyInput) {
    return this.formBuilder.group({
      naturalGasHeatInput: [loss.naturalGasHeatInput, Validators.required],
      naturalGasFlow: [loss.naturalGasFlow, Validators.required],
      measuredOxygenFlow: [loss.measuredOxygenFlow, Validators.required],
      coalCarbonInjection: [loss.coalCarbonInjection, Validators.required],
      coalHeatingValue: [loss.coalHeatingValue, Validators.required],
      electrodeUse: [loss.electrodeUse, Validators.required],
      electrodeHeatingValue: [loss.electrodeHeatingValue, Validators.required],
      otherFuels: [loss.otherFuels, Validators.required],
      electricityInput: [loss.electricityInput, Validators.required]
    })
  }
}
