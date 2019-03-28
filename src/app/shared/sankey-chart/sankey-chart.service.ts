import { Injectable, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { containerEnd, lifecycle } from '@angular/core/src/render3/instructions';
import { constants } from 'os';

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

  initSankeyProperties(width: number, height: number, nodeW: number, nodeP: number): d3.Selection<any> {

    d3.sankey = function () {
      var sankey: any = {};
      // var sankey = {

      //   nodes: null,
      //   links: null,
      //   layout: null
      // },
      var nodeWidth = 24;
      var nodePadding = 8;
      var size = [1, 1];
      var nodes = [];
      var links = [];
      var cycleLaneNarrowWidth = 4;
      var cycleLaneDistFromFwdPaths = -10;
      var cycleDistFromNode = 30;
      var cycleControlPointDist = 30;
      var cycleSmallWidthBuffer = 2;
      var cycleLinksCount = 0;

      sankey.nodeWidth = function (_) {
        if (!arguments.length) {
          return nodeWidth;
        }
        nodeWidth = +_;
        return sankey;
      };

      sankey.nodePadding = function (_) {
        if (!arguments.length) {
          return nodePadding;
        }
        nodePadding = +_;
        return sankey;
      };

      sankey.cycleLaneNarrowWidth = function (_) {
        if (!arguments.length) {
          return cycleLaneNarrowWidth;
        }
        cycleLaneNarrowWidth = +_;
        return sankey;
      }

      sankey.cycleSmallWidthBuffer = function (_) {
        if (!arguments.length) {
          return cycleSmallWidthBuffer;
        }
        cycleSmallWidthBuffer = +_;
        return sankey;
      }

      sankey.cycleLaneDistFromFwdPaths = function (_) {
        if (!arguments.length) {
          return cycleLaneDistFromFwdPaths;
        }
        cycleLaneDistFromFwdPaths = +_;
        return sankey;
      }

      sankey.cycleDistFromNode = function (_) {
        if (!arguments.length) {
          return cycleDistFromNode;
        }
        cycleDistFromNode = +_;
        return sankey;
      }

      sankey.cycleControlPointDist = function (_) {
        if (!arguments.length) {
          return cycleControlPointDist;
        }
        cycleControlPointDist = +_;
        return sankey;
      }

      sankey.cycleLinksCount = function (_) {
        if (!arguments.length) {
          return cycleLinksCount;
        }
        cycleLinksCount = +_;
        return sankey;
      }

      sankey.nodes = function (_) {
        if (!arguments.length) {
          return nodes;
        }
        nodes = _;
        return sankey;
      };

      sankey.links = function (_) {
        if (!arguments.length) {
          return links;
        }
        links = _;
        return sankey;
      };

      sankey.size = function (_) {
        if (!arguments.length) {
          return size;
        }
        size = _;
        return sankey;
      };

      sankey.layout = function (iterations) {
        console.log('layout; 0%');
        computeNodeLinks();
        console.log('16.67%');
        computeNodeValues();
        console.log('33.33%');
        markCycles();
        console.log('50%');
        computeNodeBreadths();
        console.log('66.67%');
        computeNodeDepths(iterations);
        console.log('83.33%');
        computeLinkDepths();
        console.log('sankey complete; 100%');
        return sankey;
      };

      sankey.relayout = function () {
        computeLinkDepths();
        return sankey;
      };

      // sankey.link = function () {
      //   console.log('sankey.link');
      //   var curvature = .5;

      //   function link(d) {
      //     console.log('called link(d), d = ');
      //     console.log(d);
      //     var xSource = d.source.x + d.source.dx,
      //       xTarget = d.target.x,
      //       xInterpolator = d3.interpolateNumber(xSource, xTarget),
      //       xSourceCurve = xInterpolator(curvature),
      //       xTargetCurve = xInterpolator(1 - curvature),
      //       ySource = d.source.y + d.sy + d.dy / 2,
      //       yTarget = d.target.y + d.ty + d.dy / 2;

      //     if (!d.cycleBreaker) {
      //       return 'M' + xSource + ',' + ySource
      //         + 'C' + xSourceCurve + ',' + ySource
      //         + ' ' + xTargetCurve + ',' + yTarget
      //         + ' ' + xTarget + ',' + yTarget;
      //     }
      //     else {
      //       xSourceCurve = xInterpolator(-0.5 * curvature);
      //       xTargetCurve = xInterpolator(1 + 0.5 * curvature);
      //       var xMiddle = xInterpolator(0.5);
      //       var yMiddle = d3.interpolateNumber(ySource, yTarget)(-.5);
      //       return 'M' + xSource + ',' + ySource
      //         + 'C' + xSourceCurve + ',' + ySource
      //         + ' ' + xSourceCurve + ',' + yMiddle
      //         + ' ' + xMiddle + ',' + yMiddle
      //         + 'S' + xTargetCurve + ',' + yTarget
      //         + ' ' + xTarget + ',' + yTarget;
      //     }
      //   }

      //   link.curvature = function (_) {
      //     if (!arguments.length) return curvature;
      //     curvature = +_;
      //     return link;
      //   };
      // }

      // this will puplate sourceLinks and targetLinks for each node
      function computeNodeLinks() {
        nodes.forEach(function (node) {
          node.sourceLinks = [];
          node.targetLinks = [];
        });
        links.forEach(function (link) {
          var source = link.source,
            target = link.target;
          if (typeof source === 'number') {
            source = link.source = nodes[link.source];
          }
          if (typeof target === 'number') {
            target = link.target = nodes[link.target];
          }
          source.sourceLinks.push(link);
          target.targetLinks.push(link);
        });
      }

      function computeNodeValues() {
        nodes.forEach(function (node) {
          node.value = Math.max(
            d3.sum(node.sourceLinks, value),
            d3.sum(node.targetLinks, value)
          );
        });
      }

      function computeNodeBreadths() {
        var remainingNodes = nodes,
          nextNodes,
          x = 0;

        while (remainingNodes.length) {
          nextNodes = [];
          remainingNodes.forEach(function (node) {
            node.x = x;
            node.dx = nodeWidth;
            node.sourceLinks.forEach(function (link) {
              if (!link.causesCycle) {
                nextNodes.push(link.target);
              }
            });
          });
          remainingNodes = nextNodes;
          ++x;
        }
        moveSinksRight(x);
        scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
      }

      function moveSourcesRight() {
        nodes.forEach(function (node) {
          if (!node.targetLinks.length) {
            node.x = d3.min(node.sourceLinks, function (d) { return d.target.x; }) - 1;
          }
        });
      }

      function moveSinksRight(x) {
        nodes.forEach(function (node) {
          if (!node.sourceLinks.length) {
            node.x = x - 1;
          }
        });
      }

      function scaleNodeBreadths(kx) {
        nodes.forEach(function (node) {
          node.x *= kx;
        });
      }

      function computeNodeDepths(iterations) {
        var nodesByBreadth = d3.nest()
          .key(function (d) { return d.x; })
          .sortKeys(d3.ascending)
          .entries(nodes)
          .map(function (d) { return d.values; });

        initializeNodeDepth();
        resolveCollisions();
        for (var alpha = 1; iterations > 0; --iterations) {
          relaxRightToLeft(alpha *= .99);
          resolveCollisions();
          relaxLeftToRight(alpha);
          resolveCollisions();
        }

        function initializeNodeDepth() {
          var ky = d3.min(nodesByBreadth, function (nodes) {
            return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value)
          });

          nodesByBreadth.forEach(function (nodes) {
            nodes.forEach(function (node, i) {
              node.y = i;
              node.dy = node.value * ky;
            });
          });

          links.forEach(function (link) {
            link.dy = link.value * ky;
          });
        }

        function relaxLeftToRight(alpha) {
          nodesByBreadth.forEach(function (nodes, breadth) {
            nodes.forEach(function (node) {
              if (node.targetLinks.length) {
                var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
                node.y += (y - center(node)) * alpha;
              }
            });
          });
          function weightedSource(link) {
            return center(link.source) * link.value;
          }
        }

        function relaxRightToLeft(alpha) {
          nodesByBreadth.slice().reverse().forEach(function (nodes) {
            nodes.forEach(function (node) {
              if (node.sourceLinks.length) {
                var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
                node.y += (y - center(node)) * alpha;
              }
            });
          });

          function weightedTarget(link) {
            return center(link.target) * link.value;
          }
        }

        function resolveCollisions() {
          nodesByBreadth.forEach(function (nodes) {
            var node,
              dy,
              y0 = 0,
              n = nodes.length,
              i;
            // push overlapping nodes down
            nodes.sort(ascendingDepth);
            for (i = 0; i < n; ++i) {
              node = nodes[i];
              dy = y0 - node.y;
              if (dy > 0) {
                node.y += dy;
              }
              y0 = node.y + node.dy + nodePadding;
            }

            // if bottommost node goes outside the bans, push it back up
            dy = y0 - nodePadding - size[1];
            if (dy > 0) {
              y0 = node.y -= dy;

              for (i = n - 2; i >= 0; --i) {
                node = nodes[i];
                dy = node.y + node.dy + nodePadding - y0;
                if (dy > 0) {
                  node.y -= dy;
                }
                y0 = node.y;
              }
            }
          });
        }

        function ascendingDepth(a, b) {
          return a.y - b.y;
        }
      }

      function computeLinkDepths() {
        nodes.forEach(function (node) {
          node.sourceLinks.sort(ascendingTargetDepth);
          node.targetLinks.sort(ascendingSourceDepth);
        });
        nodes.forEach(function (node) {
          var sy = 0, ty = 0;
          node.sourceLinks.forEach(function (link) {
            link.sy = sy;
            sy += link.dy;
          });
          node.targetLinks.forEach(function (link) {
            link.ty = ty;
            ty += link.dy;
          });
        });

        function ascendingSourceDepth(a, b) {
          return a.source.y - b.source.y;
        }

        function ascendingTargetDepth(a, b) {
          return a.target.y - b.target.y;
        }
      }

      function center(node) {
        return node.y + node.dy / 2;
      }

      function value(link) {
        return link.value;
      }

      function markCycles() {
        // find the 'feedback arc set' and remove them;
        // this way is expensive, but should be fine for small number of links
        var cycleMakers = [];
        var addedLinks = new Array();
        links.forEach(function (link) {
          if (createsCycle(link.source, link.target, addedLinks)) {
            link.causesCycle = true;
            link.cycleIndex = cycleMakers.length;
            cycleMakers.push(link);
            cycleLinksCount = cycleMakers.length;
          }
          else {
            addedLinks.push(link);
          }
        });
      }

      function createsCycle(originalSource, nodeToCheck, graph) {
        if (graph.length == 0) {
          return false;
        }
        var nextLinks = findLinksOutward(nodeToCheck, graph);
        // leaf node check
        if (nextLinks.length == 0) {
          return false;
        }
        // cycle check
        for (var i = 0; i < nextLinks.length; i++) {
          var nextLink = nextLinks[i];

          if (nextLink.target === originalSource) {
            return true;
          }
          // recurse
          if (createsCycle(originalSource, nextLink.target, graph)) {
            return true;
          }
        }
        // exhausted all links
        return false;
      }

      function findLinksOutward(node, graph) {
        var children = [];
        for (var i = 0; i < graph.length; i++) {
          if (node == graph[i].source) {
            children.push(graph[i]);
          }
        }
        return children;
      }
      return sankey;
    };

    let tmpSankey = d3.sankey()
      .nodeWidth(36)
      .nodePadding(40)
      .size([width, height]);
    // let tmpPath = d3.sankey().link();
    console.log('tmpSankey = ');
    console.log(tmpSankey);
    // console.log('sankey = ');
    // console.log(sankey);
    return tmpSankey;
  }

  // removes all svg elements from given parent element
  clearSvg(ngChart: ElementRef): ElementRef {
    d3.select(ngChart.nativeElement).selectAll('svg').remove();
    return ngChart;
  }

  initSvg(ngChart: ElementRef, width: number, height: number, margin: { top: number, right: number, bottom: number, left: number }): d3.Selection<any> {
    return d3.select(ngChart.nativeElement).append('svg')
      .attr('preserveAspectRatio', 'xMinYMid meet')
      .attr('width', width)
      .attr('height', height)
      // .style('margin', margin.top + 'px ' + margin.right + 'px ' + margin.bottom + 'px ' + margin.left + 'px')
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  }

  addViewBox(svg: d3.Selection<any>, sankey: d3.Selection<any>, width: number, height: number) {

    let cycleTopMarginSize = (sankey.cycleLaneDistFromFwdPaths() - ((sankey.cycleLaneNarrowWidth() + sankey.cycleSmallWidthBuffer()) * sankey.cycleLinksCount()))
    let horizontalMarginSize = (sankey.cycleDistFromNode() + sankey.cycleControlPointDist());
    console.log('cycleTopMarginSize = ' + cycleTopMarginSize);
    console.log('horizontalMarginSize = ' + horizontalMarginSize);
    svg.attr('viewBox',
      '' + (0 - horizontalMarginSize) + ' '
      + cycleTopMarginSize + ' '
      + (width + horizontalMarginSize * 2) + ' '
      + (height + (-1 * cycleTopMarginSize)) + ' ');
  }

  // initSankeyProperties(width: number, height: number, nodeWidth: number, nodePadding: number): d3.Selection<any> {
  //   this.setD3Sankey();
  //   let sankey = d3.sankey()
  //     .nodeWidth(nodeWidth)
  //     .nodePadding(nodePadding)
  //     .size([width, height]);
  //   return sankey;
  // }

  // getPath(sankey: d3.Selection<any>): any {
  //   return sankey.link();
  // }

  // getLink(svg: d3.Selection<any>, sankeyData: SankeyData, format: any, line: any, path: any): d3.Selection<any> {
  getLink(svg: d3.Selection<any>, sankeyData: SankeyData, format: any, path: any): d3.Selection<any> {

    console.log('getLink, path = ');
    console.log(path);
    // cycle features
    // cycleLaneNarrowWidth = 4,
    // cycleLaneDistFromFwdPaths = -10,  // the distance above the paths to start showing 'cycle lanes'
    // cycleDistFromNode = 30,      // linear path distance before arcing from node
    //   cycleControlPointDist = 30,  // controls the significance of the cycle's arc
    // cycleSmallWidthBuffer = 2

    let link = svg.append('g').selectAll('.link')
      .data(sankeyData.links)
      .enter().append('path')
      .attr('d', function (d) {
        console.log('d = ');
        console.log(d);
        var curvature = .5;
        var cycleLaneNarrowWidth = 4;
        var cycleLaneDistFromFwdPaths = -10;
        var cycleDistFromNode = 30;
        var cycleControlPointDist = 30;
        var cycleSmallWidthBuffer = 2;
        if (d.causesCycle) {
          //cycle node, reaches backwards

          let smallWidth = cycleLaneNarrowWidth,
            s_x = d.source.x + d.source.dx,
            s_y = d.source.y + d.sy + d.dy,
            t_x = d.target.x,
            t_y = d.target.y,
            se_x = s_x + cycleDistFromNode,
            se_y = s_y,
            ne_x = se_x,
            ne_y = cycleLaneDistFromFwdPaths - (d.cycleIndex * (smallWidth + cycleSmallWidthBuffer)),
            nw_x = t_x - cycleDistFromNode,
            nw_y = ne_y,
            sw_x = nw_x,
            sw_y = t_y + d.ty + d.dy;

          // start the path on the outer path boundary
          return "M" + s_x + "," + s_y
            + "L" + se_x + "," + se_y
            + "C" + (se_x + cycleControlPointDist) + "," + se_y + " " + (ne_x + cycleControlPointDist) + "," + ne_y + " " + ne_x + "," + ne_y
            + "H" + nw_x
            + "C" + (nw_x - cycleControlPointDist) + "," + nw_y + " " + (sw_x - cycleControlPointDist) + "," + sw_y + " " + sw_x + "," + sw_y
            + "H" + t_x
            //moving to inner path boundary
            + "V" + (t_y + d.ty)
            + "H" + sw_x
            + "C" + (sw_x - (cycleControlPointDist / 2) + smallWidth) + "," + t_y + " " +
            (nw_x - (cycleControlPointDist / 2) + smallWidth) + "," + (nw_y + smallWidth) + " " +
            nw_x + "," + (nw_y + smallWidth)
            + "H" + (ne_x - smallWidth)
            + "C" + (ne_x + (cycleControlPointDist / 2) - smallWidth) + "," + (ne_y + smallWidth) + " " +
            (se_x + (cycleControlPointDist / 2) - smallWidth) + "," + (se_y - d.dy) + " " +
            se_x + "," + (se_y - d.dy)
            + "L" + s_x + "," + (s_y - d.dy);


        }
        else {
          // regular forward node
          var x0 = d.source.x + d.source.dx,
            x1 = d.target.x,
            xi = d3.interpolateNumber(x0, x1),
            x2 = xi(curvature),
            x3 = xi(1 - curvature),
            y0 = d.source.y + d.sy + d.dy / 2,
            y1 = d.target.y + d.ty + d.dy / 2;
          return "M" + x0 + "," + y0
            + "C" + x2 + "," + y0
            + " " + x3 + "," + y1
            + " " + x1 + "," + y1;
        }
      })
      .attr('class', 'link')
      .style('stroke', 'blue')
      .style('fill', function (d) {
        if (d.causesCycle) {
          return 'red';
        }
        else {
          return '';
        }
      })
      .style('opacity', 0.2)
      // .style('stroke-width', function (d) { return Math.max(1, d.dy); })
      .on('mouseover', function (d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 0.5);
      })
      .on('mouseout', function (d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 0.2);
      })
      .sort(function (a, b) { return b.dy - a.dy; });
    link.filter(function (d) { return !d.causesCycle })
      .style('stroke-width', function (d) { return Math.max(1, d.dy); })
    link.append('title')
      .text(function (d) {
        return d.source.name + ' → ' +
          d.target.name + '\n' + format(d.value);
      });
    return link;
  }

  getNode(svg: d3.Selection<any>, sankeyData: SankeyData, nodeWidth: number, width: number, height: number, color: any, format: any): d3.Selection<any> {

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
    return node;
  }
}

export interface SankeyNode {
  node: any,
  name: any
};

export interface SankeyLink {
  source: any,
  target: any,
  value: number
  // causesCycle: boolean
};

export interface SankeyData {
  nodes: Array<SankeyNode>,
  links: Array<SankeyLink>
};