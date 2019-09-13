import { Component, OnInit, Input, ViewChild, SimpleChanges, ElementRef } from '@angular/core';
import { SvgToPngService } from '../../../../shared/svg-to-png/svg-to-png.service';
import * as _ from 'lodash';
import * as d3 from 'd3';
@Component({
  selector: 'app-phast-pie-chart',
  templateUrl: './phast-pie-chart.component.html',
  styleUrls: ['./phast-pie-chart.component.css']
})
export class PhastPieChartComponent implements OnInit {
  @Input()
  graphColors: Array<string>;
  @Input()
  values: Array<number>;
  @Input()
  labels: Array<string>;
  @Input()
  chartContainerWidth: number;
  @Input()
  chartContainerHeight: number;
  @Input()
  printView: boolean;
  @Input()
  exportName: string;

  @ViewChild('ngChart', { static: false }) ngChart: ElementRef;
  @ViewChild('btnDownload', { static: false }) btnDownload: ElementRef;

  htmlElement: any;
  radius: number;
  host: d3.Selection<any>;
  svg: d3.Selection<any>;
  width: number;
  height: number;

  constructor(private svgToPngService: SvgToPngService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.values && changes.labels) {
      if (!changes.values.firstChange) {
        this.updatePie();
      }
    }
    if (changes.chartContainerWidth) {
      this.setupChart();
      this.buildPie();
    }
  }

  setupChart(): void {
    this.htmlElement = this.ngChart.nativeElement;
    this.host = d3.select(this.htmlElement);

    if (!this.printView) {
      if (!this.chartContainerHeight || this.chartContainerHeight <= 0) {
        this.chartContainerHeight = 300;
      }
      this.height = this.chartContainerHeight;
    }
    else {
      if (!this.chartContainerHeight || this.chartContainerHeight <= 0) {
        this.chartContainerHeight = 450;
      }
      this.height = 270;
      this.chartContainerWidth = 680;
    }
    this.width = this.chartContainerWidth;
    //set radius to limiting factor: height or width
    this.radius = Math.min(this.height, this.width) / 2;
  }

  buildPie(): void {
    this.host.html('');
    let width = this.width,
      height = this.height,
      radius = this.radius;
    let printView = this.printView;
    let svgWidth = this.chartContainerWidth;
    let svgHeight = this.chartContainerHeight;
    let color = d3.scaleOrdinal(this.graphColors);
    let pie = d3.pie().sort(null);
    let pieValues = this.values;
    let pieLabels = this.labels;
    let pieValuesData = pie(pieValues);
    let pieLabelsData = pie(pieLabels);
    let rightLabelIndexes = [];
    let leftLabelIndexes = [];
    let xBound;
    let fontSize;
    if (printView) {
      xBound = radius * (10 / 9);
      fontSize = "16px";
    }
    else {
      xBound = radius * (3 / 2);
      fontSize = "12px";
    }
    let yBound = height * (5 / 6);
    let leftLabelSpace, rightLabelSpace;
    let arc = d3.arc().innerRadius(0).outerRadius(radius);
    let outerArc = d3.arc().innerRadius(radius * 0.9).outerRadius(radius * 0.9);

    this.svg = this.host.append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .append("g")
      .attr("transform", "translate(" + svgWidth / 2 + "," + svgHeight / 2 + ")");

    let path = this.svg.selectAll("path.slice")
      .data(pieValuesData)
      .enter().append("path")
      .attr("class", "slice")
      .attr("fill", function (d, i) { return color(i); })
      .attr("stroke", "#fff")
      .attr("stroke-width", function (d) {
        if (d < 0) {
          return "0px";
        }
        if (printView) {
          return "1.5px";
        }
        else {
          return "1px";
        }
      });
    path.transition().duration(500)
      .attrTween("d", function (d) {
        this._current = this._current || d;
        let interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function (t) {
          return arc(interpolate(t));
        };
      });
    path.exit().remove();

    let text = this.svg.selectAll("text")
      .data(pieValuesData)
      .enter()
      .append("text")
      .attr('font-size', fontSize)
      .attr("x", function (d, i) {
        let a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
        d.cx = Math.cos(a) * (radius - 75);
        d.x = Math.cos(a) * (radius + 10);
        if (d.x >= 0) {
          if (pieValues[i] > 0) {
            rightLabelIndexes.push(i);
          }
          d.x = xBound;
          return d.x;
        }
        else if (d.x < 0) {
          if (pieValues[i] > 0) {
            leftLabelIndexes.push(i);
          }
          d.x = -xBound;
          return d.x;
        }
      });
    leftLabelSpace = yBound / leftLabelIndexes.length;
    rightLabelSpace = yBound / rightLabelIndexes.length;
    text.attr("y", function (d, i) {
      let a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
      d.cy = Math.sin(a) * (radius - 75);
      d.y = Math.sin(a) * (radius - 10);
      let left = false;
      let right = false;
      let marker = 0;
      for (let j = 0; j < leftLabelIndexes.length; j++) {
        if (i === leftLabelIndexes[j]) {
          right = false;
          left = true;
          marker = j;
        }
      }
      for (let j = 0; j < rightLabelIndexes.length; j++) {
        if (i === rightLabelIndexes[j]) {
          left = false;
          right = true;
          marker = j;
        }
      }
      if (right) {
        d.y = (-yBound / 2) + (rightLabelSpace * marker);
        return d.y;
      }
      else if (left) {
        d.y = (yBound / 2) - (leftLabelSpace * (marker + 1));
        return d.y;
      }
    })
      .text(function (d, i) {
        if (pieValues[i] > 0) {
          return pieLabels[i];
        }
      })
      .attr("text-anchor", function (d, i) {
        let right = false;
        let left = false;
        if (!printView) {
          return "middle";
        }
        else {
          for (let j = 0; j < leftLabelIndexes.length; j++) {
            if (i === leftLabelIndexes[j]) {
              right = false;
              left = true;
              return "end";
            }
          }
          if (!left) {
            for (let j = 0; j < rightLabelIndexes.length; j++) {
              if (i === rightLabelIndexes[j]) {
                left = false;
                right = true;
                return "start";
              }
            }
          }
          return "middle";
        }
      })
      .each(function (d) {
        let bbox = this.getBBox();
        d.sx = d.x - bbox.width / 2 - 2;
        d.ox = d.x + bbox.width / 2 + 2;
        d.sy = d.oy = d.y + 5;
      });

    this.svg.append("defs").append("marker")
      .attr("id", "circ")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("refX", 3)
      .attr("refY", 3)
      .append("circle")
      .attr("cx", 3)
      .attr("cy", 3)
      .attr("r", 3)
      .style('fill', '#333')
      .style('stroke', '#333');

    this.svg.selectAll("path.pointer")
      .data(pieValuesData)
      .enter()
      .append("path")
      .attr("class", "pointer")
      .style("fill", "none")
      .style("stroke", function (d, i) {
        if (pieValues[i] > 0) {
          return '#333';
        }
        else {
          return 'none';
        }
      })
      .attr("marker-end", "url(#circ)")
      .attr("d", function (d, i) {
        if (pieValues[i] > 0) {
          if (d.cx > d.ox) {
            return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
          } else {
            return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy;
          }
        }
        else {
          return '';
        }
      });
  }


  updatePie(): void {
    let width = this.width,
      height = this.height,
      radius = this.radius;
    let printView = this.printView;
    let svgWidth = this.chartContainerWidth;
    let svgHeight = this.chartContainerHeight;
    let color = d3.scaleOrdinal(this.graphColors);
    let pie = d3.pie().sort(null);
    let pieValues = this.values;
    let pieLabels = this.labels;
    let pieValuesData = pie(pieValues);
    let pieLabelsData = pie(pieLabels);
    let rightLabelIndexes = [];
    let leftLabelIndexes = [];
    let xBound;
    let fontSize;
    if (printView) {
      xBound = radius * (10 / 9);
      fontSize = "16px";
    }
    else {
      xBound = radius * (3 / 2);
      fontSize = "12px";
    }
    let yBound = height * (5 / 6);
    let leftLabelSpace, rightLabelSpace;
    let arc = d3.arc().innerRadius(0).outerRadius(radius);
    let outerArc = d3.arc().innerRadius(radius * 0.9).outerRadius(radius * 0.9);

    let path = this.svg.selectAll("path.slice")
      .data(pieValuesData);
    path.enter()
      .insert("path")
      .style("fill", function (d, i) {
        return color(i);
      })
      .attr("class", "slice");
    path.transition().duration(500)
      .attrTween("d", function (d) {
        this._current = this._current || d;
        let interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function (t) {
          return arc(interpolate(t));
        };
      });
    path.exit().remove();

    let text = this.svg.selectAll("text").remove();
    text = this.svg.selectAll("text")
      .data(pieValuesData)
      .enter()
      .append("text");
    text.style('opacity', 0).transition().duration(750).ease(d3.easeLinear).style('opacity', 1);
    text
      .attr('font-size', fontSize)
      .attr("x", function (d, i) {
        let a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
        d.cx = Math.cos(a) * (radius - 75);
        d.x = Math.cos(a) * (radius + 10);
        if (d.x >= 0) {
          if (pieValues[i] > 0) {
            rightLabelIndexes.push(i);
          }
          d.x = xBound;
          return d.x;
        }
        else if (d.x < 0) {
          if (pieValues[i] > 0) {
            leftLabelIndexes.push(i);
          }
          d.x = -xBound;
          return d.x;
        }
      });

    leftLabelSpace = yBound / leftLabelIndexes.length;
    rightLabelSpace = yBound / rightLabelIndexes.length;

    text.attr("y", function (d, i) {
      let a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
      d.cy = Math.sin(a) * (radius - 75);
      d.y = Math.sin(a) * (radius - 10);
      let left = false;
      let right = false;
      let marker = 0;
      for (let j = 0; j < leftLabelIndexes.length; j++) {
        if (i === leftLabelIndexes[j]) {
          right = false;
          left = true;
          marker = j;
        }
      }
      for (let j = 0; j < rightLabelIndexes.length; j++) {
        if (i === rightLabelIndexes[j]) {
          left = false;
          right = true;
          marker = j;
        }
      }
      if (right) {
        d.y = (-yBound / 2) + (rightLabelSpace * marker);
        return d.y;
      }
      else if (left) {
        d.y = (yBound / 2) - (leftLabelSpace * (marker + 1));
        return d.y;
      }
    })
      .text(function (d, i) {
        if (pieValues[i] > 0) {
          return pieLabels[i];
        }
      })
      .attr("text-anchor", function (d, i) {
        let right = false;
        let left = false;
        if (!printView) {
          return "middle";
        }
        else {
          for (let j = 0; j < leftLabelIndexes.length; j++) {
            if (i === leftLabelIndexes[j]) {
              right = false;
              left = true;
              return "end";
            }
          }
          if (!left) {
            for (let j = 0; j < rightLabelIndexes.length; j++) {
              if (i === rightLabelIndexes[j]) {
                left = false;
                right = true;
                return "start";
              }
            }
          }
          return "middle";
        }
      })
      .each(function (d) {
        let bbox = this.getBBox();
        d.sx = d.x - bbox.width / 2 - 2;
        d.ox = d.x + bbox.width / 2 + 2;
        d.sy = d.oy = d.y + 5;
      });

    this.svg.selectAll("defs").remove();
    this.svg.selectAll("path.pointer").remove();

    this.svg.append("defs").append("marker")
      .attr("id", "circ")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("refX", 3)
      .attr("refY", 3)
      .append("circle")
      .attr("cx", 3)
      .attr("cy", 3)
      .attr("r", 3)
      .style('fill', '#333')
      .style('stroke', '#333');

    let pointer = this.svg.selectAll("path.pointer")
      .data(pieValuesData)
      .enter()
      .append("path");
    pointer.style('opacity', 0).transition().duration(750).ease(d3.easeLinear).style('opacity', 1);
    pointer.attr("class", "pointer")
      .style("fill", "none")
      .style("stroke", function (d, i) {
        if (pieValues[i] > 0) {
          return '#333';
        }
        else {
          return 'none';
        }
      })
      .attr("marker-end", "url(#circ)")
      .attr("d", function (d, i) {
        if (pieValues[i] > 0) {
          if (d.cx > d.ox) {
            return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
          } else {
            return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy;
          }
        }
        else {
          return '';
        }
      });
  }

  downloadChart(): void {
    if (!this.exportName) {
      this.exportName = "phast-report-pie-chart";
    }
    else {
      this.exportName = this.exportName + '-pie-chart';
    }
    this.exportName = this.exportName.replace(/ /g, '-').toLowerCase();
    this.svgToPngService.exportPNG(this.ngChart, this.exportName);
  }
}
