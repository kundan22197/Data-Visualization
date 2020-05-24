function vis1(data, div) {



  const final_data = data.sort((a,b) => d3.ascending(a.net_committed, b.net_committed));

  const color_data = ['Received more', 'Donated more'];

  const color_1 = d3.scaleOrdinal()
    .domain(color_data)
    .range(d3.schemeSet1);

  function legend1() {
  const size = 10;
  const lineHeight = size * 1.5;
  
  

  const svg = div.append('svg')
              .attr("width", 100, "height", color_1.domain().length * lineHeight/2);
  const rows = svg
    .selectAll("g")
    .data(color_1.domain())
    .join("g")
      .attr("transform", (d, i) => `translate(0, ${i * lineHeight})`);
  
  rows.append("rect")
      .attr("height", size)
      .attr("width", size)
      .attr("fill", d => color_1(d));
  
  rows.append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("dominant-baseline", "hanging")
      .attr("x", lineHeight)
      .text(d => d);
  
  return svg.node();
}

legend1();


  const margin = ({top: 30, right: 65, bottom: 10, left: 25});
  const barHeight = 15;
  const width = 750;
  const height = Math.ceil((final_data.length + 0.1) * barHeight) + margin.top + margin.bottom;
  // const height = 500;

   const svg = div.append('svg')
      .attr("viewBox", [0, 0, width, height]);


  const tickFormat = d3.formatPrefix("+.1", 1e6);

   const x = d3.scaleLinear()
    .domain(d3.extent(final_data, d => d.net_committed))
    .rangeRound([margin.left, width - margin.right]);
 
 const y = d3.scaleBand()
    .domain(d3.range(final_data.length))
    .rangeRound([margin.top, height - margin.bottom])
    .padding(0.1);
 
 const xAxis = g => g
    .attr("transform", `translate(0,${margin.top})`)
    .call(d3.axisTop(x).ticks(width / 80).tickFormat(tickFormat))
    .call(g => g.select(".domain").remove());
 
 const yAxis = g => g
    .attr("transform", `translate(${x(0)},0)`)
    .call(d3.axisLeft(y).tickFormat(i => final_data[i].name).tickSize(0).tickPadding(6))
    .call(g => g.selectAll(".tick text").filter(i => final_data[i].value < 0)
        .attr("text-anchor", "start")
        .attr("x", 6));
  
  svg.append("g")
    .selectAll("rect")
    .data(final_data)
    .join("rect")
      .attr("fill", d => d3.schemeSet1[d.net_committed > 0 ? 1 : 0])
      .attr("x", d => x(Math.min(d.net_committed, 0)))
      .attr("y", (d, i) => y(i))
      .attr("width", d => Math.abs(x(d.net_committed) - x(0)))
      .attr("height", y.bandwidth());

  svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
    .selectAll("text")
    .data(final_data)
    .join("text")
      .attr("text-anchor", d => d.net_committed < 0 ? "end" : "start")
      .attr("x", d => x(d.net_committed) + Math.sign(d.net_committed - 0) * 4)
      .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .text(d => d.Country);

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);
}
