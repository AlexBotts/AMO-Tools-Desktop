import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeatLossComponent } from './heat-loss.component';
import { HeatLossFormComponent } from './heat-loss-form/heat-loss-form.component';
import { HeatLossHelpComponent } from './heat-loss-help/heat-loss-help.component';
import { HeatLossResultsComponent } from './heat-loss-results/heat-loss-results.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeatLossService } from './heat-loss.service';
import { SharedModule } from '../../../shared/shared.module';
import { ExportableResultsTableModule } from '../../../shared/exportable-results-table/exportable-results-table.module';
import { SharedPipesModule } from '../../../shared/shared-pipes/shared-pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ExportableResultsTableModule,
    SharedPipesModule
  ],
  declarations: [HeatLossComponent, HeatLossFormComponent, HeatLossHelpComponent, HeatLossResultsComponent],
  exports: [HeatLossComponent],
  providers: [HeatLossService]
})
export class HeatLossModule { }
