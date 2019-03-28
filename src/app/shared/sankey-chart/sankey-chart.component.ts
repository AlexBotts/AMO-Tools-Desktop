import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { SankeyChartService, SankeyNode, SankeyLink, SankeyData } from './sankey-chart.service';
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


  constructor(private sankeyChartService: SankeyChartService) { }

  ngOnInit() {
    this.format = this.sankeyChartService.getFormat();
    this.color = this.sankeyChartService.getColor();
    this.margin = this.sankeyChartService.getMargin();
    this.width = width;
    this.height = height;
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

  drawSankey() {
    this.svg = this.sankeyChartService.clearSvg(this.ngChart);
    this.svg = this.sankeyChartService.initSvg(this.ngChart, this.width, this.height, this.margin);
    this.sankey = this.sankeyChartService.initSankeyProperties(this.width - this.margin.left - this.margin.right, this.height - this.margin.top - this.margin.bottom, 0, 0);
    // let line = d3.line()
    //   .x(function (d) { return (d.x) })
    //   .y(function (d) { return (d.y) })
    //   .curve(d3.curveBundle);
    // let loop = d3.line()
    //   .x(function (d) { return (d.x) })
    //   .y(function (d) { return (d.y) })
    //   .curve(d3.curveCardinal);

    // this.path = this.sankey.link;

    let sankeyData: SankeyData = {
      links: this.sankeyLinks,
      nodes: this.sankeyNodes
    };

    this.sankey
      .nodes(sankeyData.nodes)
      .links(sankeyData.links)
      .layout(32);
    this.sankeyChartService.addViewBox(this.svg, this.sankey, this.width - this.margin.left - this.margin.right, this.height - this.margin.top - this.margin.bottom);


    let link = this.sankeyChartService.getLink(this.svg, sankeyData, this.format, this.path);

    // let link = this.sankeyChartService.getLink(this.svg, sankeyData, this.format, line);
    let node = this.sankeyChartService.getNode(this.svg, sankeyData, 36, this.width - this.margin.left - this.margin.right, this.height - this.margin.top - this.margin.bottom, this.color, this.format);
  }

}
