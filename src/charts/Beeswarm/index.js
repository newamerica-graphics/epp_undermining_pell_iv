import React from "react";
import ChartContainer from "../../components/ChartContainer";
import { ParentSize } from "@vx/responsive";
import Swarm from "./Swarm.js";
import Select from "react-select";

class Beeswarm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { search: "" };
  }
  updateSearch = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  render() {
    const { title, source, height } = this.props;
    return (
      <ChartContainer title={title} source={source} height={height}>
        <Select
          isMulti
          name="schools"
          options={this.props.data.map(d => {
            return { label: d.school, value: d.school };
          })}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={this.updateSearch}
        />
        <ParentSize>
          {({ width, height }) => (
            <Swarm
              width={width}
              height={height}
              data={this.props.data}
              search={this.state.search}
            />
          )}
        </ParentSize>
      </ChartContainer>
    );
  }
}

export default Beeswarm;
