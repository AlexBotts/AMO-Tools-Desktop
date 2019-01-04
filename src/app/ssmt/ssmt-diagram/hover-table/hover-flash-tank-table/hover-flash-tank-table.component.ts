import { Component, OnInit, Input } from '@angular/core';
import { CalculateModelService } from '../../../ssmt-calculations/calculate-model.service';
import { FlashTankOutput } from '../../../../shared/models/steam/steam-outputs';

@Component({
  selector: 'app-hover-flash-tank-table',
  templateUrl: './hover-flash-tank-table.component.html',
  styleUrls: ['./hover-flash-tank-table.component.css']
})
export class HoverFlashTankTableComponent implements OnInit {
  @Input()
  flashTankType: string;

  flashTank: FlashTankOutput;
  constructor(private calculateModelService: CalculateModelService) { }

  ngOnInit() {
    if (this.flashTankType == 'High Pressure') {
      this.flashTank = this.calculateModelService.highPressureCondensateFlashTank;
      this.flashTankType = this.flashTankType + ' Condensate';
    } else if (this.flashTankType == 'Medium Pressure') {
      this.flashTank = this.calculateModelService.mediumPressureCondensateFlashTank;
      this.flashTankType = this.flashTankType + ' Condensate';
    } else if (this.flashTankType == 'Condensate') {
      this.flashTank = this.calculateModelService.condensateFlashTank;
    }
  }

}
