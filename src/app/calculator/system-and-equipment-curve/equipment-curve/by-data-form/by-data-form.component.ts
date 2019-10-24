import { Component, OnInit, Input } from '@angular/core';
import { Settings } from '../../../../shared/models/settings';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { EquipmentCurveService } from '../equipment-curve.service';
import { SystemAndEquipmentCurveService, ByDataInputs } from '../../system-and-equipment-curve.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-by-data-form',
  templateUrl: './by-data-form.component.html',
  styleUrls: ['./by-data-form.component.css']
})
export class ByDataFormComponent implements OnInit {
  @Input()
  equipmentType: string;
  @Input()
  settings: Settings;

  byDataForm: FormGroup;
  yValueLabel: string;
  yValueUnit: string;
  flowUnit: string;
  formLabel: string;
  orderOptions: Array<number> = [
    2, 3, 4, 5, 6
  ];
  resetFormsSub: Subscription;
  constructor(private equipmentCurveService: EquipmentCurveService, private systemAndEquipmentCurveService: SystemAndEquipmentCurveService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    if (this.equipmentType == 'fan') {
      this.formLabel = 'Fan Data';
      this.yValueLabel = 'Pressure';
      this.flowUnit = this.settings.fanFlowRate;
      this.yValueUnit = this.settings.fanPressureMeasurement;
    } else {
      this.formLabel = 'Pump Data';
      this.yValueLabel = 'Head';
      this.flowUnit = this.settings.flowMeasurement;
      this.yValueUnit = this.settings.distanceMeasurement;
    }
    this.initForm();
    this.resetFormsSub = this.systemAndEquipmentCurveService.resetForms.subscribe(val => {
      if (val == true) {
        this.resetForm();
      }
    });
  }

  ngOnDestroy() {
    this.resetFormsSub.unsubscribe();
  }

  initForm() {
    let defaultData: ByDataInputs = this.systemAndEquipmentCurveService.byDataInputs.getValue();
    if (defaultData == undefined) {
      defaultData = this.equipmentCurveService.getByDataDefault(this.settings);
    }
    this.systemAndEquipmentCurveService.byDataInputs.next(defaultData);
    this.byDataForm = this.equipmentCurveService.getByDataFormFromObj(defaultData);
  }

  resetForm() {
    let defaultData: ByDataInputs = this.systemAndEquipmentCurveService.byDataInputs.getValue();
    this.byDataForm = this.equipmentCurveService.getByDataFormFromObj(defaultData);
  }

  save() {
    if (this.byDataForm.valid) {
      let data = this.equipmentCurveService.getByDataObjFromForm(this.byDataForm);
      this.systemAndEquipmentCurveService.byDataInputs.next(data);
    } else {
      this.systemAndEquipmentCurveService.byDataInputs.next(undefined);
    }
  }

  focusField(str: string) {
    this.systemAndEquipmentCurveService.focusedCalculator.next(this.equipmentType);
    this.systemAndEquipmentCurveService.currentField.next(str);
  }

  addRow() {
    let tmpDataRowForm = this.formBuilder.group({
      flow: [0, [Validators.required, Validators.max(1000000)]],
      yValue: [0, [Validators.required, Validators.min(0)]]
    });
    this.byDataForm.controls.dataRows.value.controls.push(tmpDataRowForm);
    this.save();
  }

  removeRow(index: number) {
    this.byDataForm.controls.dataRows.value.controls.splice(index, 1);
    this.save();
  }
}