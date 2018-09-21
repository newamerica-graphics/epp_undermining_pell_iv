import React from "react";
import { GlyphDot } from "@vx/glyph";
import { Group } from "@vx/group";
import { AxisBottom } from "@vx/axis";
import { withTooltip, TooltipWithBounds } from "@vx/tooltip";
import { GridColumns } from "@vx/grid";
import { Text } from "@vx/text";
import { Marker } from "@vx/marker";
import { Point } from "@vx/point";
import memoizeOne from "memoize-one";
import { selectAll } from "d3-selection";
import { format } from "d3-format";
import { max, median } from "d3-array";
import { scaleLinear } from "d3-scale";
import { forceSimulation, forceX, forceY, forceCollide } from "d3-force";

class Swarm extends React.Component {
  constructor(props) {
    super(props);
    this.margin = {
      top: 40,
      left: 50,
      right: 40,
      bottom: 20
    };
    this.data2015 = this.props.data.map((d, i) => {
      return {
        school: d.school,
        state: d.state,
        price: parseFloat(d["price2015"]),
        id: d.id
      };
    });
    this.data2010 = this.props.data.map((d, i) => {
      return {
        school: d.school,
        state: d.state,
        price: parseFloat(d["price2010"]),
        id: d.id
      };
    });
    this.hoverTimeout = null;
  }

  runSimulation = memoizeOne((xMax, height) => {
    this.x = scaleLinear()
      .rangeRound([this.margin.left, xMax])
      .domain([0, max(this.data2015, d => d.price)]);
    const sim1 = forceSimulation(this.data2015)
      .force("x", forceX(d => this.x(d.price)).strength(1))
      .force("y", forceY(height / 4))
      .force("collide", forceCollide(7))
      .stop();
    const sim2 = forceSimulation(this.data2010)
      .force("x", forceX(d => this.x(d.price)).strength(1))
      .force("y", forceY((3 * height) / 4))
      .force("collide", forceCollide(7))
      .stop();
    for (var i = 0; i < 160; ++i) {
      sim1.tick();
      sim2.tick();
    }
    return { sim1, sim2 };
  });

  render() {
    const { width, height, search } = this.props;
    const xMax = this.props.width - this.margin.left - this.margin.right;
    const yMax = this.props.height - this.margin.top - this.margin.bottom;

    const simulation = this.runSimulation(xMax, height);

    return (
      <React.Fragment>
        <svg width={width} height={height}>
          <GridColumns
            top={0}
            left={this.margin.left}
            scale={this.x}
            height={yMax}
            numTicks={4}
            strokeDasharray={8}
            stroke="#CBCBCD"
          />
          <Text
            verticalAnchor="middle"
            x={0}
            y={height / 4}
            width={this.margin.left}
          >
            2015-2016
          </Text>
          <Group top={0} left={this.margin.left}>
            {this.data2015.map((d, i) => {
              return (
                <GlyphDot
                  r={5}
                  cx={d.x}
                  cy={d.y}
                  fill={search.hasOwnProperty(d.id) ? "#A64046" : "#62CDC6"}
                  opacity={
                    search.hasOwnProperty(d.id) ||
                    Object.keys(search).length === 0
                      ? 1
                      : 0.4
                  }
                  className={`id-${d.id}`}
                  onMouseEnter={e => {
                    {
                      /* this.hoverTimeout = setTimeout(() => {
                      selectAll(`circle`).style("opacity", 0.2);
                      selectAll(`.id-${d.id}`).style("opacity", 1);
                    }, 200); */
                    }
                    selectAll(`.id-${d.id}`)
                      .attr("stroke", "#111")
                      .attr("stroke-width", 2);
                    this.props.showTooltip({
                      tooltipLeft: d.x,
                      tooltipTop: d.y,
                      tooltipData: d
                    });
                  }}
                  onMouseLeave={e => {
                    {
                      /* clearTimeout(this.hoverTimeout);
                    selectAll(`circle`).style("opacity", 1); */
                    }
                    selectAll(`.id-${d.id}`)
                      .attr("stroke", "none")
                      .attr("stroke-width", 0);
                    this.props.hideTooltip();
                  }}
                />
              );
            })}
            <Marker
              from={
                new Point({
                  x: this.x(median(this.data2015, d => d.price)),
                  y: this.margin.top
                })
              }
              to={
                new Point({
                  x: this.x(median(this.data2015, d => d.price)),
                  y: 300
                })
              }
              stroke={"#2C2F35"}
              label={`Median Price: ${format("$,")(
                median(this.data2015, d => d.price)
              )}`}
              labelStroke={"none"}
              labelDx={6}
              labelDy={0}
              labelFontSize={14}
            />
          </Group>
          <Text
            verticalAnchor="middle"
            x={0}
            y={(3 * height) / 4 - 50}
            width={this.margin.left}
          >
            2010-2011
          </Text>
          <Group top={-50} left={this.margin.left}>
            {this.data2010.map((d, i) => {
              return (
                <GlyphDot
                  r={5}
                  cx={d.x}
                  cy={d.y}
                  fill={search.hasOwnProperty(d.id) ? "#A64046" : "#62CDC6"}
                  opacity={
                    search.hasOwnProperty(d.id) ||
                    Object.keys(search).length === 0
                      ? 1
                      : 0.4
                  }
                  className={`id-${d.id}`}
                  onMouseEnter={e => {
                    selectAll(`.id-${d.id}`)
                      .attr("stroke", "#111")
                      .attr("stroke-width", 1);
                    this.props.showTooltip({
                      tooltipLeft: d.x,
                      tooltipTop: d.y,
                      tooltipData: d
                    });
                  }}
                  onMouseLeave={e => {
                    selectAll(`.id-${d.id}`)
                      .attr("stroke", "none")
                      .attr("stroke-width", 0);
                    this.props.hideTooltip();
                  }}
                />
              );
            })}
            <Marker
              from={
                new Point({
                  x: this.x(median(this.data2010, d => d.price)),
                  y: 400
                })
              }
              to={
                new Point({
                  x: this.x(median(this.data2010, d => d.price)),
                  y: 650
                })
              }
              stroke={"#2C2F35"}
              label={`Median Price: ${format("$,")(
                median(this.data2010, d => d.price)
              )}`}
              labelStroke={"none"}
              labelDx={6}
              labelDy={0}
              labelFontSize={14}
            />
          </Group>
          <AxisBottom
            scale={this.x}
            top={yMax}
            left={this.margin.left}
            numTicks={4}
            stroke="#333333"
            tickStroke="#333333"
            tickFormat={value => format("$,")(value)}
            tickLabelProps={(value, index) => ({
              fill: "#333333",
              fontSize: 12,
              textAnchor: "middle"
            })}
          />
        </svg>
        {this.props.tooltipOpen && (
          <TooltipWithBounds
            left={this.props.tooltipLeft}
            top={this.props.tooltipTop}
            style={{ padding: "15px" }}
          >
            <div style={{ paddingBottom: "0.25rem", fontSize: "14px" }}>
              <strong>School: </strong>
              {this.props.tooltipData.school}
            </div>
            <div style={{ paddingBottom: "0.25rem", fontSize: "14px" }}>
              <strong>State: </strong> {this.props.tooltipData.state}
            </div>
            <div style={{ paddingBottom: "0.25rem", fontSize: "14px" }}>
              <strong>Net Price: </strong>{" "}
              {format("$,")(this.props.tooltipData.price)}
            </div>
          </TooltipWithBounds>
        )}
      </React.Fragment>
    );
  }
}

export default withTooltip(Swarm);
