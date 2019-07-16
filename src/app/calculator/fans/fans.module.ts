import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Fsat203Module } from './fsat-203/fsat-203.module';
import { FansComponent } from './fans.component';
import { SystemCurveModule } from '../pumps/system-curve/system-curve.module';
import { PumpCurveModule } from '../pumps/pump-curve/pump-curve.module';
import { FanEfficiencyModule } from './fan-efficiency/fan-efficiency.module';
import { FanAnalysisModule } from './fan-analysis/fan-analysis.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Fsat203Module,
    SystemCurveModule,
    PumpCurveModule,
    FanEfficiencyModule,
    FanAnalysisModule
  ],
  declarations: [FansComponent],
  exports: [FansComponent],
  providers: []
})
export class FansModule { }
