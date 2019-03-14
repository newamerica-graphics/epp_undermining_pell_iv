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
import { format } from "d3-format";
import { max, median } from "d3-array";
import { scaleLinear } from "d3-scale";
import { localPoint } from "@vx/event";
import { forceSimulation, forceX, forceY, forceCollide } from "d3-force";
import debounce from "debounce";
import "./Swarm.scss";

class Swarm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hoverActive: false, hoveredItem: "" };
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
        price2015: parseFloat(d["price2015"]),
        price2010: parseFloat(d["price2010"]),
        id: d.id
      };
    });
    this.data2010 = this.props.data.map((d, i) => {
      return {
        school: d.school,
        state: d.state,
        price2015: parseFloat(d["price2015"]),
        price2010: parseFloat(d["price2010"]),
        id: d.id
      };
    });
    this.hoverTimeout = null;
    this.debouncedMouseOver = debounce(this.handleMouseOver.bind(this), 300);
    this.debouncedMouseOut = debounce(this.mouseOut.bind(this), 300);
  }

  handleMouseOver = (event, datum) => {
    this.setState({ hoverActive: true, hoveredItem: datum.id });
    const coords = localPoint(event.target.ownerSVGElement, event);
    this.props.showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: datum
    });
  };

  mouseOut = () => {
    this.setState({ hoverActive: false });
    this.props.hideTooltip();
  };

  runSimulation = memoizeOne((xMax, height) => {
    this.x = scaleLinear()
      .rangeRound([this.margin.left, xMax])
      .domain([0, max(this.data2015, d => d.price2015)]);
    const sim1 = forceSimulation(this.data2015)
      .force("x", forceX(d => this.x(d.price2015)).strength(1))
      .force("y", forceY(height / 4))
      .force("collide", forceCollide(7))
      .stop();
    const sim2 = forceSimulation(this.data2010)
      .force("x", forceX(d => this.x(d.price2010)).strength(1))
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
    const { hoverActive, hoveredItem } = this.state;
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
                  fill={search.hasOwnProperty(d.id) ? "#FF2D44" : "#22C8A3"}
                  stroke={
                    hoverActive && hoveredItem === d.id
                      ? "#333"
                      : !hoverActive && search.hasOwnProperty(d.id)
                        ? "#333"
                        : "rgba(51,51,51,0.6)"
                  }
                  strokeWidth={
                    hoverActive && hoveredItem === d.id
                      ? 2
                      : !hoverActive && search.hasOwnProperty(d.id)
                        ? 2
                        : 1
                  }
                  opacity={
                    hoverActive && hoveredItem === d.id
                      ? 1
                      : !hoverActive && search.hasOwnProperty(d.id)
                        ? 1
                        : !hoverActive && Object.keys(search).length === 0
                          ? 1
                          : 0.3
                  }
                  className={`id-${d.id}`}
                  onMouseEnter={e => {
                    e.persist();
                    this.debouncedMouseOver(e, d);
                  }}
                  onMouseOut={e => {
                    this.setState({ hoverActive: false });
                    this.props.hideTooltip();
                    this.debouncedMouseOut();
                  }}
                />
              );
            })}
            <Marker
              from={
                new Point({
                  x: this.x(median(this.data2015, d => d.price2015)),
                  y: this.margin.top
                })
              }
              to={
                new Point({
                  x: this.x(median(this.data2015, d => d.price2015)),
                  y: 300
                })
              }
              stroke={"#2C2F35"}
              label={`Median Price: ${format("$,.0f")(
                median(this.data2015, d => d.price2015)
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
                  fill={search.hasOwnProperty(d.id) ? "#FF2D44" : "#22C8A3"}
                  strokeWidth={
                    hoverActive && hoveredItem === d.id
                      ? 2
                      : !hoverActive && search.hasOwnProperty(d.id)
                        ? 2
                        : 1
                  }
                  opacity={
                    hoverActive && hoveredItem === d.id
                      ? 1
                      : !hoverActive && search.hasOwnProperty(d.id)
                        ? 1
                        : !hoverActive && Object.keys(search).length === 0
                          ? 1
                          : 0.3
                  }
                  className={`id-${d.id}`}
                  stroke={
                    hoverActive && hoveredItem === d.id
                      ? "#333"
                      : !hoverActive && search.hasOwnProperty(d.id)
                        ? "#333"
                        : "rgba(51,51,51,0.6)"
                  }
                  onMouseEnter={e => {
                    e.persist();
                    this.debouncedMouseOver(e, d);
                  }}
                  onMouseOut={e => {
                    this.setState({ hoverActive: false });
                    this.props.hideTooltip();
                    this.debouncedMouseOut();
                  }}
                />
              );
            })}
            <Marker
              from={
                new Point({
                  x: this.x(median(this.data2010, d => d.price2010)),
                  y: 400
                })
              }
              to={
                new Point({
                  x: this.x(median(this.data2010, d => d.price2010)),
                  y: 650
                })
              }
              stroke={"#2C2F35"}
              label={`Median Price: ${format("$,.0f")(
                median(this.data2010, d => d.price2010)
              )} *`}
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
            style={{
              padding: "1rem",
              borderRadius: 0,
              boxShadow:
                "0 2px 5px 0 rgba(0, 0, 0, 0.15), 0 2px 10px 0 rgba(0, 0, 0, 0.1)",
              color: "#333333"
            }}
          >
            <h4
              style={{
                marginTop: 0,
                marginBottom: "0.5rem",
                fontSize: "1rem"
              }}
            >
              {this.props.tooltipData.school}
            </h4>
            <div style={{ paddingBottom: "0.5rem", fontSize: "14px" }}>
              <strong>State: </strong> {this.props.tooltipData.state}
            </div>
            <div style={{ paddingBottom: "0.5rem", fontSize: "14px" }}>
              <strong>Net Price (2015-2016): </strong>{" "}
              {format("$,.0f")(this.props.tooltipData.price2015)}
            </div>
            <div style={{ paddingBottom: "0.5rem", fontSize: "14px" }}>
              <strong>Net Price (2010-2011): </strong>{" "}
              {format("$,.0f")(this.props.tooltipData.price2010)}
            </div>
          </TooltipWithBounds>
        )}
      </React.Fragment>
    );
  }
}

export default withTooltip(Swarm);
