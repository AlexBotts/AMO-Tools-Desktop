import { Component, OnInit } from '@angular/core';
import { MotorInventoryService } from '../../motor-inventory.service';
import { MotorCatalogService } from './motor-catalog.service';
import { Settings } from '../../../shared/models/settings';
import { SettingsDbService } from '../../../indexedDb/settings-db.service';
import { Subscription } from 'rxjs';
import { SuiteDbMotor } from '../../../shared/models/materials';
import { MotorInventoryData, MotorInventoryDepartment, MotorItem } from '../../motor-inventory';

@Component({
  selector: 'app-motor-catalog',
  templateUrl: './motor-catalog.component.html',
  styleUrls: ['./motor-catalog.component.css']
})
export class MotorCatalogComponent implements OnInit {

  settings: Settings;

  motorInventoryData: MotorInventoryData;
  motorInventoryDataSub: Subscription;

  selectedDepartmentIdSub: Subscription;
  showSelectMotorModal: boolean = false;
  constructor(private motorInventoryService: MotorInventoryService, private motorCatalogService: MotorCatalogService, private settingsDbService: SettingsDbService) { }

  ngOnInit(): void {
    this.settings = this.settingsDbService.globalSettings;
    this.motorInventoryDataSub = this.motorInventoryService.motorInventoryData.subscribe(val => {
      this.motorInventoryData = val;
    });
    this.selectedDepartmentIdSub = this.motorCatalogService.selectedDepartmentId.subscribe(val => {
      if (!val) {
        this.motorCatalogService.selectedDepartmentId.next(this.motorInventoryData.departments[0].id);
      } else {
        let findDepartment: MotorInventoryDepartment = this.motorInventoryData.departments.find(department => { return department.id == val });
        this.motorCatalogService.selectedMotorItem.next(findDepartment.catalog[0]);
      }
    });
  }

  ngOnDestroy() {
    this.selectedDepartmentIdSub.unsubscribe();
    this.motorInventoryDataSub.unsubscribe();
  }

  openMotorSelectionModal() {
    this.showSelectMotorModal = true;
  }

  closeMotorSelectionModal() {
    this.showSelectMotorModal = false;
  }

  setMotorSelection(dbMotor: SuiteDbMotor) {
    this.closeMotorSelectionModal();
    // let selectedMotor: MotorItem = this.motorCatalogService.selectedMotorItem.getValue();
    // let updatedMotorItem: MotorItem = this.motorCatalogService.setSuiteDbMotorProperties(dbMotor, selectedMotor);
    // this.motorInventoryService.updateMotorItem(updatedMotorItem);
    // this.motorCatalogService.selectedMotorItem.next(updatedMotorItem);
  }
}
