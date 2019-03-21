import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { SankeyChartService, SankeyNode, SankeyLink, SankeyData } from './sankey-chart.service';
import * as d3 from 'd3';
const width = 700,
  height = 300;

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
    this.svg = this.sankeyChartService.initSvg(this.ngChart, this.width - this.margin.left - this.margin.right, this.height - this.margin.top - this.margin.bottom, this.margin);
    console.log('this.width = ' + this.width);
    console.log('this.height = ' + this.height);
    console.log('this.nodeWidth = ' + this.nodeWidth);
    console.log('this.nodePadding = ' + this.nodePadding);
    this.sankey = this.sankeyChartService.initSankeyProperties(this.width, this.height, 0, 0);
    console.log('sankey = ');
    console.log(this.sankey);
    // this.path = this.sankeyChartService.getPath(this.sankey);
    this.path = this.sankey.link();
    console.log('post path = ');
    console.log(this.path);
    let sankeyData: SankeyData = {
      links: this.sankeyLinks,
      nodes: this.sankeyNodes
    };
    // sankeyData.links.forEach(function (d, i) {
    //   sankeyData.links[i].source = sankeyData.nodes.indexOf({ node: i, name: sankeyData.links[i].source });
    //   sankeyData.links[i].target = sankeyData.nodes.indexOf({ node: i, name: sankeyData.links[i].target });
    // });
    // sankeyData.nodes.forEach(function (d, i) {
    //   sankeyData.nodes[i] = { "node": i, "name": d.name };
    // });

    this.sankey
      .nodes(sankeyData.nodes)
      .links(sankeyData.links)
      .layout(32);

    console.log('sankey post node/links/layout = ');
    console.log(this.sankey);

    let link = this.sankeyChartService.getLink(this.svg, sankeyData, this.path, this.format);
    let node = this.sankeyChartService.getNode(this.svg, sankeyData, 36, this.width, this.color, this.format);

  }

}
