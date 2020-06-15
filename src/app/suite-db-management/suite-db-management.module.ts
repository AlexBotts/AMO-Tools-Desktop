import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiteDbManagementComponent } from './suite-db-management.component';
import { ManagementNavbarComponent } from './management-navbar/management-navbar.component';
import { SuiteDbManagementService } from './suite-db-management.service';
import { AtmosphereGasComponent } from './atmosphere-gas/atmosphere-gas.component';
import { PumpsComponent } from './pumps/pumps.component';
import { MotorsComponent } from './motors/motors.component';
import { FlueGasComponent } from './flue-gas/flue-gas.component';
import { GasLoadChargeMaterialComponent } from './gas-load-charge-material/gas-load-charge-material.component';
import { SolidLoadChargeMaterialComponent } from './solid-load-charge-material/solid-load-charge-material.component';
import { LiquidLoadChargeMaterialComponent } from './liquid-load-charge-material/liquid-load-charge-material.component';
import { SolidLiquidFuelsComponent } from './solid-liquid-fuels/solid-liquid-fuels.component';
import { WallSurfacesComponent } from './wall-surfaces/wall-surfaces.component';

@NgModule({
  declarations: [
    SuiteDbManagementComponent,
    ManagementNavbarComponent,
    AtmosphereGasComponent,
    PumpsComponent,
    MotorsComponent,
    FlueGasComponent,
    GasLoadChargeMaterialComponent,
    SolidLoadChargeMaterialComponent,
    LiquidLoadChargeMaterialComponent,
    SolidLiquidFuelsComponent,
    WallSurfacesComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    SuiteDbManagementService
  ]
})
export class SuiteDbManagementModule { }
