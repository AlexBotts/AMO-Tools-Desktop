import { Component, OnInit } from '@angular/core';
import { SuiteDbService } from '../../suiteDb/suite-db.service';
import { AtmosphereSpecificHeat } from '../../shared/models/materials';
import { IndexedDbService } from '../../indexedDb/indexed-db.service';

@Component({
  selector: 'app-atmosphere-gas',
  templateUrl: './atmosphere-gas.component.html',
  styleUrls: ['./atmosphere-gas.component.css']
})
export class AtmosphereGasComponent implements OnInit {

  allDbEntries: Array<AtmosphereSpecificHeat>;
  constructor(private suiteDbService: SuiteDbService, private indexedDbService: IndexedDbService) { }

  ngOnInit(): void {
    this.allDbEntries = this.suiteDbService.selectAtmosphereSpecificHeat();
    this.indexedDbService.getAtmosphereSpecificHeat().then(idbResults => { console.log(idbResults) });
  }

}
