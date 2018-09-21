import React from "React";
import "./Search.scss";

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: ""
    };
  }

  updateSearch(e) {
    this.setState({ search: e.target.value });
    this.props.onChange(e.target.value);
  }

  render() {
    const { placeholder, className, style } = this.props;
    return (
      <div>
        <input
          type="text"
          placeholder={placeholder || "Search..."}
          onChange={this.updateSearch.bind(this)}
          value={this.state.search}
          className={`search ${className || ""}`}
          style={style}
        />
      </div>
    );
  }
}

export default Search;
