import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PsatService } from '../../../psat/psat.service';
@Component({
  selector: 'app-head-tool',
  templateUrl: './head-tool.component.html',
  styleUrls: ['./head-tool.component.css']
})
export class HeadToolComponent implements OnInit {
  @Output('close')
  close = new EventEmitter<boolean>();
  @Input()
  headToolResults: any = {
    differentialElevationHead: 0.0,
    differentialIPressureHead: 0.0,
    differentialVelocityHead: 0.0,
    estimatedSuctionFrictionHead: 0.0,
    estimatedDischargeFrictionHead: 0.0,
    pumpHead: 0.0
  }
  results: any = {
    differentialElevationHead: 0.0,
    differentialPressureHead: 0.0,
    differentialVelocityHead: 0.0,
    estimatedSuctionFrictionHead: 0.0,
    estimatedDischargeFrictionHead: 0.0,
    pumpHead: 0.0
  }
  headToolForm: any;
  headToolSuctionForm: any;
  headToolType: string = "Suction tank elevation, gas space pressure, and discharged line pressure";
  tabSelect: string = 'results';

  constructor(private formBuilder: FormBuilder, private psatService: PsatService) { }

  ngOnInit() {
    this.headToolForm = this.initHeadToolForm();
    this.headToolSuctionForm = this.initHeadToolSuctionForm();

  }


  setTab(str: string) {
    this.tabSelect = str;
  }

  closeTool() {
    this.close.emit(true);
  }

  save() {
    this.headToolResults.differentialElevationHead = this.results.differentialElevationHead;
    this.headToolResults.differentialPressureHead = this.results.differentialPressureHead;
    this.headToolResults.differentialVelocityHead = this.results.differentialVelocityHead;
    this.headToolResults.estimatedSuctionFrictionHead = this.results.estimatedSuctionFrictionHead;
    this.headToolResults.estimatedDischargeFrictionHead = this.results.estimatedDischargeFrictionHead;
    this.headToolResults.pumpHead = this.results.pumpHead;
    this.closeTool();
  }

  calculateHeadTool() {
    let result = this.psatService.headToolSuctionTank(
      this.headToolForm.value.specificGravity,
      this.headToolForm.value.flowRate,
      this.headToolForm.value.suctionPipeDiameter,
      this.headToolForm.value.suctionGuagePressure,
      this.headToolForm.value.suctionGuageElevation,
      this.headToolForm.value.suctionLineLossCoefficients,
      this.headToolForm.value.dischargePipeDiameter,
      this.headToolForm.value.dischargeGaugePressure,
      this.headToolForm.value.dischargeGaugeElevation,
      this.headToolForm.value.dischargeLineLossCoefficients
    );
    this.results.differentialElevationHead = result.differentialElevationHead;
    this.results.differentialPressureHead = result.differentialPressureHead;
    this.results.differentialVelocityHead = result.differentialVelocityHead;
    this.results.estimatedSuctionFrictionHead = result.estimatedSuctionFrictionHead;
    this.results.estimatedDischargeFrictionHead = result.estimatedDischargeFrictionHead;
    this.results.pumpHead = result.pumpHead;
  }


  calculateHeadToolSuctionTank() {
    let result = this.psatService.headToolSuctionTank(
      this.headToolSuctionForm.value.specificGravity,
      this.headToolSuctionForm.value.flowRate,
      this.headToolSuctionForm.value.suctionPipeDiameter,
      this.headToolSuctionForm.value.suctionTankGasOverPressure,
      this.headToolSuctionForm.value.suctionTankFluidSurfaceElevation,
      this.headToolSuctionForm.value.suctionLineLossCoefficients,
      this.headToolSuctionForm.value.dischargePipeDiameter,
      this.headToolSuctionForm.value.dischargeGaugePressure,
      this.headToolSuctionForm.value.dischargeGaugeElevation,
      this.headToolSuctionForm.value.dischargeLineLossCoefficients
    );

    this.results.differentialElevationHead = result.differentialElevationHead;
    this.results.differentialPressureHead = result.differentialPressureHead;
    this.results.differentialVelocityHead = result.differentialVelocityHead;
    this.results.estimatedSuctionFrictionHead = result.estimatedSuctionFrictionHead;
    this.results.estimatedDischargeFrictionHead = result.estimatedDischargeFrictionHead;
    this.results.pumpHead = result.pumpHead;
  }

  initHeadToolSuctionForm() {
    return this.formBuilder.group({
      'suctionPipeDiameter': ['', Validators.required],
      'suctionTankGasOverPressure': ['', Validators.required],
      'suctionTankFluidSurfaceElevation': ['', Validators.required],
      'suctionLineLossCoefficients': ['', Validators.required],
      'dischargePipeDiameter': ['', Validators.required],
      'dischargeGaugePressure': ['', Validators.required],
      'dischargeGaugeElevation': ['', Validators.required],
      'dischargeLineLossCoefficients': ['', Validators.required],
      'specificGravity': ['', Validators.required],
      'flowRate': ['', Validators.required],
    })
  }

  initHeadToolForm() {
    return this.formBuilder.group({
      'suctionPipeDiameter': ['', Validators.required],
      'suctionGuagePressure': ['', Validators.required],
      'suctionGuageElevation': ['', Validators.required],
      'suctionLineLossCoefficients': ['', Validators.required],
      'dischargePipeDiameter': ['', Validators.required],
      'dischargeGaugePressure': ['', Validators.required],
      'dischargeGaugeElevation': ['', Validators.required],
      'dischargeLineLossCoefficients': ['', Validators.required],
      'specificGravity': ['', Validators.required],
      'flowRate': ['', Validators.required],
    })
  }

}