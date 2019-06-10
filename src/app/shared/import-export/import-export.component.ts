import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { ImportExportService } from './import-export.service';
import { ImportExportData, ImportExportAssessment } from './importExportModel';

@Component({
  selector: 'app-import-export',
  templateUrl: './import-export.component.html',
  styleUrls: ['./import-export.component.css']
})
export class ImportExportComponent implements OnInit {
  @Input()
  exportData: ImportExportData;
  @Output('closeExportModal')
  closeExportModal = new EventEmitter<boolean>();
  @Output('closeImportModal')
  closeImportModal = new EventEmitter<boolean>();
  @Input()
  import: boolean;
  @Input()
  export: boolean;
  @Output('importData')
  importData = new EventEmitter<any>();

  // exportData: Array<ImportDataObjects>;
  isDataGathered: boolean;
  gatheringData: any;
  fileReference: any;
  validFile: boolean;
  noDirAssessmentItems: Array<ImportExportAssessment>;
  showCalcs: boolean = false;
  showDirs: boolean = false;
  canExport: boolean = false;
  name: string = null;
  importJson = null;
  constructor(private importExportService: ImportExportService) { }

  ngOnInit() {
    this.noDirAssessmentItems = new Array();
    if (this.export) {
      this.noDirAssessmentItems = JSON.parse(JSON.stringify(this.exportData.assessments));
      if (this.exportData.calculators) {
        if (this.exportData.calculators.length !== 0) {
          if (this.exportData.calculators[0].preAssessments) {
            this.showCalcs = true;
          }
        }
      }
      if (this.exportData.directories) {
        if (this.exportData.directories.length !== 0) {
          this.showDirs = true;
        }
      }
      this.test();
    }
  }

  test() {
    this.canExport = this.importExportService.test(this.exportData);
  }

  getDirAssessments(id: number) {
    if (this.noDirAssessmentItems) {
      _.remove(this.noDirAssessmentItems, (assessment) => { return assessment.assessment.directoryId === id; });
      // this.cd.detectChanges();
    }
    let assessments = _.filter(this.exportData.assessments, (assessmentItem) => { return assessmentItem.assessment.directoryId === id; });
    return assessments;
  }

  buildExportJSON() {
    this.importExportService.downloadData(this.exportData, this.name);
    this.closeExportModal.emit(true);
  }

  cancel() {
    this.importJson = null;
    this.closeExportModal.emit(true);
    this.closeImportModal.emit(true);
  }

  setImportFile($event) {
    if ($event.target.files) {
      if ($event.target.files.length !== 0) {
        let regex = /.json$/;
        if (regex.test($event.target.files[0].name)) {
          this.fileReference = $event;
          this.validFile = true;
        } else {
          let fr: FileReader = new FileReader();
          fr.readAsText($event.target.files[0]);
          fr.onloadend = (e) => {
            try {
              this.importJson = JSON.parse(JSON.stringify(fr.result));
              this.validFile = true;
            } catch (err) {
              this.validFile = false;
            }
          };
        }
      }
    }
  }

importFile() {
  if (!this.importJson) {
    let fr: FileReader = new FileReader();
    fr.readAsText(this.fileReference.target.files[0]);
    fr.onloadend = (e) => {
      this.importJson = JSON.parse(JSON.stringify(fr.result));
      this.importData.emit(this.importJson);
    };
  }
  else {
    this.importData.emit(this.importJson);
  }
}
}
