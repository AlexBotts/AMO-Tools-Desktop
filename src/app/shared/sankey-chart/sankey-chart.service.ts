import { Injectable, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Injectable()
export class SankeyChartService {

  constructor() { }

  getFormat(): any {
    return d3.format(',.0f');
  }

  getColor(): any {
    return d3.scaleOrdinal(d3.schemeCategory20);
  }

  getMargin(): { top: number, right: number, bottom: number, left: number } {
    return { top: 10, right: 10, bottom: 10, left: 10 };
  }

  getWidth(chartContainerWidth: number, margin: { top: number, right: number, bottom: number, left: number }): number {
    let width = chartContainerWidth - margin.right - margin.left;
    return width;
  }

  getHeight(margin: { top: number, right: number, bottom: number, left: number }): number {
    return 600 - margin.top - margin.bottom;
  }

  getNodeWidth(width: number) {
    return width * 0.05;
  }

  getNodePadding(width: number) {
    return width * 0.005;
  }

  setD3Sankey() {
    d3.sankey = function () {
      var sankey = {},
        nodeWidth = 24,
        nodePadding = 8,
        size = [1, 1],
        nodes = [],
        links = [];

      // sankey.nodes = function (d) {
      //   if (!arguments.length) {
      //     return nodes;
      //   }
      //   nodes = d;
      //   return sankey;
      // }
    }
  }

  // removes all svg elements from given parent element
  clearSvg(ngChart: ElementRef): ElementRef {
    d3.select(ngChart.nativeElement).selectAll('svg').remove();
    return ngChart;
  }

  initSvg(ngChart: ElementRef, width: number, height: number, margin: { top: number, right: number, bottom: number, left: number }): d3.Selection<any> {
    return d3.select(ngChart.nativeElement).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  }

  initSankeyProperties(width: number, height: number, nodeWidth: number, nodePadding: number): d3.Selection<any> {
    return d3.sankey()
      .nodeWidth(nodeWidth)
      .nodePadding(nodePadding)
      .size([width, height]);
  }

  getPath(sankey: d3.Selection<any>): any {
    return sankey.link();
  }

  getLink(svg: d3.Selection<any>, sankeyData: SankeyData, path: any, format: any): d3.Selection<any> {
    let link = svg.append('g').selectAll('.link')
      .data(sankeyData.links)
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', path)
      .style('stroke-width', function (d) { return Math.max(1, d.dy); })
      .sort(function (a, b) { return b.dy - a.dy; });
    link.append('title')
      .text(function (d) {
        return d.source.name + " → " +
          d.target.name + '\n' + format(d.value);
      });
    return link;
  }

  getNode(svg: d3.Selection<any>, sankeyData: SankeyData, nodeWidth: number, width: number, color: any, format: any): d3.Selection<any> {
    let node = svg.append('g').selectAll('.node')
      .data(sankeyData.nodes)
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', function (d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      });

    node.append('rect')
      .attr('height', function (d) { return d.dy; })
      .attr('width', nodeWidth)
      .style('fill', function (d) {
        return d.color = color(d.name.replace(/ .*/, ''));
      })
      .style('stroke', function (d) {
        return d3.rgb(d.color).darker(2);
      })
      .append('title')
      .text(function (d) {
        return d.name + '\n' + format(d.value);
      });
    node.append('text')
      .attr('x', -6)
      .attr('y', function (d) { return d.dy / 2; })
      .attr('dy', '.35em')
      .attr('text-anchor', 'end')
      .attr('transform', null)
      .text(function (d) { return d.name; })
      .filter(function (d) { return d.x < width / 2; })
      .attr('x', 6 + nodeWidth)
      .attr('text-anchor', 'start');
  }
}

export interface SankeyNode {
  name: any
};

export interface SankeyLink {
  source: any,
  target: any,
  value: number
};

export interface SankeyData {
  nodes: Array<SankeyNode>,
  links: Array<SankeyLink>
};