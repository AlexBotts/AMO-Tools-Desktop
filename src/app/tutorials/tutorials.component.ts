import { Component, OnInit } from '@angular/core';
import { AssessmentService } from '../assessment/assessment.service';

@Component({
  selector: 'app-tutorials',
  templateUrl: './tutorials.component.html',
  styleUrls: ['./tutorials.component.css']
})
export class TutorialsComponent implements OnInit {

  constructor(private assessmentService: AssessmentService) { }

  ngOnInit() {
  }

  viewOpeningTutorial() {
    this.assessmentService.tutorialShown = false;
    this.assessmentService.showTutorial.next('landing-screen');
  }
  
  viewPhastTutorial() {
    this.assessmentService.tutorialShown = false;
    this.assessmentService.showTutorial.next('phast-tutorial');
  }

  viewDashboardTutorial() {
    this.assessmentService.tutorialShown = false;
    this.assessmentService.showTutorial.next('dashboard-tutorial');
  }

  viewTutorial(str: string) {
    this.assessmentService.tutorialShown = false;
    this.assessmentService.showTutorial.next(str);
  }
}
