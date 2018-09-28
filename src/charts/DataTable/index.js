import React from "react";
import ChartContainer from "../../components/ChartContainer";
import ReactTable from "react-table";
import Pagination from "./Pagination";
import withSearch from "./WithSearch";
import Select from "../../components/Select";
import "react-table/react-table.css";
import "./DataTable.scss";

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filter: "All" };
    this.updateFilter = this.updateFilter.bind(this);
  }

  updateFilter(val) {
    this.setState({ filter: val });
  }
  render() {
    const {
      data,
      columns,
      title,
      source,
      showSearch,
      showPagination
    } = this.props;

    let _data = data;
    if (this.state.filter !== "All") {
      _data = data.filter(row => row.type === this.state.filter);
    } else {
      _data = data;
    }

    return <ChartContainer title={title} source={source} width={1200} height={1000}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          {this.props.children}
          <div >
            <span style={{paddingRight: "0.5rem", fontStyle: "italic", fontSize: "14px"}}>Filter by: </span><Select onChange={this.updateFilter} options={["All", "The Best Public Universities", "The Next Best", "High Net Price Publics", "Country Club Publics"]} />
          </div>
        </div>
        <ReactTable data={_data} columns={columns} className="-striped" showPagination={showPagination ? showPagination : false} showPageSizeOptions={false} PaginationComponent={Pagination} />
      </ChartContainer>;
  }
}
const DataTableWithSearch = withSearch(DataTable);
export { DataTable, DataTableWithSearch };
