import { Component, OnInit, Input, SimpleChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { PhastService } from '../../phast.service';
import { Losses } from '../../../shared/models/phast/phast';
import { EnergyInputService } from './energy-input.service';
import { EnergyInputEAF } from '../../../shared/models/phast/losses/energyInputEAF';
import { EnergyInputCompareService } from './energy-input-compare.service';
import { Settings } from '../../../shared/models/settings';

@Component({
  selector: 'app-energy-input',
  templateUrl: './energy-input.component.html',
  styleUrls: ['./energy-input.component.css']
})
export class EnergyInputComponent implements OnInit {
  @Input()
  losses: Losses;
  @Input()
  saveClicked: boolean;
  @Input()
  addLossToggle: boolean;
  @Output('savedLoss')
  savedLoss = new EventEmitter<boolean>();
  @Input()
  baselineSelected: boolean;
  @Output('fieldChange')
  fieldChange = new EventEmitter<string>();
  @Input()
  isBaseline: boolean;
  @Input()
  settings: Settings;

  _energyInputs: Array<any>;
  firstChange: boolean = true;
  constructor(private energyInputService: EnergyInputService, private phastService: PhastService, private energyInputCompareService: EnergyInputCompareService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.firstChange) {
      if (changes.saveClicked) {
        this.saveLosses();
      }
      if (changes.addLossToggle) {
        this.addLoss();
      }
    }
    else {
      this.firstChange = false;
    }
  }

  ngOnInit() {
    if (!this._energyInputs) {
      this._energyInputs = new Array();
    }
    if (this.losses.energyInputEAF) {
      this.setCompareVals();
      this.energyInputCompareService.initCompareObjects();
      this.losses.energyInputEAF.forEach(loss => {
        let tmpLoss = {
          form: this.energyInputService.getFormFromLoss(loss),
          name: 'Input #' + (this._energyInputs.length + 1),
          results: {
            heatDelivered: 0,
            kwhCycle: 0,
            totalKwhCycle: 0
          }
        };
        this.calculate(tmpLoss);
        this._energyInputs.push(tmpLoss);
      })
    }
    this.energyInputService.deleteLossIndex.subscribe((lossIndex) => {
      if (lossIndex != undefined) {
        if (this.losses.energyInputEAF) {
          this._energyInputs.splice(lossIndex, 1);
          if (this.energyInputCompareService.differentArray && !this.isBaseline) {
            this.energyInputCompareService.differentArray.splice(lossIndex, 1);
          }
        }
      }
    })
    if (this.isBaseline) {
      this.energyInputService.addLossBaselineMonitor.subscribe((val) => {
        if (val == true) {
          this._energyInputs.push({
            form: this.energyInputService.initForm(),
            name: 'Loss #' + (this._energyInputs.length + 1),
            results: {
              heatDelivered: 0,
              kwhCycle: 0,
              totalKwhCycle: 0
            }
          });
        }
      })
    } else {
      this.energyInputService.addLossModificationMonitor.subscribe((val) => {
        if (val == true) {
          this._energyInputs.push({
            form: this.energyInputService.initForm(),
            name: 'Loss #' + (this._energyInputs.length + 1),
            results: {
              heatDelivered: 0,
              kwhCycle: 0,
              totalKwhCycle: 0
            }
          })
        }
      })
    }
  }

  ngOnDestroy() {
    this.energyInputCompareService.baselineEnergyInput = null;
    this.energyInputCompareService.modifiedEnergyInput = null;
    this.energyInputService.deleteLossIndex.next(null);
    this.energyInputService.addLossBaselineMonitor.next(false);
    this.energyInputService.addLossModificationMonitor.next(false);
  }

  addLoss() {
    this.energyInputService.addLoss(this.isBaseline);
    if (this.energyInputCompareService.differentArray) {
      this.energyInputCompareService.addObject(this.energyInputCompareService.differentArray.length - 1);
    }
    this._energyInputs.push({
      form: this.energyInputService.initForm(),
      name: 'Loss #' + (this._energyInputs.length + 1),
      results: {
        heatDelivered: 0,
        kwhCycle: 0,
        totalKwhCycle: 0
      }
    });
  }

  removeLoss(lossIndex: number) {
    this.energyInputService.setDelete(lossIndex);
  }

  renameLossess() {
    let index = 1;
    this._energyInputs.forEach(loss => {
      loss.name = 'Loss #' + index;
      index++;
    })
  }

  calculate(loss: any) {
    let tmpLoss: EnergyInputEAF = this.energyInputService.getLossFromForm(loss.form);
    let calculation = this.phastService.energyInputEAF(tmpLoss);
    console.log(calculation);
    loss.results = {
      heatDelivered: calculation.heatDelivered,
      totalChemicalEnergyInput: calculation.totalChemicalEnergyInput
    }
  }

  saveLosses() {
    let tmpEnergyInputs = new Array<EnergyInputEAF>();
    this._energyInputs.forEach(loss => {
      let tmpEnergyInput = this.energyInputService.getLossFromForm(loss.form);
      tmpEnergyInputs.push(tmpEnergyInput);
    })
    this.losses.energyInputEAF = tmpEnergyInputs;
    this.setCompareVals();
    this.savedLoss.emit(true);
  }

  changeField(str: string) {
    this.fieldChange.emit(str);
  }

  setCompareVals() {
    if (this.isBaseline) {
      this.energyInputCompareService.baselineEnergyInput = this.losses.energyInputEAF;
    } else {
      this.energyInputCompareService.modifiedEnergyInput = this.losses.energyInputEAF;
    }
    if (this.energyInputCompareService.differentArray && !this.isBaseline) {
      if (this.energyInputCompareService.differentArray.length != 0) {
        this.energyInputCompareService.checkEnergyInputs();
      }
    }
  }
}
