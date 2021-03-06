import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurbineComponent } from './turbine.component';
import { TurbineFormComponent } from './turbine-form/turbine-form.component';
import { TurbineHelpComponent } from './turbine-help/turbine-help.component';
import { TurbineResultsComponent } from './turbine-results/turbine-results.component';
import { TurbineService } from './turbine.service';
import { ReactiveFormsModule } from '../../../../../node_modules/@angular/forms';
import { ExportableResultsTableModule } from '../../../shared/exportable-results-table/exportable-results-table.module';
import { SharedPipesModule } from '../../../shared/shared-pipes/shared-pipes.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ExportableResultsTableModule,
    SharedPipesModule
  ],
  declarations: [TurbineComponent, TurbineFormComponent, TurbineHelpComponent, TurbineResultsComponent],
  exports: [TurbineComponent, TurbineResultsComponent],
  providers: [TurbineService]
})
export class TurbineModule { }
