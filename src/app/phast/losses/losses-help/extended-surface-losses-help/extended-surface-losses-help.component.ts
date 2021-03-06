import { Component, OnInit, Input } from '@angular/core';
import { Settings } from '../../../../shared/models/settings';

@Component({
  selector: 'app-extended-surface-losses-help',
  templateUrl: './extended-surface-losses-help.component.html',
  styleUrls: ['./extended-surface-losses-help.component.css']
})
export class ExtendedSurfaceLossesHelpComponent implements OnInit {
  @Input()
  settings: Settings;
  @Input()
  currentField: string;
  constructor() { }

  ngOnInit() {
  }

}
