import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { ModalModule } from 'ngx-bootstrap/modal/modal.module';

import { ControlMessagesComponent } from './control-messages/control-messages.component';
import { ValidationService } from './validation.service';
import { ModelService } from './model.service';

import { ConvertUnitsService } from './convert-units/convert-units.service';
import { PercentGraphComponent } from './percent-graph/percent-graph.component';
import { SigFigsPipe } from './pipes/sig-figs.pipe';
import { UpdateDataService } from './update-data.service';
import { FacilityInfoSummaryComponent } from './facility-info-summary/facility-info-summary.component';
import { SvgToPngService } from './svg-to-png/svg-to-png.service';
import { AnimatedCheckmarkComponent } from './animated-checkmark/animated-checkmark.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { PhonePipe } from './pipes/phone.pipe';
import { SimpleTooltipComponent } from './simple-tooltip/simple-tooltip.component';
import { LineChartHelperService } from './line-chart-helper/line-chart-helper.service';
import { ExportableTableComponent } from './exportable-table/exportable-table.component';
import { TabsTooltipComponent } from './tabs-tooltip/tabs-tooltip.component';
import { PrintOptionsMenuComponent } from './print-options-menu/print-options-menu.component';
import { ExportableResultsTableComponent } from './exportable-results-table/exportable-results-table.component';
import { SettingsLabelPipe } from './pipes/settings-label.pipe';
import { WaterfallGraphComponent } from './waterfall-graph/waterfall-graph.component';
import { WaterfallGraphService } from './waterfall-graph/waterfall-graph.service';
import { ToastComponent } from './toast/toast.component';
import { SankeyChartComponent } from './sankey-chart/sankey-chart.component';
import { SankeyChartService } from './sankey-chart/sankey-chart.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule,
    ModalModule
    // ChartsModule
  ],
  declarations: [
    ControlMessagesComponent,
    PercentGraphComponent,
    SigFigsPipe,
    FacilityInfoSummaryComponent,
    AnimatedCheckmarkComponent,
    PieChartComponent,
    PhonePipe,
    SimpleTooltipComponent,
    ExportableTableComponent,
    TabsTooltipComponent,
    PrintOptionsMenuComponent,
    ExportableResultsTableComponent,
    SettingsLabelPipe,
    WaterfallGraphComponent,
    ToastComponent,
    SankeyChartComponent
  ],
  exports: [
    ControlMessagesComponent,
    PercentGraphComponent,
    SigFigsPipe,
    FacilityInfoSummaryComponent,
    AnimatedCheckmarkComponent,
    PieChartComponent,
    PhonePipe,
    SimpleTooltipComponent,
    ExportableTableComponent,
    ExportableResultsTableComponent,
    TabsTooltipComponent,
    PrintOptionsMenuComponent,
    SettingsLabelPipe,
    WaterfallGraphComponent,
    ToastComponent,
    SankeyChartComponent
  ],
  providers: [
    ValidationService,
    ModelService,
    ConvertUnitsService,
    UpdateDataService,
    SvgToPngService,
    LineChartHelperService,
    WaterfallGraphService,
    SankeyChartService
  ]
})

export class SharedModule { }
