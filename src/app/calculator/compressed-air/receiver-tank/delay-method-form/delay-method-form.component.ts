import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ReceiverTankBridgingCompressor } from "../../../../shared/models/standalone";
import { StandaloneService } from '../../../standalone.service';
import { CompressedAirService } from '../../compressed-air.service';
import { Settings } from '../../../../shared/models/settings';

@Component({
  selector: 'app-delay-method-form',
  templateUrl: './delay-method-form.component.html',
  styleUrls: ['./delay-method-form.component.css']
})
export class DelayMethodFormComponent implements OnInit {
  @Input()
  toggleResetData: boolean;
  @Input()
  settings: Settings;
  @Output('emitChangeField')
  emitChangeField = new EventEmitter<string>();
  inputs: ReceiverTankBridgingCompressor;
  totalReceiverVolume: number;

  constructor(private compressedAirService: CompressedAirService, private standaloneService: StandaloneService) {
  }

  ngOnInit() {
    this.inputs = this.compressedAirService.bridgeCompressorInputs;
    this.getTotalReceiverVolume();
  }

  getTotalReceiverVolume() {
    this.totalReceiverVolume = this.standaloneService.receiverTankSizeBridgingCompressor(this.inputs, this.settings);
  }
  changeField(str: string) {
    this.emitChangeField.emit(str);
  }
}
