import { Component, OnInit, Input } from '@angular/core';
import { TreasureHunt, OpportunitySheetResults } from '../../../shared/models/treasure-hunt';
import { Settings } from '../../../shared/models/settings';
import { OpportunitySheetService } from '../../standalone-opportunity-sheet/opportunity-sheet.service';
import { LightingReplacementService } from '../../../calculator/lighting/lighting-replacement/lighting-replacement.service';
import { LightingReplacementResults } from '../../../shared/models/lighting';
import { TreasureHuntService } from '../../treasure-hunt.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.css']
})
export class SummaryCardComponent implements OnInit {
  @Input()
  treasureHunt: TreasureHunt;
  @Input()
  settings: Settings;

  totalSavings: number;
  percentSavings: number;
  percentGasSavings: number;
  percentElectricitySavings: number;
  percentOtherGasSavings: number;
  totalBaselineCost: number;
  totalModificationCost: number;
  totalElectricityCostSavings: number;
  totalElectricityEnergySavings: number;

  totalNaturalGasCostSavings: number;
  totalNaturalGasEnergySavings: number;

  totalOtherGasCostSavings: number;
  totalOtherGasEnergySavings: number;
  
  getResultsSubscription: Subscription;
  constructor(private opportunitySheetService: OpportunitySheetService, private lightingReplacementService: LightingReplacementService, private treasureHuntService: TreasureHuntService) { }

  ngOnInit() {
    this.totalBaselineCost = this.treasureHunt.currentEnergyUsage.electricityCosts + this.treasureHunt.currentEnergyUsage.naturalGasCosts + this.treasureHunt.currentEnergyUsage.otherFuelCosts;
    this.getResultsSubscription = this.treasureHuntService.getResults.subscribe(val => {
      this.calculateData();
    })
  }

  calculateData(){
    this.initVals();
    this.calculateValues();
    this.totalSavings = this.totalElectricityCostSavings + this.totalNaturalGasCostSavings + this.totalOtherGasCostSavings;
    this.totalModificationCost = this.totalBaselineCost - this.totalSavings;
    this.percentSavings = (this.totalSavings / this.totalBaselineCost) * 100;
    this.percentElectricitySavings = (this.totalElectricityCostSavings / this.treasureHunt.currentEnergyUsage.electricityCosts) * 100;
    this.percentGasSavings = (this.totalNaturalGasCostSavings / this.treasureHunt.currentEnergyUsage.naturalGasCosts) * 100;
    this.percentOtherGasSavings = (this.totalOtherGasCostSavings / this.treasureHunt.currentEnergyUsage.otherFuelCosts) * 100;
  }



  initVals() {
    this.totalElectricityCostSavings = 0;
    this.totalElectricityEnergySavings = 0;

    this.totalNaturalGasCostSavings = 0;
    this.totalNaturalGasEnergySavings = 0;

    this.totalOtherGasCostSavings = 0;
    this.totalOtherGasEnergySavings = 0;
  }

  calculateValues() {
    let lightingResults: { totalCostSavings: number, totalEnergySavings: number } = this.getTotalLightingSavings();
    this.totalElectricityCostSavings = this.totalElectricityCostSavings + lightingResults.totalCostSavings;
    this.totalElectricityEnergySavings = this.totalElectricityEnergySavings + lightingResults.totalEnergySavings;

    let oppSheetResults: { totalElectricityCostSavings: number, totalElectricityEnergySavings: number, totalNaturalGasCostSavings: number, totalNaturalGasEnergySavings: number, totalOtherGasCostSavings: number, totalOtherGasEnergySavings: number } = this.getOpportunitySheetSavings();
    this.totalElectricityCostSavings = this.totalElectricityCostSavings + oppSheetResults.totalElectricityCostSavings;
    this.totalElectricityEnergySavings = this.totalElectricityEnergySavings + oppSheetResults.totalElectricityEnergySavings;

    this.totalNaturalGasCostSavings = this.totalNaturalGasCostSavings + oppSheetResults.totalNaturalGasCostSavings;
    this.totalElectricityEnergySavings = this.totalElectricityEnergySavings + oppSheetResults.totalNaturalGasEnergySavings;

    this.totalOtherGasCostSavings = this.totalOtherGasCostSavings + oppSheetResults.totalOtherGasCostSavings;
    this.totalOtherGasEnergySavings = this.totalOtherGasEnergySavings + oppSheetResults.totalOtherGasEnergySavings;
  }

