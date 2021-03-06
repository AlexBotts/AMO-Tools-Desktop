import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ImportService } from '../import.service';
import { ImportExportData } from '../importExportModel';
import { DirectoryDashboardService } from '../../directory-dashboard/directory-dashboard.service';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-import-modal',
  templateUrl: './import-modal.component.html',
  styleUrls: ['./import-modal.component.css']
})
export class ImportModalComponent implements OnInit {

  @ViewChild('importModal', { static: false }) public importModal: ModalDirective;

  importInProgress: boolean = false;
  fileReference: any;
  validFile: boolean;
  importJson: any = null;
  constructor(private importService: ImportService, private directoryDashboardService: DirectoryDashboardService, private dashboardService: DashboardService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.showImportModal();
  }

  showImportModal() {
    this.importModal.show();
  }

  hideImportModal() {
    this.importModal.hide();
    this.importModal.onHidden.subscribe(val => {
      this.directoryDashboardService.showImportModal.next(false);
    });
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
        this.runImport(this.importJson)
      };
    }
    else {
      this.runImport(this.importJson);
    }
  }

  runImport(data: string) {
    let importData: ImportExportData = JSON.parse(data);
    if (importData.origin === "AMO-TOOLS-DESKTOP") {
      this.importInProgress = true;
      let directoryId: number = this.directoryDashboardService.selectedDirectoryId.getValue();
      this.importService.importData(importData, directoryId);
      setTimeout(() => {
        this.hideImportModal();
        this.importInProgress = false;
        this.dashboardService.updateDashboardData.next(true);
      }, 1500);
    }
    else {
      this.validFile = false;
      this.dashboardService.dashboardToastMessage.next('INVALID FILE');
    }
  }
}