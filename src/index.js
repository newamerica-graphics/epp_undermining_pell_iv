import Beeswarm from "./charts/Beeswarm";
import ChoroplethMap from "./charts/ChoroplethMap";
import { DataTableWithSearch } from "./charts/DataTable";
import { format } from "d3-format";
import "./index.scss";

let queue = [];
let data = null;

const settings = {
  viz__1: el => {
    ReactDOM.render(
      <Beeswarm
        title={data["meta"].filter(row => row.chart === "viz__1")[0].title}
        source={data["meta"].filter(row => row.chart === "viz__1")[0].source}
        data={data["viz__1"].map((d, i) => {
          return {
            school: d.school,
            state: d.state,
            price2010: parseFloat(d["net_price_2010_2011"]),
            price2015: parseFloat(d["net_price_2015_2016"]),
            id: i
          };
        })}
        height={700}
      />,
      el
    );
  },
  viz__2: el => {
    ReactDOM.render(
      <ChoroplethMap
        title={data["meta"].filter(row => row.chart === "viz__2")[0].title}
        source={data["meta"].filter(row => row.chart === "viz__2")[0].source}
        data={data["viz__2"]}
        width={1200}
        height={600}
        geometry="us"
      />,
      el
    );
  },
  viz__3: el => {
    dataTableInit(el);
  }
};

function dataTableInit(el) {
  const columns = [
    { Header: "School", accessor: "school", minWidth: 200 },
    { Header: "State", accessor: "state" },
    {
      Header: "Percent Pell",
      accessor: "percent_pell",
      Cell: row => format(".0%")(+row.value / 100),
      sortMethod: (a, b) => +a - +b
    },
    {
      Header: "Net Price",
      accessor: "net_price",
      Cell: row => format("$,")(+row.value),
      sortMethod: (a, b) => +a - +b
    },
    {
      accessor: "type",
      show: false
    }
  ];
  ReactDOM.render(
    <DataTableWithSearch
      data={data["viz__3"]}
      columns={columns}
      showPagination={true}
    />,
    el
  );
}

fetch(
  "https://na-data-projects.s3.amazonaws.com/data/epp/undermining_pell_iv.json"
)
  .then(response => response.json())
  .then(_data => {
    data = _data;
    for (let i = 0; i < queue.length; i++) queue[i]();
  });

window.renderDataViz = function(el) {
  let id = el.getAttribute("id");
  let chart = settings[id];
  if (!chart) return;

  if (data) {
    chart(el);
  } else {
    queue.push(() => chart(el));
  }
};
