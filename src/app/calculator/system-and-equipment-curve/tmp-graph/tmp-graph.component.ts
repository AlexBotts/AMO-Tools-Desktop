import { Component, OnInit } from '@angular/core';
import { SystemAndEquipmentCurveService } from '../system-and-equipment-curve.service';
import { Subscription } from 'rxjs';
import * as Plotly from 'plotly.js';

@Component({
  selector: 'app-tmp-graph',
  templateUrl: './tmp-graph.component.html',
  styleUrls: ['./tmp-graph.component.css']
})
export class TmpGraphComponent implements OnInit {

  updateGraphSub: Subscription;
  isSystemCurveShown: boolean;
  isEquipmentCurveShown: boolean;
  isEquipmentModificationShown: boolean;
  isUpdate: boolean = false;
  constructor(private systemAndEquipmentCurveService: SystemAndEquipmentCurveService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.updateGraphSub = this.systemAndEquipmentCurveService.updateGraph.subscribe(val => {
      Plotly.purge('myDiv');
      this.setDisplayDataOptions();
      var data = this.getTraceData();
      var layout = {
        xaxis: {
          rangemode: 'tozero'
        },
        yaxis: {
          rangemode: 'tozero'
        }
      };
      var configOptions = {
        // modeBarButtonsToRemove: ['toggleHover', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d', 'zoom2d', 'lasso2d', 'pan2d', 'select2d', 'toggleSpikelines', 'hoverClosestCartesian', 'hoverCompareCartesian'],
        displaylogo: false,
        displayModeBar: true,
        responsive: true
      };
      Plotly.newPlot('myDiv', data, layout, configOptions);
      // if (this.isUpdate == false) {
      //   Plotly.newPlot('myDiv', data, layout, configOptions);
      //   this.isUpdate = true;
      // } else {
      //   console.log('update');
      //   Plotly.update('myDiv', data, layout);
      // }
    });
  }

  ngOnDestroy() {
    this.updateGraphSub.unsubscribe();
  }

  setDisplayDataOptions() {
    this.isSystemCurveShown = (this.systemAndEquipmentCurveService.systemCurveCollapsed.getValue() == 'open');
    this.isEquipmentCurveShown = (this.systemAndEquipmentCurveService.equipmentCurveCollapsed.getValue() == 'open');
    if (this.isEquipmentCurveShown && this.systemAndEquipmentCurveService.equipmentInputs.getValue() != undefined) {
      this.isEquipmentModificationShown = this.systemAndEquipmentCurveService.equipmentInputs.getValue().baselineMeasurement != this.systemAndEquipmentCurveService.equipmentInputs.getValue().modifiedMeasurement;
    } else {
      this.isEquipmentModificationShown = false;
    }
  }

  getTraceData() {
    let traces = new Array();
    if (this.isEquipmentCurveShown) {
      traces.push({
        x: this.systemAndEquipmentCurveService.baselineEquipmentCurveDataPairs.map(data => { return data.x }),
        y: this.systemAndEquipmentCurveService.baselineEquipmentCurveDataPairs.map(data => { return data.y }),
        mode: 'lines',
        name: 'Baseline',
        // text: ['tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object'],
        line: { shape: 'spline' },
        type: 'scatter'
      });
    }

    if (this.isEquipmentModificationShown) {
      traces.push({
        x: this.systemAndEquipmentCurveService.modifiedEquipmentCurveDataPairs.map(data => { return data.x }),
        y: this.systemAndEquipmentCurveService.modifiedEquipmentCurveDataPairs.map(data => { return data.y }),
        mode: 'lines',
        name: 'Modification',
        // text: ['tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object'],
        line: { shape: 'spline' },
        type: 'scatter'
      });
    }

    if (this.isSystemCurveShown) {
      traces.push({
        x: this.systemAndEquipmentCurveService.systemCurveRegressionData.map(data => { return data.x }),
        y: this.systemAndEquipmentCurveService.systemCurveRegressionData.map(data => { return data.y }),
        mode: 'lines',
        name: 'System Curve',
        // text: ['tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object'],
        line: { shape: 'spline' },
        type: 'scatter'
      });
    }
    return traces;
  }
}
