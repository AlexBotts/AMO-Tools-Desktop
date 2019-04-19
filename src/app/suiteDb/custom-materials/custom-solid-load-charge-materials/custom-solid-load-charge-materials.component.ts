import { Component, OnInit, Input, ViewChild, SimpleChanges } from '@angular/core';
import { Settings } from '../../../shared/models/settings';
import { SolidLoadChargeMaterial } from '../../../shared/models/materials';
import { ModalDirective } from 'ngx-bootstrap';
import { SuiteDbService } from '../../suite-db.service';
import { IndexedDbService } from '../../../indexedDb/indexed-db.service';
import { CustomMaterialsService } from '../custom-materials.service';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { ConvertUnitsService } from '../../../shared/convert-units/convert-units.service';
@Component({
  selector: 'app-custom-solid-load-charge-materials',
  templateUrl: './custom-solid-load-charge-materials.component.html',
  styleUrls: ['./custom-solid-load-charge-materials.component.css']
})
export class CustomSolidLoadChargeMaterialsComponent implements OnInit {
  @Input()
  settings: Settings;
  @Input()
  showModal: boolean;
  @Input()
  importing: boolean;

  solidChargeMaterials: Array<SolidLoadChargeMaterial>;
  editExistingMaterial: boolean = false;
  deletingMaterial: boolean = false;
  existingMaterial: SolidLoadChargeMaterial;
  @ViewChild('materialModal') public materialModal: ModalDirective;
  selectedSub: Subscription;
  selectAllSub: Subscription;

  constructor(private suiteDbService: SuiteDbService, private indexedDbService: IndexedDbService, private customMaterialService: CustomMaterialsService, private convertUnitsService: ConvertUnitsService) { }

  ngOnInit() {
    this.solidChargeMaterials = new Array<SolidLoadChargeMaterial>();
    this.getCustomMaterials();
    this.selectedSub = this.customMaterialService.getSelected.subscribe((val) => {
      if (val) {
        this.getSelected();
      }
    });

    this.selectAllSub = this.customMaterialService.selectAll.subscribe(val => {
      this.selectAll(val);
    });
  }

  ngOnDestroy() {
    this.selectAllSub.unsubscribe();
    this.selectedSub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.showModal && !changes.showModal.firstChange) {
      if (changes.showModal.currentValue !== changes.showModal.previousValue) {
        this.showMaterialModal();
      }
    }
    if (changes.importing) {
      if (changes.importing.currentValue === false && changes.importing.previousValue === true) {
        this.getCustomMaterials();
      }
    }
  }

  convertAllMaterials() {
    for (let i = 0; i < this.solidChargeMaterials.length; i++) {
      this.solidChargeMaterials[i].latentHeat = this.convertUnitsService.value(this.solidChargeMaterials[i].latentHeat).from('btuLb').to('kJkg');
      this.solidChargeMaterials[i].specificHeatSolid = this.convertUnitsService.value(this.solidChargeMaterials[i].specificHeatSolid).from('btulbF').to('kJkgC');
      this.solidChargeMaterials[i].specificHeatLiquid = this.convertUnitsService.value(this.solidChargeMaterials[i].specificHeatLiquid).from('btulbF').to('kJkgC');
      this.solidChargeMaterials[i].meltingPoint = this.convertUnitsService.value(this.solidChargeMaterials[i].meltingPoint).from('F').to('C');
    }
  }

  getCustomMaterials() {
    this.indexedDbService.getAllSolidLoadChargeMaterial().then(idbResults => {
      this.solidChargeMaterials = idbResults;
      if (this.settings.unitsOfMeasure === 'Metric') {
        this.convertAllMaterials();
      }
    });
  }

  editMaterial(id: number) {
    this.indexedDbService.getSolidLoadChargeMaterial(id).then(idbResults => {
      this.existingMaterial = idbResults;
      this.editExistingMaterial = true;
      this.showMaterialModal();
    });
  }

  deleteMaterial(id: number) {
    this.indexedDbService.getSolidLoadChargeMaterial(id).then(idbResults => {
      this.existingMaterial = idbResults;
      this.editExistingMaterial = true;
      this.deletingMaterial = true;
      this.showMaterialModal();
    });
  }

  showMaterialModal() {
    this.showModal = true;
    this.materialModal.show();
  }

  hideMaterialModal(event?: any) {
    this.materialModal.hide();
    this.showModal = false;
    this.editExistingMaterial = false;
    this.deletingMaterial = false;
    this.getCustomMaterials();
  }
  getSelected() {
    let selected: Array<SolidLoadChargeMaterial> = _.filter(this.solidChargeMaterials, (material) => { return material.selected === true; });
    this.customMaterialService.selectedSolidCharge = selected;
  }
  selectAll(val: boolean) {
    this.solidChargeMaterials.forEach(material => {
      material.selected = val;
    });
  }
}
