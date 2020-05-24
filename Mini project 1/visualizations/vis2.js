function ramp(div, color, n = 256) {
  const canvas = div.append("canvas");
  const context = canvas.node().getContext("2d");
  for (let i = 0; i < n; ++i) {
    context.fillStyle = color(i / (n - 1));
    context.fillRect(i, 0, 10, 10);
  }
  return canvas.node();
}

function legend2({
  div,
  color,
  title,
  tickSize = 6,
  width = 250, 
  height = 100 + tickSize,
  marginTop = 0,
  marginRight = 0,
  marginBottom = -20 + tickSize,
  marginLeft = 0,
  ticks = width / 64,
  tickFormat,
  tickValues
} = {}) {
  const svg = div.append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .style("overflow", "visible")
      .style("display", "block");

  let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
  let x;


 // Sequential
 if (color.interpolator) {
  x = Object.assign(color.copy()
      .interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
      {range() { return [marginLeft, width - marginRight]; }});

  svg.append("image")
      .attr("x", marginLeft)
      .attr("y", marginTop)
      .attr("width", width - marginLeft - marginRight)
      .attr("height", height - marginTop - marginBottom)
      .attr("preserveAspectRatio", "none")
      .attr("xlink:href", ramp(div, color.interpolator()));

  // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
  if (!x.ticks) {
    if (tickValues === undefined) {
      const n = Math.round(ticks + 1);
      tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)));
    }
    if (typeof tickFormat !== "function") {
      tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
    }
  }
}


  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x)
        .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
        .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
        .tickSize(tickSize)
        .tickValues(tickValues))
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
        .attr("x", marginLeft)
        .attr("y", marginTop - marginBottom - height)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .attr("font-size", 20)
        .attr("font-weight", "bold")
        .text(title));
}


function vis2(geoJSON, data, div) {


  const percentChangeExtent = d3.extent(data, d => d.net_committed);

  const final_data = data.sort((a,b) => d3.ascending(a.net_committed, b.net_committed));

  const color = d3.scaleDiverging()
    .domain([percentChangeExtent[0], 0, percentChangeExtent[1]])
    .interpolator(d3.interpolatePiYG);


  const map = new Map(data.map(d => [
      d.Country,
      { committed: d.net_committed,
        donated: d.donated,
        received: d.received }
    ]));

  const countryToCommitted = Object.fromEntries(map);

  const countries = data.map(d => d.Country);

  const margin = ({top: 30, right: 65, bottom: 10, left: 25});

  const visWidth = 600 - margin.left - margin.right;
  const visHeight = 400 - margin.top - margin.bottom;

 
  div = d3.select('#vis2');


   legend2({
  div:div, 
  color: color,
  tickFormat: function(d){return d/1000000 + " M"},
  title: "Net Donated Amounts" ,
});

  const svg = div.append('svg')
      .attr("viewBox", [0, 0, visWidth, visHeight]);


  const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);







 

  // var ordinal = d3.scaleOrdinal()
  //     .domain(["Donated Amount", "Received Amount"])
  //     .range([ "#a50026", "#313695"]);

  // svg.append("g")
  // .attr("class", "legendOrdinal")
  // .style("opacity", 0.7)
  // .attr("transform", "translate(300,15)");

  // var legendOrdinal = d3.legendColor()
  //   .shape("path", d3.symbol().type(d3.symbolCircle).size(90)())
  //   .shapePadding(5)
  //   .cellFilter(function(d){ return d.label !== "e" })
  //   .scale(ordinal);

  // svg.select(".legendOrdinal")
  //   .call(legendOrdinal);


  // draw map

  const projection =  d3.geoNaturalEarth1()
      .fitSize([visWidth, visHeight], geoJSON);

  const path = d3.geoPath().projection(projection);




  g.selectAll('.border')
    .data(geoJSON.features)
    .join('path')
      .attr('class', 'border')
      .attr('d', path)
      .attr('fill', d=>countries.includes(d.properties.sovereignt) ? color(countryToCommitted[d.properties.sovereignt].committed) : '#fdfdfd')
      .attr('stroke', '#dcdcdc')
      .attr('stroke-width', 0.5);










  //     const radius1 = d3.scaleSqrt()
  // .domain([0, d3.max(final_data, d => d.donated)])
  // .range([0, 7]);
  
  
  // const radius2 = d3.scaleSqrt()
  // .domain([0, d3.max(final_data, d => d.received)])
  // .range([0, 7]);
  
  // g.selectAll("dot")
  //     .data(geoJSON.features)
  //     .join("circle")
  //       .attr("class", ".dot")
  //       .attr("fill", "darkred")
  //       .attr("opacity", 0.6)
  //       .attr("cx", d => {
  //         // get the center of the state
  //         const [x, y] = path.centroid(d);
  //         return x;
  //       })
  //       .attr("cy", d => {
  //         const [x, y] = path.centroid(d);
  //         return y;
  //       })
  //       .attr("r", d=>countries.includes(d.properties.sovereignt) ? radius1(countryToCommitted[d.properties.sovereignt].donated) : 0)
  
  
  
  
  //   g.selectAll("dot")
  //     .data(geoJSON.features)
  //     .join("circle")
  //       .attr("class", ".dot")
  //       .attr("fill", "darkblue")
  //       .attr("opacity", 0.6)
  //       .attr("cx", d => {
  //         // get the center of the state
  //         const [x, y] = path.centroid(d);
  //         return x;
  //       })
  //       .attr("cy", d => {
  //         const [x, y] = path.centroid(d);
  //         return y;
  //       })
  //       .attr("r", d=>countries.includes(d.properties.sovereignt) ? radius2(countryToCommitted[d.properties.sovereignt].received) : 0)
  

}













