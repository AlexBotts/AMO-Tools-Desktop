import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PrvOutput } from '../../../shared/models/steam/steam-outputs';

@Component({
  selector: 'app-prv-diagram',
  templateUrl: './prv-diagram.component.html',
  styleUrls: ['./prv-diagram.component.css']
})
export class PrvDiagramComponent implements OnInit {
  @Input()
  prv: PrvOutput;
  @Input()
  inletSteam: string;
  @Input()
  outletSteam: string;
  @Output('emitSetHover')
  emitSetHover = new EventEmitter<string>();
  @Output('emitSelectEquipment')
  emitSelectEquipment = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  hoverEquipment(str: string) {
    this.emitSetHover.emit(str);
  }

  hoverInlet() {
    if (this.inletSteam == 'medium-pressure') {
      this.emitSetHover.emit('mediumPressureHovered');
    } else if (this.inletSteam == 'high-pressure') {
      this.emitSetHover.emit('highPressureHovered');
    }
  }

  hoverOutlet() {
    if (this.outletSteam == 'low-pressure') {
      this.emitSetHover.emit('lowPressureHovered');
    } else if (this.outletSteam == 'medium-pressure') {
      this.emitSetHover.emit('mediumPressureHovered');
    }
  }

  selectEquipment(){
    if(this.inletSteam == 'high-pressure'){
      if(this.outletSteam == 'medium-pressure'){
        this.emitSelectEquipment.emit('highToMediumPressurePRV');
      }else{
        this.emitSelectEquipment.emit('lowPressurePRV');
      }
    }else if(this.inletSteam == 'medium-pressure'){
      this.emitSelectEquipment.emit('lowPressurePRV');
    }
  }

  hoverPRV(){
    if(this.inletSteam == 'high-pressure'){
      if(this.outletSteam == 'medium-pressure'){
        this.emitSetHover.emit('highToMediumPressurePRVHovered');
      }else{
        this.emitSetHover.emit('lowPressurePRVHovered');
      }
    }else if(this.inletSteam == 'medium-pressure'){
      this.emitSetHover.emit('lowPressurePRVHovered');
    }
  }
  
}
