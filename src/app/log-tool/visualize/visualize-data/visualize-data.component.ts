import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LogToolField } from '../../log-tool-models';
import { VisualizeService } from '../visualize.service';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-visualize-data',
  templateUrl: './visualize-data.component.html',
  styleUrls: ['./visualize-data.component.css']
})
export class VisualizeDataComponent implements OnInit {


  timeSummaries: Array<{
    csvName: string,
    startDate: Date,
    endDate: Date,
    dataFrequency: number,
    numberOfDataPoints: number
  }>;

  selectedGraphObjSub: Subscription;

  axisSummaries: Array<{
    max: number,
    min: number,
    numberOfDataPoints: number,
    standardDeviation: number,
    mean: number,
    name: string
  }>;
  constructor(private visualizeService: VisualizeService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.selectedGraphObjSub = this.visualizeService.selectedGraphObj.subscribe(graphObj => {
      this.timeSummaries = new Array();
      this.axisSummaries = new Array();
      if (graphObj.selectedXAxisDataOption.dataField && graphObj.selectedXAxisDataOption.dataField.alias == 'Time Series') {
        this.setDataSummary();
      } else if (graphObj.selectedXAxisDataOption.dataField) {
        let xAxisSummary = this.getDataSummary(graphObj.selectedXAxisDataOption, 'X-Axis')
        this.axisSummaries.push(xAxisSummary);
      }
      if (graphObj.data[0].type != 'bar') {
        graphObj.selectedYAxisDataOptions.forEach(option => {
          let yAxis: string = 'Y-Axis';
          if(option.yaxis == 'y2'){
            yAxis = 'Right Y-Axis'
          }
          let summary = this.getDataSummary(option.dataOption, yAxis);
          this.axisSummaries.push(summary);
        });
      }
      this.cd.detectChanges();
    });
  }

  ngOnDestroy() {
    this.selectedGraphObjSub.unsubscribe();
  }

  setDataSummary() {
    let visualizeData: Array<{ dataField: LogToolField, data: Array<number | string> }> = this.visualizeService.visualizeData;
    visualizeData.forEach(dataItem => {
      if (dataItem.dataField.isDateField) {
        let dateFieldSummary = this.getDataSummaryItem(dataItem.data, dataItem.dataField.csvName);
        this.timeSummaries.push(dateFieldSummary);
      }
    })
  }

  getDataSummaryItem(data: Array<number | string>, csvName: string): {
    csvName: string,
    startDate: Date,
    endDate: Date,
    dataFrequency: number,
    numberOfDataPoints: number
  } {
    let min: any = _.min(data);
    let max: any = _.max(data);
    let date1 = new Date(data[0]);
    let date2 = new Date(data[1]);
    let intervalDifference = (date2.getTime() - date1.getTime()) / 1000;
    return {
      csvName: csvName,
      startDate: min,
      endDate: max,
      dataFrequency: intervalDifference,
      numberOfDataPoints: data.length
    }
  }

  getDataSummary(dataOption: { dataField: LogToolField, data: Array<any> }, axis: string): {
    max: number,
    min: number,
    numberOfDataPoints: number,
    standardDeviation: number,
    mean: number,
    name: string,
    axis: string
  } {
    let min: number;
    let max: number;
    let mean: number;
    let standardDeviation;
    if (isNaN(dataOption.data[0]) == false) {
      min = _.min(dataOption.data);
      max = _.max(dataOption.data);
      mean = _.mean(dataOption.data);
      standardDeviation = this.visualizeService.calculateStandardDeviation(dataOption.data, mean);
    }
    return {
      axis: axis,
      max: max,
      min: min,
      numberOfDataPoints: dataOption.data.length,
      standardDeviation: standardDeviation,
      mean: mean,
      name: dataOption.dataField.alias
    }
  }



}