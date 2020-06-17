import { Component, OnInit } from '@angular/core';
import { SuiteDbService } from '../../suiteDb/suite-db.service';

@Component({
  selector: 'app-pumps',
  templateUrl: './pumps.component.html',
  styleUrls: ['./pumps.component.css']
})
export class PumpsComponent implements OnInit {

  constructor(private suiteDbService: SuiteDbService) { }

  ngOnInit(): void {
    let pumps = this.suiteDbService.selectPumps();
    console.log(pumps);
  }

}
