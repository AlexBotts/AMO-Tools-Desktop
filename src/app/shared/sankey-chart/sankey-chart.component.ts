import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { SankeyChartService, SankeyNode, SankeyLink, SankeyData, SankeyCycleProperties } from './sankey-chart.service';
import * as d3 from 'd3';
const width = 1200,
  height = 650;

@Component({
  selector: 'app-sankey-chart',
  templateUrl: './sankey-chart.component.html',
  styleUrls: ['./sankey-chart.component.css']
})
export class SankeyChartComponent implements OnInit {
  @Input()
  chartContainerWidth: number;
  @Input()
  sankeyNodes: Array<SankeyNode>;
  @Input()
  sankeyLinks: Array<SankeyLink>;

  @ViewChild('ngChart') ngChart: ElementRef;

  margin: { top: number, right: number, bottom: number, left: number };

  svg: d3.Selection<any>;
  sankey: d3.Selection<any>;
  path: d3.Selection<any>;
  width: number;
  height: number;
  nodeWidth: number;
  nodePadding: number;
  format: any;
  color: any;
  cycleProperties: SankeyCycleProperties;


  constructor(private sankeyChartService: SankeyChartService) { }

  ngOnInit() {
    this.format = this.sankeyChartService.getFormat();
    this.color = this.sankeyChartService.getColor();
    this.margin = this.sankeyChartService.getMargin();
    this.width = width - this.margin.left - this.margin.right;
    this.height = height - this.margin.top - this.margin.bottom;
    this.setSankeyCycleProperties();
    // this.width = width - this.margin.left - this.margin.right;
    // this.height = height - this.margin.top - this.margin.bottom;
    // this.sankeyChartService.setD3Sankey();
  }

  ngAfterViewInit() {
    // this.setSankeyDimensions();
    this.drawSankey();
  }

  setSankeyDimensions() {
    // this.width = width - this.margin.left - this.margin.right;
    // this.height = height - this.margin.top - this.margin.bottom;
    // this.width = this.sankeyChartService.getWidth(this.chartContainerWidth, this.margin);
    // this.height = this.sankeyChartService.getHeight(this.margin);
    // this.nodeWidth = this.sankeyChartService.getNodeWidth(this.width);
    // this.nodePadding = this.sankeyChartService.getNodePadding(this.width);
  }

  setSankeyCycleProperties() {
    this.cycleProperties = {
      cycleLaneNarrowWidth: 4,
      cycleLaneDistFromFwdPaths: -10,
      cycleDistFromNode: 30,
      cycleControlPointDist: 30,
      cycleSmallWidthBuffer: 2
    };
  }

  drawSankey() {
    this.svg = this.sankeyChartService.clearSvg(this.ngChart);
    this.svg = this.sankeyChartService.initSvg(this.ngChart, this.width, this.height, this.margin);
    this.sankey = this.sankeyChartService.initSankeyProperties(this.width, this.height, 0, 0);

    let sankeyData: SankeyData = {
      links: this.sankeyLinks,
      nodes: this.sankeyNodes
    };
    this.sankey
      .nodes(sankeyData.nodes)
      .links(sankeyData.links)
      .layout(32);
    this.svg = this.sankeyChartService.addViewBox(this.ngChart, this.svg, this.sankey, this.width + this.margin.left + this.margin.right, this.height + this.margin.top + this.margin.bottom);
    let link = this.sankeyChartService.getLink(this.svg, sankeyData, this.format, this.cycleProperties);
    let node = this.sankeyChartService.getNode(this.svg, sankeyData, 36, this.width, this.height, this.color, this.format);
  }

}
