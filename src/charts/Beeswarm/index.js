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
  };

  render() {
    const { title, source, height } = this.props;
    const selectStyles = {
      control: (styles, state) => ({
        ...styles,
        backgroundColor: "white",
        borderRadius: 0
      }),
      menu: styles => ({
        ...styles,
        borderRadius: 0,
        boxShadow:
          "0 2px 5px 0 rgba(0, 0, 0, 0.15), 0 2px 10px 0 rgba(0, 0, 0, 0.1)"
      })
    };
    return (
      <div className="chart">
        <div className="chart__meta-container">
          <h3 className="chart__title">{title}</h3>
        </div>
        <Select
          isMulti
          name="schools"
          placeholder="Highlight a school..."
          options={this.props.data.map(d => {
            return { label: d.school, value: d.id };
          })}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={this.updateSearch}
          ref={el => {
            this.selectRef = el;
          }}
          styles={selectStyles}
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
                  height={height}
                  data={this.props.data}
                  search={this.state.search}
                />
              )
            }
          </ParentSize>
        </div>
        <div className="chart__meta-container">
          <div className="chart__source">
            <div style={{ lineHeight: "1.3" }}>
              * Data from 2010-11 has been inflation adjusted to 2016.
            </div>
            <div style={{ lineHeight: "1.3", paddingTop: "1rem" }}>
              Source: {source}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Beeswarm;
