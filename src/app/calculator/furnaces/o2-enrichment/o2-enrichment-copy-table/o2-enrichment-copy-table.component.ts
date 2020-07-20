import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Settings } from '../../../../shared/models/settings';
import { O2EnrichmentOutput } from '../../../../shared/models/phast/o2Enrichment';
import { Subscription } from 'rxjs';
import { O2EnrichmentService } from '../o2-enrichment.service';

@Component({
  selector: 'app-o2-enrichment-copy-table',
  templateUrl: './o2-enrichment-copy-table.component.html',
  styleUrls: ['./o2-enrichment-copy-table.component.css']
})
export class O2EnrichmentCopyTableComponent implements OnInit {

  @Input()
  settings: Settings;
  @ViewChild('enrichmentTable', { static: false }) enrichmentTable: ElementRef;

  enrichmentTableString: any;
  outputs: Array<O2EnrichmentOutput>;
  currentEnrichmentOutput: O2EnrichmentOutput;
  outputSub: Subscription;
  clickedBtn: boolean = false;
  constructor(private o2EnrichmentService: O2EnrichmentService) { }

  ngOnInit(): void {
    this.outputSub = this.o2EnrichmentService.enrichmentOutputs.subscribe(outputs => {
      let currentEnrichmentIndex = this.o2EnrichmentService.currentEnrichmentIndex.getValue();
      this.outputs = outputs;
      this.currentEnrichmentOutput = outputs[currentEnrichmentIndex];
    });
    console.log('clickedBtn', this.clickedBtn);
  }

  ngOnDestroy() {
    this.outputSub.unsubscribe();
  }

  updateEnrichmentTableString() {
    // this.clickedBtn = true;
    this.enrichmentTableString = this.enrichmentTable.nativeElement.innerText;
    // console.log('clicked', this.clickedBtn, this.enrichmentTableString);
    // this.clickedBtn = false;
  }
}