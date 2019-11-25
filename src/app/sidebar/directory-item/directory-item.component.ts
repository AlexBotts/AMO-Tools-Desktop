import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { Directory, DirectoryDbRef } from '../../shared/models/directory';
import { DirectoryDbService } from '../../indexedDb/directory-db.service';
import { AssessmentDbService } from '../../indexedDb/assessment-db.service';
import { AssessmentService } from '../../assessment/assessment.service';

@Component({
  selector: 'app-directory-item',
  templateUrl: './directory-item.component.html',
  styleUrls: ['./directory-item.component.css']
})
export class DirectoryItemComponent implements OnInit {
  @Input()
  directory: Directory;

  childDirectories: Directory;
  validDirectory: boolean = false;
  constructor(private directoryDbService: DirectoryDbService, private assessmentDbService: AssessmentDbService, private assessmentService: AssessmentService, private cd: ChangeDetectorRef) { }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes.directory && !changes.directory.firstChange) {
  //     this.populateDirectories(this.directory);
  //   }
  //   if (changes.newDirEventToggle && !changes.newDirEventToggle.firstChange) {
  //     this.populateDirectories(this.directory);
  //   }
  // }

  ngOnInit() {
    // if (this.directory.id != undefined) {
    //   this.validDirectory = true;
    //   this.populateDirectories(this.directory);
    // }
  }

  toggleSelected(directory: Directory) {
    // this.assessmentService.dashboardView.next('assessment-dashboard');
    // this.selectSignal.emit(directory);
  }

  toggleDirectoryCollapse(directory: Directory) {
    // this.collapseSignal.emit(directory);
  }

  // populateDirectories(directoryRef: DirectoryDbRef) {
  //   this.directory.assessments = this.assessmentDbService.getByDirectoryId(directoryRef.id);
  //   this.directory.subDirectory = this.directoryDbService.getSubDirectoriesById(directoryRef.id);
  //   this.directory.collapsed = false;
  //   this.cd.detectChanges();
  // }
}
