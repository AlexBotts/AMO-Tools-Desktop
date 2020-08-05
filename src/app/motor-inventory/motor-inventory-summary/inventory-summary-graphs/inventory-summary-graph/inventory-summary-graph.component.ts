import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as Plotly from 'plotly.js';
import { InventorySummaryGraphsService } from '../inventory-summary-graphs.service';
import { MotorInventoryService } from '../../../motor-inventory.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inventory-summary-graph',
  templateUrl: './inventory-summary-graph.component.html',
  styleUrls: ['./inventory-summary-graph.component.css']
})
export class InventorySummaryGraphComponent implements OnInit {

  @ViewChild('visualizeChart', { static: false }) visualizeChart: ElementRef;

  selectedFieldSub: Subscription;
  constructor(private inventorySummaryGraphsService: InventorySummaryGraphsService, private motorInventoryService: MotorInventoryService,
    private inventorySummaryGraphService: InventorySummaryGraphsService) { }

  ngOnInit(): void {
    this.selectedFieldSub = this.inventorySummaryGraphService.selectedField.subscribe(val => {
      Plotly.purge('inventoryGraph');
      if (val) {
        let motorInventoryData = this.motorInventoryService.motorInventoryData.getValue();
        let calcedData = this.inventorySummaryGraphsService.getBinData(motorInventoryData, val);
        let type: string = this.inventorySummaryGraphService.graphType.getValue();
        var data = [
          {
            x: calcedData.xData,
            y: calcedData.yData,
            values: calcedData.yData,
            labels: calcedData.xData,
            type: type
          }
        ];
        let layout = {
          title: {
            text: 'Motor Inventory',
            font: {
              family: 'Arial',
              size: 22
            }
          },
          yaxis: {
            // hoverformat: '.3r',
            title: {
              text: '# of Motors',
              font: {
                family: 'Arial',
                size: 16
              }
            },
            fixedrange: true
          },
          xaxis: {
            fixedrange: true,
            title: {
              text: val.display
            },
            font: {
              family: 'Arial',
              size: 16
            }
          },
        };
        Plotly.newPlot('inventoryGraph', data, layout);
      }
    });
  }

  ngOnDestroy() {
    this.selectedFieldSub.unsubscribe();
  }
}
