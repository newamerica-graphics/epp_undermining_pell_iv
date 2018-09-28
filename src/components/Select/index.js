import React from "react";
import './Select.scss'

export default class Select extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { options, selected, onChange } = this.props;
    return (
      <select
        onChange={event => this.props.onChange(event.target.value)}
        className="dv-select"
      >
        {options.map((option, i) => (
          <option selected={option === selected ? true : false} value={option}>{option}</option>
        ))}
      </select>
    );
  }
}
