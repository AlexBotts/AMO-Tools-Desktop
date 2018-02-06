import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompressedAirComponent } from './compressed-air.component';
import { BagMethodComponent } from './bag-method/bag-method.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    CompressedAirComponent,
    BagMethodComponent
  ],
  exports: [
    CompressedAirComponent
  ]
})
export class CompressedAirModule { }
