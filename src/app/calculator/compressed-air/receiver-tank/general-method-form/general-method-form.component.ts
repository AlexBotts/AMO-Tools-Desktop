import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ReceiverTankGeneral } from "../../../../shared/models/standalone";
import { StandaloneService } from '../../../standalone.service';
import { CompressedAirService } from '../../compressed-air.service';
import { Settings } from '../../../../shared/models/settings';

@Component({
  selector: 'app-general-method-form',
  templateUrl: './general-method-form.component.html',
  styleUrls: ['./general-method-form.component.css']
})
export class GeneralMethodFormComponent implements OnInit {
  @Input()
  toggleResetData: boolean;
  @Input()
  settings: Settings;
  @Output('emitChangeField')
  emitChangeField = new EventEmitter<string>();

  inputs: ReceiverTankGeneral;
  finalTankPressure: number;

  constructor(private compressedAirService: CompressedAirService, private standAloneService: StandaloneService) { }

  ngOnInit() {
    this.inputs = this.compressedAirService.generalMethodInputs;
    this.getStorage();
  }

  getStorage() {
    this.finalTankPressure = this.standAloneService.receiverTankSizeGeneral(this.inputs, this.settings);
  }

  changeField(str: string) {
    this.emitChangeField.emit(str);
  }
}
