import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { Directory } from '../../shared/models/directory';
import { AssessmentService } from '../assessment.service';
import { Settings } from 'electron';
import { DirectoryDbService } from '../../indexedDb/directory-db.service';
import { ExportService } from '../../dashboard/import-export/export.service';

@Component({
  selector: 'app-assessment-menu',
  templateUrl: './assessment-menu.component.html',
  styleUrls: ['./assessment-menu.component.css']
})
export class AssessmentMenuComponent implements OnInit {
  @Input()
  directory: Directory;
  @Input()
  view: string;
  @Output('viewChange')
  viewChange = new EventEmitter();
  @Output('directoryChange')
  directoryChange = new EventEmitter();
  @Output('deleteItems')
  deleteItems = new EventEmitter<boolean>();
  @Output('selectAll')
  selectAll = new EventEmitter<boolean>();
  @Output('newDir')
  newDir = new EventEmitter<boolean>();
  @Output('genReport')
  genReport = new EventEmitter<boolean>();
  @Output('exportEmit')
  exportEmit = new EventEmitter<boolean>();
  @Output('importEmit')
  importEmit = new EventEmitter<boolean>();
  @Output('emitMove')
  emitMove = new EventEmitter<boolean>();
  @Output('emitPreAssessment')
  emitPreAssessment = new EventEmitter<boolean>();
  @Input()
  directorySettings: Settings;

  breadCrumbs: Array<Directory>;
  isAllSelected: boolean;
  createAssessment: boolean = false;
  constructor(private directoryDbService: DirectoryDbService, private assessmentService: AssessmentService, private exportService: ExportService) { }

  ngOnInit() {
    this.breadCrumbs = new Array();
    this.getBreadcrumbs(this.directory.id);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.directory) {
      this.breadCrumbs = new Array();
      this.getBreadcrumbs(changes.directory.currentValue.id);
    }
  }

  showCreateAssessment() {
    this.assessmentService.createAssessment.next(true);
  }

  setView(view: string) {
    this.viewChange.emit(view);
  }

  emitNewDir() {
    this.newDir.emit(true);
  }

  emitGenReport() {
    this.genReport.emit(true);
  }

  goToDirectory(dir) {
    this.directoryChange.emit(dir);
  }

  getBreadcrumbs(dirId: number) {
    let resultDir = this.directoryDbService.getById(dirId);
    if (resultDir.id !== this.directory.id) {
      this.breadCrumbs.unshift(resultDir);
    }
    if (resultDir.parentDirectoryId) {
      this.getBreadcrumbs(resultDir.parentDirectoryId);
    }
  }

  signalDeleteItems() {
    this.deleteItems.emit(true);
  }

  signalSelectAll() {
    this.selectAll.emit(this.isAllSelected);
  }

  emitExport() {
    this.exportService.selectAllFolder = this.isAllSelected;
    this.exportEmit.emit(true);
  }

  emitImport() {
    this.importEmit.emit(true);
  }

  checkSelected() {
    let tmpArray = new Array();
    // let calcTest;
    if (this.directory.calculators) {
      tmpArray = this.directory.calculators.filter(calc => {
        return calc.selected === true;
      });
      // if(this.directory.calculators[0].selected){
      //   calcTest = true;
      // }
    }
    if (this.checkReport() || tmpArray.length !== 0) {
      return true;
    } else {
      return false;
    }
  }

  checkReport() {
    let tmpArray = new Array();
    let tmpArray2 = new Array();
    if (this.directory.assessments) {
      tmpArray = this.directory.assessments.filter(
        assessment => {
          if (assessment.selected) {
            return assessment;
          }
        }
      );
    }
    if (this.directory.subDirectory) {
      tmpArray2 = this.directory.subDirectory.filter(
        subDir => {
          if (subDir.selected) {
            return subDir;
          }
        }
      );
    }
    if (tmpArray.length !== 0 || tmpArray2.length !== 0) {
      return true;
    } else {
      return false;
    }
  }


  showPreAssessment() {
    this.emitPreAssessment.emit();
  }

}
