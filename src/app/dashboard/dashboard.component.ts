import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DirectoryDbRef, Directory } from '../shared/models/directory';
import { IndexedDbService } from '../indexedDb/indexed-db.service';
import { ModalDirective } from 'ngx-bootstrap';
import { Settings } from '../shared/models/settings';
import { AssessmentService } from '../assessment/assessment.service';
import { Assessment } from '../shared/models/assessment';
import { SuiteDbService } from '../suiteDb/suite-db.service';
import { ReportRollupService } from '../report-rollup/report-rollup.service';
import { Calculator } from '../shared/models/calculators';
import { Subscription } from 'rxjs';

import { AssessmentDbService } from '../indexedDb/assessment-db.service';
import { SettingsDbService } from '../indexedDb/settings-db.service';
import { DirectoryDbService } from '../indexedDb/directory-db.service';
import { CalculatorDbService } from '../indexedDb/calculator-db.service';
import { DeleteDataService } from '../indexedDb/delete-data.service';
import { ExportService } from '../shared/import-export/export.service';
import { ImportExportData } from '../shared/import-export/importExportModel';
import { ImportService } from '../shared/import-export/import.service';
import { CalculatorService } from '../calculator/calculator.service';
import { DirectoryDashboardService } from '../directory-dashboard/directory-dashboard.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  allDirectories: Directory;
  workingDirectory: Directory;
  isFirstChange: boolean = true;
  rootDirectoryRef: DirectoryDbRef;
  showLandingScreen: boolean;

  newDirEventToggle: boolean = false;
  dashboardView: string = 'landing-screen';
  goCalcHome: boolean = false;
  @ViewChild('deleteItemsModal', { static: false }) public deleteItemsModal: ModalDirective;
  @ViewChild('exportModal', { static: false }) public exportModal: ModalDirective;
  @ViewChild('importModal', { static: false }) public importModal: ModalDirective;
  @ViewChild('preAssessmentModal', { static: false }) public preAssessmentModal: ModalDirective;

  importInProgress: boolean = false;
  isExportView: boolean = false;
  isImportView: boolean = false;
  importing: any;
  // reportAssessments: Array<any>;
  selectedItems: Array<any>;
  showImportExport: boolean;
  deleting: boolean;
  suiteDbInit: boolean = false;
  isModalOpen: boolean = false;
  createAssessment: boolean = false;
  showPreAssessment: boolean = false;
  workingDirectorySettings: Settings;
  calcDataExists: boolean = false;
  dontShowSub: Subscription;
  tutorialShown: boolean = false;
  createAssessmentSub: Subscription;
  exportData: ImportExportData;
  exportAllSub: Subscription;
  selectedCalcIndex: number;
  dashboardViewSub: Subscription;
  workingDirectorySub: Subscription;
  selectedTool: string;
  selectedToolSub: Subscription;
  sidebarDataSub: Subscription;

  toastData: { title: string, body: string, setTimeoutVal: number } = { title: '', body: '', setTimeoutVal: undefined };
  showToast: boolean = false;

  createFolder: boolean;
  createFolderSub: Subscription;
  directoryId: number;
  constructor(private indexedDbService: IndexedDbService, private assessmentService: AssessmentService, private suiteDbService: SuiteDbService, private reportRollupService: ReportRollupService, private exportService: ExportService,
    private assessmentDbService: AssessmentDbService, private settingsDbService: SettingsDbService, private directoryDbService: DirectoryDbService, private calculatorDbService: CalculatorDbService,
    private deleteDataService: DeleteDataService, private importService: ImportService, private changeDetectorRef: ChangeDetectorRef, private calculatorService: CalculatorService,
    private directoryDashboardService: DirectoryDashboardService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    //start toolts suite database if it has not started
    this.initData();


    this.createFolderSub = this.directoryDashboardService.createFolder.subscribe(val => {
      this.createFolder = val;
    });
    this.createAssessmentSub = this.directoryDashboardService.createAssessment.subscribe(val => {
      this.createAssessment = val;
    })

    // this.createAssessmentSub = this.assessmentService.createAssessment.subscribe(val => {
    //   this.createAssessment = val;
    // });

    //this.initializeTutorials();

    this.exportAllSub = this.exportService.exportAllClick.subscribe(val => {
      if (val) {
        this.exportAll();
      }
    });
    this.dashboardViewSub = this.assessmentService.dashboardView.subscribe(viewStr => {
      if (viewStr) {
        this.dashboardView = viewStr;
      }
    });

    this.workingDirectorySub = this.assessmentService.workingDirectoryId.subscribe(id => {
      if (id) {
        let directory: Directory = this.directoryDbService.getById(id);
        this.changeWorkingDirectory(directory);
      }
    });

    this.selectedToolSub = this.calculatorService.selectedTool.subscribe(toolStr => {
      this.selectedTool = toolStr;
    });

    this.sidebarDataSub = this.assessmentService.updateSidebarData.subscribe(val => {
      this.newDir();
    });
  }

  ngOnDestroy() {
    this.assessmentService.createAssessment.next(false);
    this.createAssessmentSub.unsubscribe();
    if (this.dontShowSub) this.dontShowSub.unsubscribe();
    this.exportAllSub.unsubscribe();
    this.workingDirectorySub.unsubscribe();
    this.dashboardViewSub.unsubscribe();
    this.selectedToolSub.unsubscribe();
    this.sidebarDataSub.unsubscribe();
    this.createFolderSub.unsubscribe();
  }

  ngAfterViewInit() {
  }

  initData() {
    this.selectedItems = new Array();
    this.showLandingScreen = this.assessmentService.getLandingScreen();
    this.getData();
    if (this.suiteDbService.hasStarted === true && this.indexedDbService.initCustomObjects === true) {
      this.suiteDbService.initCustomDbMaterials();
    }
  }

  getWorkingDirectoryData() {
    this.workingDirectorySettings = this.settingsDbService.getByDirectoryId(this.workingDirectory.id);
    let tmpCalcs = this.calculatorDbService.getByDirectoryId(this.workingDirectory.id);
    if (tmpCalcs.length !== 0) {
      this.workingDirectory.calculators = tmpCalcs;
      this.calcDataExists = true;
    } else {
      this.workingDirectory.calculators = new Array<Calculator>();
      let tmpCalc: Calculator = {
        directoryId: this.workingDirectory.id
      };
      this.workingDirectory.calculators.push(tmpCalc);
      this.calcDataExists = false;
    }
    this.changeDetectorRef.detectChanges();
  }

  addCalculatorData(calcualtorData: Calculator) {
    if (this.calcDataExists) {
      this.indexedDbService.putCalculator(calcualtorData).then(() => {
        this.calculatorDbService.setAll().then(() => {
          this.hidePreAssessmentModal();
          this.getWorkingDirectoryData();
        });
      });
    } else {
      this.indexedDbService.addCalculator(calcualtorData).then(() => {
        this.calculatorDbService.setAll().then(() => {
          this.hidePreAssessmentModal();
          this.getWorkingDirectoryData();
        });
      });
    }
  }

  getData() {
    this.rootDirectoryRef = this.directoryDbService.getById(1);
    this.allDirectories = this.directoryDbService.getById(1);
    this.workingDirectory = this.allDirectories;
    if (!this.tutorialShown) {
      if (this.settingsDbService.globalSettings) {
        if (!this.assessmentService.tutorialShown && !this.settingsDbService.globalSettings.disableTutorial) {
          this.assessmentService.showTutorial.next('landing-screen');
          this.tutorialShown = true;
        }
      }
    }
    this.getWorkingDirectoryData();
  }

  updateDbData() {
    this.directoryDbService.getAll();
    this.assessmentDbService.getAll();
    this.settingsDbService.getAll();
    this.calculatorDbService.getAll();
  }

  openModal($event) {
    this.isModalOpen = $event;
  }

  hideScreen() {
    this.assessmentService.dashboardView.next('assessment-dashboard');
  }

  showPreAssessmentModal(calcIndex: number) {
    if (calcIndex !== undefined) {
      this.selectedCalcIndex = calcIndex;
    } else {
      let calcualtorData: Calculator = {
        directoryId: this.workingDirectory.id
      };
      this.workingDirectory.calculators.push(calcualtorData);
      this.selectedCalcIndex = this.workingDirectory.calculators.length - 1;
      this.calcDataExists = false;
    }
    this.showPreAssessment = true;
    this.preAssessmentModal.show();
  }

  hidePreAssessmentModal() {
    this.showPreAssessment = false;
    this.preAssessmentModal.hide();
  }

  getAllDirectories() {
    return this.allDirectories;
  }

  getWorkingDirectory() {
    return this.workingDirectory;
  }

  populateDirectories(directory: Directory): Directory {
    let tmpDirectory: Directory = {
      name: directory.name,
      createdDate: directory.createdDate,
      modifiedDate: directory.modifiedDate,
      id: directory.id,
      collapsed: false,
      parentDirectoryId: directory.parentDirectoryId
    };
    tmpDirectory.assessments = this.assessmentDbService.getByDirectoryId(directory.id);
    tmpDirectory.subDirectory = this.directoryDbService.getSubDirectoriesById(directory.id);
    return tmpDirectory;
  }

  changeWorkingDirectory(directory: Directory) {
    this.workingDirectory = this.populateDirectories(directory);
    this.getWorkingDirectoryData();
  }

  viewCalculator(str: string) {
    this.assessmentService.dashboardView.next('calculator');
  }

  newDir() {
    this.allDirectories = this.populateDirectories(this.allDirectories);
    this.workingDirectory = this.populateDirectories(this.workingDirectory);
    this.getWorkingDirectoryData();
    this.newDirEventToggle = !this.newDirEventToggle;
  }

  showDeleteItemsModal() {
    if (this.checkSelected()) {
      this.deleteItemsModal.show();
    } else {
      this.addToast('No items have been selected');
    }
  }

  hideDeleteItemsModal() {
    this.deleteItemsModal.hide();
  }

  showExportModal() {
    this.isExportView = true;
    this.isImportView = false;
    this.showImportExport = true;
    this.exportModal.show();
  }

  hideExportModal() {
    this.exportModal.hide();
    this.showImportExport = false;
    this.isExportView = false;
    this.isImportView = false;
  }

  showImportModal() {
    this.isImportView = true;
    this.isExportView = false;
    this.showImportExport = true;
    this.importModal.show();
  }

  hideImportModal() {
    this.importModal.hide();
    this.showImportExport = false;
    this.isExportView = false;
    this.isImportView = false;
  }

  checkSelected() {
    let tmpArray = new Array();
    let tmpArray2 = new Array();
    let tmpArray3 = new Array();
    if (this.workingDirectory.assessments) {
      tmpArray = this.workingDirectory.assessments.filter(
        assessment => {
          if (assessment.selected) {
            return assessment;
          }
        }
      );
    }
    if (this.workingDirectory.subDirectory) {
      tmpArray2 = this.workingDirectory.subDirectory.filter(
        subDir => {
          if (subDir.selected) {
            return subDir;
          }
        }
      );
    }
    if (this.workingDirectory.calculators) {
      tmpArray3 = this.workingDirectory.calculators.filter(
        calc => {
          if (calc.selected) {
            return calc;
          }
        }
      );
    }
    if (tmpArray.length !== 0 || tmpArray2.length !== 0 || tmpArray3) {
      return true;
    } else {
      return false;
    }

  }

  deleteSelected(dir: Directory) {
    this.deleting = true;
    let isWorkingDir;
    if (dir.id === this.workingDirectory.id) {
      isWorkingDir = true;
    } else {
      isWorkingDir = false;
    }
    this.deleteDataService.deleteDirectory(dir, isWorkingDir);
    setTimeout(() => {
      this.newDir();
      this.hideDeleteItemsModal();
      this.deleting = false;
    }, 1500);
  }

  generateReport() {
    if (this.checkSelected()) {
      this.selectedItems = new Array();
      this.workingDirectory.calculators.forEach(calc => {
        if (calc.selected) {
          this.reportRollupService.calcsArray.push(calc);
          this.reportRollupService.selectedCalcs.next(this.reportRollupService.calcsArray);
        }

      });
      this.reportRollupService.getReportData(this.workingDirectory);
      //this.getSelected(this.workingDirectory);
      this.assessmentService.dashboardView.next('detailed-report');
    } else {
      this.addToast('No items have been selected');
    }
  }

  exportSelected() {
    let test = this.exportService.getSelected(JSON.parse(JSON.stringify(this.workingDirectory)), this.workingDirectory.id);
    if (test.assessments.length !== 0 || test.directories.length !== 0 || test.calculators.length !== 0) {
      this.exportData = test;
      this.showExportModal();
    } else {
      this.addToast('No items have been selected');
    }
  }

  exportAll() {
    this.exportData = this.exportService.getSelected(JSON.parse(JSON.stringify(this.allDirectories)), 1);
    this.showExportModal();
  }

  returnSelected() {
    return this.selectedItems;
  }

  closeReport() {
    this.selectedItems = new Array();
    this.workingDirectory.calculators.forEach(calc => calc.selected = false);
    this.workingDirectory.assessments.forEach(
      assessment => {
        assessment.selected = false;
      }
    );
    //prevents unnecessary pre assessments in report rollup
    this.workingDirectory.subDirectory.forEach(dir => {
      dir.selected = false;
    });
    this.assessmentService.dashboardView.next('assessment-dashboard');
  }

  checkImportData(data: string) {
    let importData: ImportExportData = JSON.parse(data);
    if (importData.origin === "AMO-TOOLS-DESKTOP") {
      this.importInProgress = true;
      this.importService.importData(importData, this.workingDirectory.id);
      setTimeout(() => {
        this.hideImportModal();
        this.importInProgress = false;
        this.allDirectories = this.populateDirectories(this.allDirectories);
        this.workingDirectory = this.populateDirectories(this.workingDirectory);
        this.getWorkingDirectoryData();
      }, 1500);
    }
    else {
      this.addToast('INVALID FILE');
    }
  }

  //TOAST HERE
  addToast(msg: string) {
    this.toastData.title = msg;
    this.toastData.setTimeoutVal = 2000;
    this.showToast = true;
  }

  hideToast() {
    this.showToast = false;
    this.toastData = {
      title: '',
      body: '',
      setTimeoutVal: undefined
    }
  }
}

export interface ImportDataObjects {
  settings: Settings;
  directory: Directory;
  assessment: Assessment;
  directorySettings: Settings;
  calculator?: Calculator;
}
