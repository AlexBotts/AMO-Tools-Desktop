import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HoverBoilerTableComponent } from './hover-boiler-table/hover-boiler-table.component';
import { HoverTurbineTableComponent } from './hover-turbine-table/hover-turbine-table.component';
import { HoverHeaderTableComponent } from './hover-header-table/hover-header-table.component';
import { HoverSteamPropertiesComponent } from './hover-steam-properties/hover-steam-properties.component';
import { HoverFlashTankTableComponent } from './hover-flash-tank-table/hover-flash-tank-table.component';
import { HoverPrvTableComponent } from './hover-prv-table/hover-prv-table.component';
import { HoverCondensateTableComponent } from './hover-condensate-table/hover-condensate-table.component';
import { HoverMakeupWaterComponent } from './hover-makeup-water/hover-makeup-water.component';
import { HoverBlowdownTableComponent } from './hover-blowdown-table/hover-blowdown-table.component';
import { HoverProcessUsageComponent } from './hover-process-usage/hover-process-usage.component';
import { HoverTableComponent } from './hover-table.component';
import { HoverDeaeratorTableComponent } from './hover-deaerator-table/hover-deaerator-table.component';
import { SharedModule } from '../../../shared/shared.module';
import { HoverHeatExchangerComponent } from './hover-heat-exchanger/hover-heat-exchanger.component';
import { ExportableResultsTableModule } from '../../../shared/exportable-results-table/exportable-results-table.module';
import { SharedPipesModule } from '../../../shared/shared-pipes/shared-pipes.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ExportableResultsTableModule,
    SharedPipesModule
  ],
  declarations: [
    HoverTableComponent,
    HoverBoilerTableComponent,
    HoverTurbineTableComponent,
    HoverHeaderTableComponent,
    HoverFlashTankTableComponent,
    HoverPrvTableComponent,
    HoverCondensateTableComponent,
    HoverMakeupWaterComponent,
    HoverBlowdownTableComponent,
    HoverProcessUsageComponent,
    HoverDeaeratorTableComponent,
    HoverSteamPropertiesComponent,
    HoverHeatExchangerComponent
  ],
  exports: [
    HoverTableComponent,
    HoverBoilerTableComponent,
    HoverTurbineTableComponent,
    HoverHeaderTableComponent,
    HoverFlashTankTableComponent,
    HoverPrvTableComponent,
    HoverCondensateTableComponent,
    HoverMakeupWaterComponent,
    HoverBlowdownTableComponent,
    HoverProcessUsageComponent,
    HoverDeaeratorTableComponent,
    HoverSteamPropertiesComponent,
    HoverHeatExchangerComponent
  ]
})
export class HoverTableModule { }
