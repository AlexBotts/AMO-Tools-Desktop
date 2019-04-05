import { Component, OnInit, Input, ElementRef, SimpleChange, ViewChild, HostListener } from '@angular/core';
import { SvgToPngService } from '../svg-to-png/svg-to-png.service';
import * as d3 from 'd3';
import * as c3 from 'c3';

@Component({
  selector: 'app-percent-graph',
  templateUrl: './percent-graph.component.html',
  styleUrls: ['./percent-graph.component.css']
})
export class PercentGraphComponent implements OnInit {
  @Input()
  value: number;
  @Input()
  title: string;
  @Input()
  valueDescription: string;
  @Input()
  titlePlacement: string;
  @Input()
  fontStyle: string;
  @Input()
  fontSize: number;
  @Input()
  unit: string;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.initChart();
  }



  doughnutChartLabels: string[];
  doughnutChartData: number[];
  doughnutChartType: string = 'doughnut';
  chartOptions: any;
  chartColors: Array<any> = [{}];
  chartColorDataSet: Array<any>;
  chart: any;
  chartHeight: number;

  firstChange: boolean = true;
  //inChart: boolean = false;
  exportName: string;

  potential: number = 0;

  @ViewChild('ngChart') ngChart: ElementRef;
  // @ViewChild('btnDownload') btnDownload: ElementRef;

  //booleans for tooltip
  hoverBtnExport: boolean = false;
  displayExportTooltip: boolean = false;
  hoverBtnGridLines: boolean = false;
  displayGridLinesTooltip: boolean = false;

  constructor(private svgToPngService: SvgToPngService) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.initChart();
  }

  ngOnDestroy() {

  }

  ngOnChanges() {
    if (this.firstChange) {
      this.firstChange = !this.firstChange;
    }
    else {
      this.updateChart();
    }
  }

  updateChart() {
    if (this.chart) {
      this.chart.load({
        columns: [
          ['data', this.value],
        ]
      });
      // d3.select(this.ngChart.nativeElement).selectAll(".c3-chart-arcs-title").node().innerHTML = this.value.toFixed(0) + "%";
      //d3.selectAll('.c3-chart-arcs-title').style("padding-bottom", "20px").style("font-size", "26px");
      // d3.selectAll(".c3-gauge-value").style("display", "none");
    }
    else {
      this.initChart();
    }
  }

  initChart() {
    this.chart = c3.generate({
      bindto: this.ngChart.nativeElement,
      data: {
        columns: [
          ['data', 0]
        ],
        type: 'gauge',
      },
      legend: {
        show: false
      },
      // size: {
      //   height: this.chartHeight,
      //   width: this.chartWidth
      // },
      gauge: {
        label: {
          show: false
        }
      },
      color: {
        pattern: ['#52489C', '#3498DB', '#6DAFA9', '#60B044', '#FF0000'], // the three color levels for the percentage values.
        threshold: {
          values: [25, 50, 75, 101]
        }
      },
      tooltip: {
        show: false
      }
    });
     let guage = d3.selectAll(".c3-gauge-value").style("font-size", "18px");
    // d3.selectAll(".c3-axis.c3-axis-x .tick text").style("display", "none");
    d3.selectAll(".c3-chart-arcs-background").style("fill", "#FFF");
    // d3.selectAll(".c3-chart-arcs-background").style("stroke", "#b8b8b8").style("stroke-width", "0.5px");

    if (this.value && this.chart) {
      this.updateChart();
    }
  }
}
