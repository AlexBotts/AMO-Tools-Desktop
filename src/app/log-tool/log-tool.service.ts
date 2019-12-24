import { Injectable } from '@angular/core';
import { CsvImportData } from '../shared/helper-services/csv-to-json.service';
import * as _ from 'lodash';
@Injectable()
export class LogToolService {

  fileReference: any;
  importDataFromCsv: CsvImportData;
  startDate: Date;
  endDate: Date;
  fields: Array<{ fieldName: string, alias: string, useField: boolean, isDateField: boolean, unit: string }>;
  dateField: string;
  dateFormat: Array<string>;
  numberOfDataPoints: number;
  constructor() { }

  setDateField(str: string) {
    this.dateField = str;
  }

  setImportDataFromCsv(data: CsvImportData) {
    this.importDataFromCsv = data;
  }

  parseImportData() {
    this.setFields(this.importDataFromCsv.meta.fields);
    this.numberOfDataPoints = this.importDataFromCsv.data.length;
    let startDateItem = _.minBy(this.importDataFromCsv.data, (dataItem) => {
      if (dataItem[this.dateField]) {
        return new Date(dataItem[this.dateField])
      }
    });
    this.startDate = new Date(startDateItem[this.dateField]);
    let endDateItem = _.maxBy(this.importDataFromCsv.data, (dataItem) => {
      if (dataItem[this.dateField]) {
        return new Date(dataItem[this.dateField])
      }
    });
    this.endDate = new Date(endDateItem[this.dateField]);
  }

  setFields(_fields: Array<string>) {
    this.fields = new Array();
    _fields.forEach(field => {
      let unit: string = '';
      if(field == this.dateField){
        unit = 'Date';
      }
      this.fields.push({
        fieldName: field,
        alias: field,
        useField: true,
        isDateField: field == this.dateField,
        unit: unit
      });
    });
  }
}