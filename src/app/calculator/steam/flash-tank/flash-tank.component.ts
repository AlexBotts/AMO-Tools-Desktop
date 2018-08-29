import { Component, OnInit, Input, ElementRef, ViewChild, HostListener } from '@angular/core';
import { FormGroup } from '../../../../../node_modules/@angular/forms';
import { FlashTankInput, FlashTankOutput } from '../../../shared/models/steam';
import { SettingsDbService } from '../../../indexedDb/settings-db.service';
import { SteamService } from '../steam.service';
import { Settings } from '../../../shared/models/settings';
import { FlashTankService } from './flash-tank.service';

@Component({
  selector: 'app-flash-tank',
  templateUrl: './flash-tank.component.html',
  styleUrls: ['./flash-tank.component.css']
})
export class FlashTankComponent implements OnInit {
  @Input()
  settings: Settings;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizeTabs();
  }
  @ViewChild('leftPanelHeader') leftPanelHeader: ElementRef;
  headerHeight: number;

  tabSelect: string = 'results';
  currentField: string = 'default';
  flashTankForm: FormGroup;
  input: FlashTankInput;
  results: FlashTankOutput;
  constructor(private settingsDbService: SettingsDbService, private steamService: SteamService, private flashTankService: FlashTankService) { }

  ngOnInit() {
    if (this.settingsDbService.globalSettings.defaultPanelTab) {
      this.tabSelect = this.settingsDbService.globalSettings.defaultPanelTab;
    }
    if (!this.settings) {
      this.settings = this.settingsDbService.globalSettings;
    }
    this.getForm();
    this.input = this.flashTankService.getObjFromForm(this.flashTankForm);
    this.calculate(this.flashTankForm);
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.resizeTabs();
    }, 50);
  }
  
  resizeTabs() {
    if (this.leftPanelHeader.nativeElement.clientHeight) {
      this.headerHeight = this.leftPanelHeader.nativeElement.clientHeight;
    }
  }

  setTab(str: string) {
    this.tabSelect = str;
  }
  changeField(str: string) {
    this.currentField = str;
  }

  getForm() {
    this.flashTankForm = this.flashTankService.initForm(this.settings);
  }

  calculate(form: FormGroup) {
    this.input = this.flashTankService.getObjFromForm(form);
    if (form.status == 'VALID') {
      this.results = this.steamService.flashTank(this.input, this.settings);
    } else {
      this.results = this.getEmptyResults();
    }
  }

  getEmptyResults(): FlashTankOutput {
    let emptyResults: FlashTankOutput = {
      inletWaterEnergyFlow:0,
      inletWaterMassFlow:0,
      inletWaterPressure:0,
      inletWaterQuality:0,
      inletWaterSpecificEnthalpy:0,
      inletWaterSpecificEntropy:0,
      inletWaterTemperature:0,
      outletGasEnergyFlow:0,
      outletGasMassFlow:0,
      outletGasPressure:0,
      outletGasQuality:0,
      outletGasSpecificEnthalpy:0,
      outletGasSpecificEntropy:0,
      outletGasTemperature:0,
      outletLiquidEnergyFlow:0,
      outletLiquidMassFlow:0,
      outletLiquidPressure:0,
      outletLiquidQuality:0,
      outletLiquidSpecificEnthalpy:0,
      outletLiquidSpecificEntropy:0,
      outletLiquidTemperature:0,
    }

    return emptyResults;
  }
}
