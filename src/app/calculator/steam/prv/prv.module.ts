import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrvComponent } from './prv.component';
import { PrvHelpComponent } from './prv-help/prv-help.component';
import { PrvResultsComponent } from './prv-results/prv-results.component';
import { PrvService } from './prv.service';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InletFormComponent } from './inlet-form/inlet-form.component';
import { FeedwaterFormComponent } from './feedwater-form/feedwater-form.component';
import { ExportableResultsTableModule } from '../../../shared/exportable-results-table/exportable-results-table.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ExportableResultsTableModule
  ],
  declarations: [PrvComponent, PrvHelpComponent, PrvResultsComponent, InletFormComponent, FeedwaterFormComponent],
  providers: [PrvService],
  exports: [PrvComponent, PrvResultsComponent]
})
export class PrvModule { }
