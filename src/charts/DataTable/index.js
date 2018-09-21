import React from "react";
import ChartContainer from "../../components/ChartContainer";
import ReactTable from "react-table";
import withSearch from "./WithSearch";
import "react-table/react-table.css";
import "./DataTable.scss";

class DataTable extends React.Component {
  constructor(props) {
    super(props);
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
    return (
      <ChartContainer title={title} source={source} width={1200} height={1000}>
        {this.props.children}
        <ReactTable
          data={data}
          columns={columns}
          className="-striped"
          showPagination={showPagination ? showPagination : false}
        />
      </ChartContainer>
    );
  }
}
const DataTableWithSearch = withSearch(DataTable);
export { DataTable, DataTableWithSearch };
