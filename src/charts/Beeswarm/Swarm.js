import React from "react";
import { GlyphDot } from "@vx/glyph";
import { Group } from "@vx/group";
import { AxisBottom } from "@vx/axis";
import { withTooltip, TooltipWithBounds } from "@vx/tooltip";
import * as d3 from "d3";

export default class Swarm extends React.Component {
  constructor(props) {
    super(props);
    this.margin = {
      top: 40,
      left: 40,
      right: 40,
      bottom: 40
    };
    this.data2015 = this.props.data.map((d, i) => {
      return {
        school: d.school,
        state: d.state,
        price: parseFloat(d["net_price_2015_2016"]),
        key: i
      };
    });
    this.data2010 = this.props.data.map((d, i) => {
      return {
        school: d.school,
        state: d.state,
        price: parseFloat(d["net_price_2010_2011"]),
        key: i
      };
    });
    this.runSimulation();
  }

  shouldComponentUpdate(nextProps) {
    const newWidth = this.props.width !== nextProps.width;
    return newWidth;
  }

  componentDidUpdate(prevProps) {
    if (this.props.width !== prevProps.width) this.runSimulation();
  }

  runSimulation() {
    this.xMax = this.props.width - this.margin.left - this.margin.right;
    this.yMax = this.props.height - this.margin.top - this.margin.bottom;
    this.x = d3
      .scaleLinear()
      .rangeRound([this.margin.left, this.xMax])
      .domain([0, d3.max(this.data2015, d => d.price)]);

    const simulation = data => {
      const sim = d3
        .forceSimulation(data)
        .force("x", d3.forceX(d => this.x(d.price)).strength(1))
        .force("y", d3.forceY(0))
        .force("collide", d3.forceCollide(6))
        .stop();
      for (var i = 0; i < 150; ++i) sim.tick();
    };

    simulation(this.data2015);
    simulation(this.data2010);
    console.log("running sim", this.props.width);
  }

  render() {
    const { width, height, search } = this.props;
    console.log(width, height);
    return (
      <svg width={width} height={height}>
        <Group top={150}>
          {this.data2015.map((d, i) => {
            return (
              <GlyphDot
                r={4}
                cx={d.x}
                cy={d.y}
                fill={
                  d.school.toLowerCase().includes(search.toLowerCase()) &&
                  search.length > 0
                    ? "#bada55"
                    : "#d4d4d4"
                }
              />
            );
          })}
        </Group>
        <Group top={height - 200}>
          {this.data2010.map((d, i) => {
            return (
              <GlyphDot
                r={4}
                cx={d.x}
                cy={d.y}
                fill={
                  d.school.toLowerCase().includes(search.toLowerCase())
                    ? "red"
                    : "#d4d4d4"
                }
              />
            );
          })}
        </Group>
        <AxisBottom
          scale={this.x}
          top={this.yMax}
          left={0}
          label="Bottom axis label"
          numTicks={4}
          stroke="#333333"
          tickStroke="#333333"
          tickLabelProps={(value, index) => ({
            fill: "#333333",
            fontSize: 12,
            textAnchor: "middle"
          })}
        />
      </svg>
    );
  }
}
