import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SsmtReportComponent } from './ssmt-report.component';
import { ExecutiveSummaryComponent } from './executive-summary/executive-summary.component';
import { EnergySummaryComponent } from './energy-summary/energy-summary.component';
import { LossesSummaryComponent } from './losses-summary/losses-summary.component';
import { ReportDiagramComponent } from './report-diagram/report-diagram.component';
import { ReportGraphsComponent } from './report-graphs/report-graphs.component';
import { InputSummaryComponent } from './input-summary/input-summary.component';
import { SsmtDiagramModule } from '../ssmt-diagram/ssmt-diagram.module';
import { SharedModule } from '../../shared/shared.module';
import { OperationsSummaryComponent } from './input-summary/operations-summary/operations-summary.component';
import { TurbineSummaryComponent } from './input-summary/turbine-summary/turbine-summary.component';
import { HeaderSummaryComponent } from './input-summary/header-summary/header-summary.component';
import { BoilerSummaryComponent } from './input-summary/boiler-summary/boiler-summary.component';
import { HeaderInputTableComponent } from './input-summary/header-summary/header-input-table/header-input-table.component';
import { TurbineInputTableComponent } from './input-summary/turbine-summary/turbine-input-table/turbine-input-table.component';
import { FormsModule } from '@angular/forms';
import { SsmtReportService } from './ssmt-report.service';
import { ModalModule } from 'ngx-bootstrap';
import { ReportGraphsPrintComponent } from './report-graphs/report-graphs-print/report-graphs-print.component';
import { ReportGraphsService } from './report-graphs/report-graphs.service';
@NgModule({
  imports: [
    CommonModule,
    SsmtDiagramModule,
    SharedModule,
    FormsModule,
    ModalModule
  ],
  declarations: [
    SsmtReportComponent,
    ExecutiveSummaryComponent,
    EnergySummaryComponent,
    LossesSummaryComponent,
    ReportDiagramComponent,
    ReportGraphsComponent,
    InputSummaryComponent,
    OperationsSummaryComponent,
    TurbineSummaryComponent,
    HeaderSummaryComponent,
    BoilerSummaryComponent,
    HeaderInputTableComponent,
    TurbineInputTableComponent,
    ReportGraphsPrintComponent
  ],
  exports: [
    SsmtReportComponent
  ],
  providers: [
    SsmtReportService,
    ReportGraphsService
  ]
})
export class SsmtReportModule { }
