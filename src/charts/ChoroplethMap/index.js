import React from "react";
import BaseMap from "../../components/BaseMap";
import ChartContainer from "../../components/ChartContainer";
import { withTooltip, TooltipWithBounds } from "@vx/tooltip";
import { LegendLinear } from "@vx/legend";
import { scale } from "chroma-js";
import { min, max } from "d3-array";
import { format } from "d3-format";

const Choropleth = props => {
  const { title, source, geometry, data, width, height } = props;

  const chromaScale = scale(["#ADD2ED", "#1B384E"])
    .domain([
      min(data, d => +d.average_net_price),
      max(data, d => +d.average_net_price)
    ])
    .mode("lab");

  console.log([
    min(data, d => +d.average_net_price),
    max(data, d => +d.average_net_price)
  ]);
  const fillFunc = id => {
    let price;
    data.forEach(d => {
      if (+d.id === id) {
        price = parseFloat(d.average_net_price);
      }
    });
    return chromaScale(price);
  };

  return (
    <ChartContainer title={title} source={source}>
      <div style={{ display: "flex" }}>
        <BaseMap
          geometry={geometry}
          height={height}
          width={1200}
          fillFunc={fillFunc}
        />
        <LegendLinear
          shape="circle"
          scale={chromaScale}
          labelFormat={d => format("$,")(d)}
          style={{ padding: "0.5rem", paddingTop: "1rem", flexShrink: "0" }}
        />
      </div>
    </ChartContainer>
  );
};

export default withTooltip(Choropleth);
