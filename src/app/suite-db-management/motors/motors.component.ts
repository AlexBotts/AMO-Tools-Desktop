import { Component, OnInit } from '@angular/core';
import { SuiteDbService } from '../../suiteDb/suite-db.service';

@Component({
  selector: 'app-motors',
  templateUrl: './motors.component.html',
  styleUrls: ['./motors.component.css']
})
export class MotorsComponent implements OnInit {

  motors: Array<{
    catalog: string,
    efficiencyType: string,
    hp: number,
    hz: number,
    id: number,
    motorType: string,
    nemaTable: string,
    nominalEfficiency: number,
    poles: number,
    synchronousSpeed: number,
    voltageLimit: number
  }>;
  constructor(private suiteDbService: SuiteDbService) { }

  ngOnInit(): void {
    this.motors = this.suiteDbService.selectMotors();
    console.log(this.motors);
  }

}
