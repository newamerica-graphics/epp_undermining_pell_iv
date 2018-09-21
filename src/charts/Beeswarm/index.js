import React from "react";
import { ParentSize } from "@vx/responsive";
import Swarm from "./Swarm.js";
import Select from "react-select";
import "../../components/ChartContainer/ChartContainer.scss";

class Beeswarm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { search: "" };
  }
  updateSearch = selectedOption => {
    const search = {};
    selectedOption.forEach(option => {
      search[option.value] = option;
    });
    this.setState({ search });
    console.log(`Option selected:`, selectedOption);
  };

  render() {
    const { title, source, height } = this.props;
    return (
      <div className="chart">
        <div className="chart__meta-container">
          <h3 className="chart__title">{title}</h3>
        </div>
        <Select
          isMulti
          name="schools"
          options={this.props.data.map(d => {
            return { label: d.school, value: d.id };
          })}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={this.updateSearch}
          ref={el => {
            this.selectRef = el;
          }}
        />
        <div
          className="chart__figure"
          style={{
            height: height,
            maxWidth: "1200px",
            margin: "auto"
          }}
        >
          <ParentSize>
            {({ width, height }) =>
              width === 0 ? null : (
                <Swarm
                  width={width}
                  height={width < 400 ? 1000 : height}
                  data={this.props.data}
                  search={this.state.search}
                />
              )
            }
          </ParentSize>
        </div>
        <div className="chart__meta-container">
          <span className="chart__source">Source: {source}</span>
        </div>
      </div>
    );
  }
}

export default Beeswarm;