  getTotalLightingSavings(): { totalCostSavings: number, totalEnergySavings: number } {
    let totalCostSavings: number = 0;
    let totalEnergySavings: number = 0;
    this.treasureHunt.lightingReplacements.forEach(replacement => {
      if (replacement.selected) {
        let results: LightingReplacementResults = this.lightingReplacementService.getResults(replacement);
        totalCostSavings = totalCostSavings + results.totalCostSavings;
        totalEnergySavings = totalEnergySavings + results.totalEnergySavings;
      }
    })
    return { totalCostSavings: totalCostSavings, totalEnergySavings: totalEnergySavings }
  }

  getOpportunitySheetSavings(): {
    totalElectricityCostSavings: number,
    totalElectricityEnergySavings: number,
    totalNaturalGasCostSavings: number,
    totalNaturalGasEnergySavings: number,
    totalOtherGasCostSavings: number,
    totalOtherGasEnergySavings: number
  } {
    let totalElectricityCostSavings: number = 0
    let totalElectricityEnergySavings: number = 0;
    let totalNaturalGasCostSavings: number = 0;
    let totalNaturalGasEnergySavings: number = 0;
    let totalOtherGasCostSavings: number = 0;
    let totalOtherGasEnergySavings: number = 0;
    this.treasureHunt.opportunitySheets.forEach(oppSheet => {
      if (oppSheet.selected) {
        let oppSheetResults: OpportunitySheetResults = this.opportunitySheetService.getResults(oppSheet, this.settings);
        //electricity
        totalElectricityCostSavings = totalElectricityCostSavings + oppSheetResults.electricityResults.energyCostSavings;
        totalElectricityEnergySavings = totalElectricityEnergySavings + oppSheetResults.electricityResults.energySavings;
        //compressed air (electricity)
        totalElectricityCostSavings = totalElectricityCostSavings + oppSheetResults.compressedAirResults.energyCostSavings;
        totalElectricityEnergySavings = totalElectricityEnergySavings + oppSheetResults.compressedAirResults.energySavings;

        //natural gas
        totalNaturalGasCostSavings = totalNaturalGasCostSavings + oppSheetResults.gasResults.energyCostSavings;
        totalNaturalGasEnergySavings = totalNaturalGasEnergySavings + oppSheetResults.gasResults.energySavings;
        //steam (natural gas)
        totalNaturalGasCostSavings = totalNaturalGasCostSavings + oppSheetResults.steamResults.energyCostSavings;
        totalNaturalGasEnergySavings = totalNaturalGasEnergySavings + oppSheetResults.steamResults.energySavings;

        //other fuel
        totalOtherGasCostSavings = totalOtherGasCostSavings + oppSheetResults.otherFuelResults.energyCostSavings;
        totalOtherGasEnergySavings = totalOtherGasEnergySavings + oppSheetResults.otherFuelResults.energySavings;
      }
    })
    return {
      totalElectricityCostSavings: totalElectricityCostSavings,
      totalElectricityEnergySavings: totalElectricityEnergySavings,
      totalNaturalGasCostSavings: totalNaturalGasCostSavings,
      totalNaturalGasEnergySavings: totalNaturalGasEnergySavings,
      totalOtherGasCostSavings: totalOtherGasCostSavings,
      totalOtherGasEnergySavings: totalOtherGasEnergySavings
    }
  }


}
