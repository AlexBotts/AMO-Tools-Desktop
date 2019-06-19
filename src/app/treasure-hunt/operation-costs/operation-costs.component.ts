import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { TreasureHunt, EnergyUsage } from '../../shared/models/treasure-hunt';
import { Settings } from '../../shared/models/settings';

@Component({
  selector: 'app-operation-costs',
  templateUrl: './operation-costs.component.html',
  styleUrls: ['./operation-costs.component.css']
})
export class OperationCostsComponent implements OnInit {
  @Input()
  treasureHunt: TreasureHunt;
  @Output('emitSave')
  emitSave = new EventEmitter<TreasureHunt>();
  @Input()
  settings: Settings;

  constructor() { }

  ngOnInit() {
    if (!this.treasureHunt.currentEnergyUsage) {
      let defaultUsage: EnergyUsage = {
        electricityUsage: 0,
        electricityCosts: 0,
        electricityUsed: false,
        naturalGasUsage: 0,
        naturalGasCosts: 0,
        naturalGasUsed: false,
        otherFuelUsage: 0,
        otherFuelCosts: 0,
        otherFuelUsed: false,
        waterUsage: 0,
        waterCosts: 0,
        waterUsed: false,
        wasteWaterUsage: 0,
        wasteWaterCosts: 0,
        wasteWaterUsed: false,
        compressedAirUsage: 0,
        compressedAirCosts: 0,
        compressedAirUsed: false,
        steamUsage: 0,
        steamCosts: 0,
        steamUsed: false
      }
      this.treasureHunt.currentEnergyUsage = defaultUsage;
      this.save();
    }
  }

  save() {
    this.emitSave.emit(this.treasureHunt);
  }

  toggleElectricityUsed() {
    if (this.treasureHunt.currentEnergyUsage.electricityUsed != true) {
      this.treasureHunt.currentEnergyUsage.electricityUsed = true;
    } else {
      this.treasureHunt.currentEnergyUsage.electricityUsed = false;
    }
    this.save();
  }

  toggleNaturalGasUsed() {
    if (this.treasureHunt.currentEnergyUsage.naturalGasUsed != true) {
      this.treasureHunt.currentEnergyUsage.naturalGasUsed = true;
    } else {
      this.treasureHunt.currentEnergyUsage.naturalGasUsed = false;
    }
    this.save();
  }

  toggleOtherFuelUsed() {
    if (this.treasureHunt.currentEnergyUsage.otherFuelUsed != true) {
      this.treasureHunt.currentEnergyUsage.otherFuelUsed = true;
    } else {
      this.treasureHunt.currentEnergyUsage.otherFuelUsed = false;
    }
    this.save();
  }

  toggleWaterUsed() {
    if (this.treasureHunt.currentEnergyUsage.waterUsed != true) {
      this.treasureHunt.currentEnergyUsage.waterUsed = true;
    } else {
      this.treasureHunt.currentEnergyUsage.waterUsed = false;
    }
    this.save();
  }

  toggleWasteWaterUsed() {
    if (this.treasureHunt.currentEnergyUsage.wasteWaterUsed != true) {
      this.treasureHunt.currentEnergyUsage.wasteWaterUsed = true;
    } else {
      this.treasureHunt.currentEnergyUsage.wasteWaterUsed = false;
    }
    this.save();
  }

  toggleCompressedAirUsed() {
    if (this.treasureHunt.currentEnergyUsage.compressedAirUsed != true) {
      this.treasureHunt.currentEnergyUsage.compressedAirUsed = true;
    } else {
      this.treasureHunt.currentEnergyUsage.compressedAirUsed = false;
    }
    this.save();
  }

  toggleSteamUsed() {
    if (this.treasureHunt.currentEnergyUsage.steamUsed != true) {
      this.treasureHunt.currentEnergyUsage.steamUsed = true;
    } else {
      this.treasureHunt.currentEnergyUsage.steamUsed = false;
    }
    this.save();
  }

}
