import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnergyUseFormComponent } from './energy-use-form/energy-use-form.component';
import { EnergyUseComponent } from './energy-use.component';
import { EnergyUseHelpComponent } from './energy-use-help/energy-use-help.component';
import { EnergyUseService } from './energy-use.service';
import { SharedModule } from '../../../shared/shared.module';
import { ExportableResultsTableModule } from '../../../shared/exportable-results-table/exportable-results-table.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ExportableResultsTableModule
  ],
  declarations: [
    EnergyUseFormComponent,
    EnergyUseComponent,
    EnergyUseHelpComponent
  ],
  exports: [
    EnergyUseComponent
  ],
  providers: [
    EnergyUseService
  ]
})
export class EnergyUseModule { }
