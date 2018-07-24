import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Settings } from '../../../shared/models/settings';
import { SettingsDbService } from '../../../indexedDb/settings-db.service';
import { SteamService } from '../steam.service';
import { HeatLossService } from './heat-loss.service';
import { HeatLossInput, HeatLossOutput } from '../../../shared/models/steam';

@Component({
  selector: 'app-heat-loss',
  templateUrl: './heat-loss.component.html',
  styleUrls: ['./heat-loss.component.css']
})
export class HeatLossComponent implements OnInit {
  @Input()
  settings: Settings;

  headerHeight: number;
  tabSelect: string = 'results';
  currentField: string = 'default';
  heatLossForm: FormGroup;
  input: HeatLossInput;
  results: HeatLossOutput;
  constructor(private settingsDbService: SettingsDbService, private steamService: SteamService, private heatLossService: HeatLossService) { }

  ngOnInit() {
    if (this.settingsDbService.globalSettings.defaultPanelTab) {
      this.tabSelect = this.settingsDbService.globalSettings.defaultPanelTab;
    }
    if (!this.settings) {
      this.settings = this.settingsDbService.globalSettings;
    }
    this.getForm();
    this.calculate(this.heatLossForm);
  }

  setTab(str: string) {
    this.tabSelect = str;
  }
  changeField(str: string) {
    this.currentField = str;
  }

  getForm() {
    this.heatLossForm = this.heatLossService.initForm();
  }

  calculate(form: FormGroup) {
    if (form.status == 'VALID') {
      this.input = this.heatLossService.getObjFromForm(form);
      this.results = this.steamService.heatLoss(this.input, this.settings);
    }
  }
}
