import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { SuiteDbService } from '../../../../suiteDb/suite-db.service';
import { WindowRefService } from '../../../../indexedDb/window-ref.service';
import { ChargeMaterialCompareService } from '../charge-material-compare.service';
import { ModalDirective } from 'ngx-bootstrap';
import { LossesService } from '../../losses.service';

@Component({
  selector: 'app-liquid-charge-material-form',
  templateUrl: './liquid-charge-material-form.component.html',
  styleUrls: ['./liquid-charge-material-form.component.css']
})
export class LiquidChargeMaterialFormComponent implements OnInit {
  @Input()
  chargeMaterialForm: any;
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
  @ViewChild('materialModal') public materialModal: ModalDirective;
  @ViewChild('lossForm') lossForm: ElementRef;
  form: any;
  elements: any;

  firstChange: boolean = true;
  materialTypes: any;
  selectedMaterial: any;
  counter: any;
  dischargeTempError: string = null;
  constructor(private suiteDbService: SuiteDbService, private chargeMaterialCompareService: ChargeMaterialCompareService, private windowRefService: WindowRefService,private lossesService: LossesService) { }

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
    this.materialTypes = this.suiteDbService.selectLiquidLoadChargeMaterials();
    if (this.chargeMaterialForm) {
      if (this.chargeMaterialForm.value.materialId && this.chargeMaterialForm.value.materialId != '') {
        if (this.chargeMaterialForm.value.materialLatentHeat == '') {
          this.setProperties();
        }
      }
    }
    this.checkDischargeTemp();
  }

  ngAfterViewInit() {
    if (!this.baselineSelected) {
      this.disableForm();
    }
    this.initDifferenceMonitor();
  }

  ngOnDestroy() {
    this.lossesService.modalOpen.next(false);
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
    if (this.chargeMaterialForm.status == "VALID") {
      this.calculate.emit(true);
    }
  }

  focusField(str: string) {
    this.changeField.emit(str);
  }

  checkDischargeTemp() {
    if ((this.chargeMaterialForm.value.dischargeTemperature > this.chargeMaterialForm.value.materialVaporizingTemperature) && this.chargeMaterialForm.value.liquidVaporized == 0) {
      this.dischargeTempError = 'The discharge temperature is higher than the Vaporizing Temperature, please enter proper percentage for charge vaporized.';
    } else if ((this.chargeMaterialForm.value.dischargeTemperature < this.chargeMaterialForm.value.materialVaporizingTemperature) && this.chargeMaterialForm.value.liquidVaporized > 0) {
      this.dischargeTempError = 'The discharge temperature is lower than the vaporizing temperature, the percentage for charge liquid vaporized should be 0%.';
    }else{
      this.dischargeTempError = null;
    }
  }

  setProperties() {
    let selectedMaterial = this.suiteDbService.selectLiquidLoadChargeMaterialById(this.chargeMaterialForm.value.materialId);
    this.chargeMaterialForm.patchValue({
      materialLatentHeat: selectedMaterial.latentHeat,
      materialSpecificHeatLiquid: selectedMaterial.specificHeatLiquid,
      materialSpecificHeatVapor: selectedMaterial.specificHeatVapor,
      materialVaporizingTemperature: selectedMaterial.vaporizationTemperature
    })
    this.checkForm();
  }
  emitSave() {
    this.saveEmit.emit(true);
  }

  startSavePolling() {
    this.checkForm();
    this.checkDischargeTemp();
    if (this.counter) {
      clearTimeout(this.counter);
    }
    this.counter = setTimeout(() => {
      this.emitSave();
    }, 3000)
  }

  initDifferenceMonitor() {
    if (this.chargeMaterialCompareService.baselineMaterials && this.chargeMaterialCompareService.modifiedMaterials && this.chargeMaterialCompareService.differentArray.length != 0) {
      if (this.chargeMaterialCompareService.differentArray[this.lossIndex]) {
        let doc = this.windowRefService.getDoc();
        //materialName
        this.chargeMaterialCompareService.differentArray[this.lossIndex].different.liquidChargeMaterialDifferent.materialId.subscribe((val) => {
          let materialNameElements = doc.getElementsByName('materialName_' + this.lossIndex);
          materialNameElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
        //materialSpecificHeatLiquid
        this.chargeMaterialCompareService.differentArray[this.lossIndex].different.liquidChargeMaterialDifferent.specificHeatLiquid.subscribe((val) => {
          let materialSpecificHeatLiquidElements = doc.getElementsByName('materialSpecificHeatLiquid_' + this.lossIndex);
          materialSpecificHeatLiquidElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
        //materialVaporizingTemperature
        this.chargeMaterialCompareService.differentArray[this.lossIndex].different.liquidChargeMaterialDifferent.vaporizingTemperature.subscribe((val) => {
          let materialVaporizingTemperatureElements = doc.getElementsByName('materialVaporizingTemperature_' + this.lossIndex);
          materialVaporizingTemperatureElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
        //materialLatentHeat
        this.chargeMaterialCompareService.differentArray[this.lossIndex].different.liquidChargeMaterialDifferent.latentHeat.subscribe((val) => {
          let materialLatentHeatElements = doc.getElementsByName('materialLatentHeat_' + this.lossIndex);
          materialLatentHeatElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
        //materialSpecificHeatVapor
        this.chargeMaterialCompareService.differentArray[this.lossIndex].different.liquidChargeMaterialDifferent.specificHeatVapor.subscribe((val) => {
          let materialSpecificHeatVaporElements = doc.getElementsByName('materialSpecificHeatVapor_' + this.lossIndex);
          materialSpecificHeatVaporElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
        //feedRate
        this.chargeMaterialCompareService.differentArray[this.lossIndex].different.liquidChargeMaterialDifferent.chargeFeedRate.subscribe((val) => {
          let feedRateElements = doc.getElementsByName('feedRate_' + this.lossIndex);
          feedRateElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
        //initialTemperature
        this.chargeMaterialCompareService.differentArray[this.lossIndex].different.liquidChargeMaterialDifferent.initialTemperature.subscribe((val) => {
          let initialTemperatureElements = doc.getElementsByName('initialTemperature_' + this.lossIndex);
          initialTemperatureElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
        //dischargeTemperature
        this.chargeMaterialCompareService.differentArray[this.lossIndex].different.liquidChargeMaterialDifferent.dischargeTemperature.subscribe((val) => {
          let dischargeTemperatureElements = doc.getElementsByName('dischargeTemperature_' + this.lossIndex);
          dischargeTemperatureElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
        //liquidVaporized
        this.chargeMaterialCompareService.differentArray[this.lossIndex].different.liquidChargeMaterialDifferent.percentVaporized.subscribe((val) => {
          let liquidVaporizedElements = doc.getElementsByName('liquidVaporized_' + this.lossIndex);
          liquidVaporizedElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
        //liquidReacted
        this.chargeMaterialCompareService.differentArray[this.lossIndex].different.liquidChargeMaterialDifferent.percentReacted.subscribe((val) => {
          let liquidReactedElements = doc.getElementsByName('liquidReacted_' + this.lossIndex);
          liquidReactedElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
        //heatOfReaction
        this.chargeMaterialCompareService.differentArray[this.lossIndex].different.liquidChargeMaterialDifferent.reactionHeat.subscribe((val) => {
          let heatOfReactionElements = doc.getElementsByName('heatOfReaction_' + this.lossIndex);
          heatOfReactionElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
        //endothermicOrExothermic
        this.chargeMaterialCompareService.differentArray[this.lossIndex].different.liquidChargeMaterialDifferent.thermicReactionType.subscribe((val) => {
          let endothermicOrExothermicElements = doc.getElementsByName('endothermicOrExothermic_' + this.lossIndex);
          endothermicOrExothermicElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
        //additionalHeatRequired
        this.chargeMaterialCompareService.differentArray[this.lossIndex].different.liquidChargeMaterialDifferent.additionalHeat.subscribe((val) => {
          let additionalHeatRequiredElements = doc.getElementsByName('additionalHeatRequired_' + this.lossIndex);
          additionalHeatRequiredElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
      }
    }
  }

  showMaterialModal() {
    this.lossesService.modalOpen.next(true);
    this.materialModal.show();
  }


  hideMaterialModal(event?: any) {
    if (event) {
      this.materialTypes = this.suiteDbService.selectLiquidLoadChargeMaterials();
      let newMaterial = this.materialTypes.filter(material => {return material.substance == event.substance})
      if(newMaterial){
        this.chargeMaterialForm.patchValue({
          materialId: newMaterial[0].id
        })
        this.setProperties();
      }
    }
    this.materialModal.hide();
    this.lossesService.modalOpen.next(false);
  }
}
