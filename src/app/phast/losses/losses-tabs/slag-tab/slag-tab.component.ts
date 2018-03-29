import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { LossesService } from '../../losses.service';
import { PHAST } from '../../../../shared/models/phast/phast';
import { FormGroup } from '@angular/forms';
import { SlagService } from '../../slag/slag.service';
import { SlagCompareService } from '../../slag/slag-compare.service';
import { Slag } from '../../../../shared/models/phast/losses/slag';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-slag-tab',
  templateUrl: './slag-tab.component.html',
  styleUrls: ['./slag-tab.component.css']
})
export class SlagTabComponent implements OnInit {
  @Input()
  phast: PHAST;

  numLosses: number = 0;
  inputError: boolean;
  missingData: boolean;
  isDifferent: boolean;
  badgeClass: Array<string>;
  compareSubscription: Subscription;
  lossSubscription: Subscription;
  constructor(private lossesService: LossesService, private slagService: SlagService, private slagCompareService: SlagCompareService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.setNumLosses();
    this.lossSubscription = this.lossesService.updateTabs.subscribe(val => {
      this.setNumLosses();
      this.missingData = this.checkMissingData();
      this.isDifferent = this.checkDifferent();
      this.setBadgeClass();
    })

    this.compareSubscription = this.slagCompareService.inputError.subscribe(val => {
      this.inputError = val;
      this.setBadgeClass();
    })
  }

  ngOnDestroy(){
    this.compareSubscription.unsubscribe();
    this.lossSubscription.unsubscribe();
  }

  setBadgeClass(){
    let badgeStr: Array<string> = ['success'];
    if(this.missingData){
      badgeStr = ['missing-data'];
    }else if(this.inputError){
      badgeStr = ['input-error'];
    }else if(this.isDifferent){
      badgeStr = ['loss-different'];
    }
    this.badgeClass = badgeStr;
    this.cd.detectChanges();
  }

  setNumLosses() {
    if (this.phast.losses) {
      if (this.phast.losses.slagLosses) {
        this.numLosses = this.phast.losses.slagLosses.length;
      }
    }
  }
  checkMissingData(): boolean {
    let testVal = false;
    if (this.slagCompareService.baselineSlag) {
      this.slagCompareService.baselineSlag.forEach(loss => {
        if (this.checkLossValid(loss) == false) {
          testVal = true;
        }
      })
    }
    if (this.slagCompareService.modifiedSlag) {
      this.slagCompareService.modifiedSlag.forEach(loss => {
        if (this.checkLossValid(loss) == false) {
          testVal = true;
        }
      })
    }
    return testVal;
  }


  checkLossValid(loss: Slag) {
      let tmpForm: FormGroup = this.slagService.getFormFromLoss(loss);
      if (tmpForm.status == 'VALID') {
        return true;
      } else {
        return false;
      }
  }

  checkDifferent() {
    if (this.slagCompareService.baselineSlag && this.slagCompareService.modifiedSlag) {
      return this.slagCompareService.compareAllLosses();
    }
  }

}
