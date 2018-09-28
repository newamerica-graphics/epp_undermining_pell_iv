import React from "react";
import BaseMap from "../../components/BaseMap";
import ChartContainer from "../../components/ChartContainer";
import { withTooltip, TooltipWithBounds } from "@vx/tooltip";
import { localPoint } from "@vx/event";
import { LegendLinear } from "@vx/legend";
import { scale } from "chroma-js";
import { min, max } from "d3-array";
import { format } from "d3-format";
import "./Choropleth.scss";

const Choropleth = props => {
  const {
    title,
    source,
    geometry,
    data,
    width,
    height,
    tooltipOpen,
    tooltipData,
    tooltipLeft,
    tooltipTop,
    showTooltip,
    hideTooltip
  } = props;

  const chromaScale = scale(["#afd4ff", "#233B64"])
    .domain([
      min(data, d => +d.average_net_price),
      max(data, d => +d.average_net_price)
    ])
    .mode("rgb");

  const fillFunc = id => {
    let price;
    data.forEach(d => {
      if (+d.id === id) {
        price = parseFloat(d.average_net_price);
      }
    });
    return chromaScale(price);
  };

  const mouseIn = (e, d) => {
    const coords = localPoint(e.target.ownerSVGElement, e);
    const stateData = data.filter(state => state.id == d.id)[0];
    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: stateData
    });
  };

  return (
    <ChartContainer title={title} source={source}>
      <div className="choropleth-container">
        <BaseMap
          geometry={geometry}
          height={height}
          width={1000}
          fillFunc={fillFunc}
          mouseIn={mouseIn}
          mouseOut={hideTooltip}
        />
        <LegendLinear
          shape="circle"
          scale={chromaScale}
          labelFormat={d => format("$,")(d)}
          domain={[6000, 8000, 10000, 12000, 14000]}
          className="choropleth-legend"
        />
      </div>
      {tooltipOpen && (
        <TooltipWithBounds
          key={
            Math.random() // set this to random so it correctly updates with parent bounds
          }
          top={tooltipTop}
          left={tooltipLeft + 10}
          style={{
            padding: "1rem",
            borderRadius: 0,
            boxShadow:
              "0 2px 5px 0 rgba(0, 0, 0, 0.15), 0 2px 10px 0 rgba(0, 0, 0, 0.1)"
          }}
        >
          <h4
            style={{ marginTop: 0, marginBottom: "0.5rem", fontSize: "1rem" }}
          >
            <strong>{tooltipData.state}</strong>
          </h4>
          <div style={{ color: "#2c2f35" }}>
            Average Net Price:{" "}
            <strong>
              {format("$,")(parseFloat(tooltipData.average_net_price))}
            </strong>
          </div>
        </TooltipWithBounds>
      )}
    </ChartContainer>
  );
};

export default withTooltip(Choropleth);
