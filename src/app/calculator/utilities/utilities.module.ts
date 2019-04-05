import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { UtilitiesComponent } from './utilities.component';
import { UnitConverterComponent } from './unit-converter/unit-converter.component';
import { SortByPipe } from './unit-converter/sort-by.pipe';

import { CombinedHeatPowerModule } from './combined-heat-power/combined-heat-power.module';

import { CashFlowComponent } from './cash-flow/cash-flow.component';
import { CashFlowHelpComponent } from './cash-flow/cash-flow-help/cash-flow-help.component';
import { CashFlowFormComponent } from './cash-flow/cash-flow-form/cash-flow-form.component';
import { CashFlowDiagramComponent } from './cash-flow/cash-flow-diagram/cash-flow-diagram.component';
import { CashFlowService } from './cash-flow/cash-flow.service';
import { PreAssessmentModule } from './pre-assessment/pre-assessment.module';
import { PowerFactorCorrectionModule } from './power-factor-correction/power-factor-correction.module';
import { UnitConverterService } from './unit-converter/unit-converter.service';
import { Co2SavingsModule } from './co2-savings/co2-savings.module';
import { ElectricityReductionModule } from './electricity-reduction/electricity-reduction.module';

@NgModule({
    declarations: [
        UtilitiesComponent,
        UnitConverterComponent,
        SortByPipe,
        CashFlowComponent,
        CashFlowHelpComponent,
        CashFlowFormComponent,
        CashFlowDiagramComponent
    ],
    exports: [
        UnitConverterComponent,
        UtilitiesComponent,
        CashFlowComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        CombinedHeatPowerModule,
        PreAssessmentModule,
        PowerFactorCorrectionModule,
        Co2SavingsModule,
        ElectricityReductionModule
    ],
    providers: [
        CashFlowService,
        UnitConverterService
    ]

})

export class UtilitiesModule {}
