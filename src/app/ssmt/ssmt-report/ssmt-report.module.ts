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

@NgModule({
  imports: [
    CommonModule,
    SsmtDiagramModule,
    SharedModule
  ],
  declarations: [
    SsmtReportComponent,
    ExecutiveSummaryComponent,
    EnergySummaryComponent,
    LossesSummaryComponent,
    ReportDiagramComponent,
    ReportGraphsComponent,
    InputSummaryComponent
  ],
  exports: [
    SsmtReportComponent
  ]
})
export class SsmtReportModule { }