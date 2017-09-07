import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { WindowRefService } from "../../../../indexedDb/window-ref.service";
import { AtmosphereLossesCompareService } from '../atmosphere-losses-compare.service';
import { SuiteDbService } from '../../../../suiteDb/suite-db.service';
import { AtmosphereSpecificHeat } from '../../../../shared/models/materials';
import { ModalDirective } from 'ngx-bootstrap';
import { LossesService } from '../../losses.service';
import { Settings } from '../../../../shared/models/settings';

@Component({
  selector: 'app-atmosphere-losses-form',
  templateUrl: './atmosphere-losses-form.component.html',
  styleUrls: ['./atmosphere-losses-form.component.css']
})
export class AtmosphereLossesFormComponent implements OnInit {
  @Input()
  atmosphereLossForm: any;
  @Output('calculate')
  calculate = new EventEmitter<boolean>();
  @Input()
  baselineSelected: boolean;
  @Output('changeField')
  changeField = new EventEmitter<string>();
  @Output('saveEmit')
  saveEmit = new EventEmitter<boolean>();
  @Input()
  lossIndex: number;
  @Input()
  settings: Settings;

  @ViewChild('materialModal') public materialModal: ModalDirective;
  @ViewChild('lossForm') lossForm: ElementRef;
  form: any;
  elements: any;

  firstChange: boolean = true;
  counter: any;

  temperatureError: string = null;
  materialTypes: Array<AtmosphereSpecificHeat>;
  showModal: boolean = false;
  constructor(private windowRefService: WindowRefService, private atmosphereLossesCompareService: AtmosphereLossesCompareService, private suiteDbService: SuiteDbService, private lossesService: LossesService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.firstChange) {
      if (!this.baselineSelected) {
        this.disableForm();
      } else {
        this.enableForm();
      }
    } else {
      this.firstChange = false;
    }
  }

  ngOnInit() {
    this.materialTypes = this.suiteDbService.selectAtmosphereSpecificHeat();
    this.checkTempError(true);
  }

  ngAfterViewInit() {
    if (!this.baselineSelected) {
      this.disableForm();
    }
    this.initDifferenceMonitor();
  }

  setProperties() {
    let selectedMaterial = this.suiteDbService.selectAtmosphereSpecificHeatById(this.atmosphereLossForm.value.atmosphereGas);
    this.atmosphereLossForm.patchValue({
      specificHeat: selectedMaterial.specificHeat,
    });
    this.startSavePolling();
  }

  disableForm() {
    this.elements = this.lossForm.nativeElement.elements;
    for (var i = 0, len = this.elements.length; i < len; ++i) {
      this.elements[i].disabled = true;
    }
  }

  enableForm() {
    this.elements = this.lossForm.nativeElement.elements;
    for (var i = 0, len = this.elements.length; i < len; ++i) {
      this.elements[i].disabled = false;
    }
  }

  checkForm() {
    if (this.atmosphereLossForm.status == "VALID") {
      this.calculate.emit(true);
    }
  }

  checkTempError(bool?: boolean) {
    if (!bool) {
      this.startSavePolling();
    }
    if (this.atmosphereLossForm.value.inletTemp > this.atmosphereLossForm.value.outletTemp) {
      this.temperatureError = 'Inlet temperature is greater than outlet temperature'
    } else {
      this.temperatureError = null;
    }
  }

  focusField(str: string) {
    this.changeField.emit(str);
  }

  emitSave() {
    this.saveEmit.emit(true);
  }

  startSavePolling() {
    this.checkForm();
    if (this.counter) {
      clearTimeout(this.counter);
    }
    this.counter = setTimeout(() => {
      this.emitSave();
    }, 3000)
  }

  initDifferenceMonitor() {
    if (this.atmosphereLossesCompareService.baselineAtmosphereLosses && this.atmosphereLossesCompareService.modifiedAtmosphereLosses && this.atmosphereLossesCompareService.differentArray.length != 0) {
      if (this.atmosphereLossesCompareService.differentArray[this.lossIndex]) {
        let doc = this.windowRefService.getDoc();

        //atmosphereGas
        this.atmosphereLossesCompareService.differentArray[this.lossIndex].different.atmosphereGas.subscribe((val) => {
          let atmosphereGasElements = doc.getElementsByName('atmosphereGas_' + this.lossIndex);
          atmosphereGasElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
        //specificHeat
        this.atmosphereLossesCompareService.differentArray[this.lossIndex].different.specificHeat.subscribe((val) => {
          let specificHeatElements = doc.getElementsByName('specificHeat_' + this.lossIndex);
          specificHeatElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
        //inletTemp
        this.atmosphereLossesCompareService.differentArray[this.lossIndex].different.inletTemperature.subscribe((val) => {
          let inletTempElements = doc.getElementsByName('inletTemp_' + this.lossIndex);
          inletTempElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
        //outletTemp
        this.atmosphereLossesCompareService.differentArray[this.lossIndex].different.outletTemperature.subscribe((val) => {
          let outletTempElements = doc.getElementsByName('outletTemp_' + this.lossIndex);
          outletTempElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
        //flowRate
        this.atmosphereLossesCompareService.differentArray[this.lossIndex].different.flowRate.subscribe((val) => {
          let flowRateElements = doc.getElementsByName('flowRate_' + this.lossIndex);
          flowRateElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
        //correctionFactor
        this.atmosphereLossesCompareService.differentArray[this.lossIndex].different.correctionFactor.subscribe((val) => {
          let correctionFactorElements = doc.getElementsByName('correctionFactor_' + this.lossIndex);
          correctionFactorElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
      }
    }
  }

  showMaterialModal() {
    this.showModal = true;
    this.lossesService.modalOpen.next(this.showModal);
    this.materialModal.show();
  }

  hideMaterialModal(event?: any) {
    if (event) {
      this.materialTypes = this.suiteDbService.selectAtmosphereSpecificHeat();
      let newMaterial = this.materialTypes.filter(material => { return material.substance == event.substance })
      if (newMaterial.length != 0) {
        this.atmosphereLossForm.patchValue({
          atmosphereGas: newMaterial[0].id
        })
        this.setProperties();
      }
    }
    this.materialModal.hide();
    this.showModal = false;
    this.lossesService.modalOpen.next(this.showModal);
    this.checkForm();
  }
}
