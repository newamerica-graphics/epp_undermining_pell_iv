import "./index.scss";
import Beeswarm from "./charts/Beeswarm";

let queue = [];
let data = null;

const settings = {
  viz__1: el => {
    ReactDOM.render(
      <Beeswarm
        title="test"
        source="test"
        data={data["viz__1"]}
        height={600}
      />,
      el
    );
  }
};

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
