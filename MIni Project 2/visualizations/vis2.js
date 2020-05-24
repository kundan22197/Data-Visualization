


function vis2(data, div) {


  const Purpose_to_years = d3.rollup(data, years => years, d => d.coalesced_purpose_name);
                                     
                                     
  const mod_data = Array.from(Purpose_to_years, ([purpose, years]) => ({purpose, years}));
  
  const purpose_to_years = d3.rollup(data, years => d3.max(years, d=>d.commitment_amount_usd_constant), d => d.year);
  const mod_data1 = Array.from(purpose_to_years, ([years, purposes]) => ({years, purposes}));
  const maxvals = mod_data1.map(d => d.purposes);
  const margin = {top: 10, right: 0, bottom: 0, left: 80};
  const visWidth = 950 - margin.left - margin.right;
  const visHeight = 500 - margin.top - margin.bottom;

  const Purpose_names = Array.from(d3.rollup(data,
                                tot => d3.sum(tot, c => c.commitment_amount_usd_constant),
                                d => d.coalesced_purpose_name),
                     ([coalesced_purpose_name, commitment_amount_usd_constant]) => ({coalesced_purpose_name, commitment_amount_usd_constant}))
  .sort((a, b) => d3.descending(a.commitment_amount_usd_constant, b.commitment_amount_usd_constant))
  .map(d => d.coalesced_purpose_name);



  const counts = d3.rollup(data,
         tot => d3.sum(tot, c => c.commitment_amount_usd_constant),
         d => d.year,
         d => d.coalesced_purpose_name);

  const dataByYear = Array.from(counts, (([year, map]) => {
    map.set('year', year);
    map.set('total', d3.sum(map.values()));
    return Object.fromEntries(map)
  }));
    
    const maxAmount = d3.max(mod_data, d => d3.max(d.years, p => p.commitment_amount_usd_constant));


    const color = d3.scaleOrdinal()
    .domain(Purpose_names)
    .range(d3.schemeCategory10);




  const svg = div.append('svg')
      .attr("viewBox", [0, 0, 1000, visHeight+visHeight/4]);


  const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);





      var ordinal = d3.scaleOrdinal()
  .domain(Purpose_names)
  .range(d3.schemeCategory10);



  svg.append("g")
    .attr("class", "legendOrdinal")
    .style("opacity", 0.6)
    .attr("transform", "translate(680,10)");

  var legendOrdinal = d3.legendColor()
    .shape("path", d3.symbol().type(d3.symbolCircle).size(90)())
    .shapePadding(2)
    .cellFilter(function(d){ return d.label !== "e" })
    .scale(ordinal);

  svg.select(".legendOrdinal")
    .call(legendOrdinal);







  const x = d3.scaleLinear()
      .domain(d3.extent(dataByYear, d => d.year))
      .range([0, visWidth]);
  
  const y = d3.scaleLinear()
      .domain([0, maxAmount]).nice()
      .range([visHeight, 0]);
  
  const xAxis = d3.axisBottom(x);
  
  const yAxis = d3.axisLeft(y);

    g.append('g')
      .attr('transform', `translate(0,${visHeight})`)
      .call(xAxis);
  
  g.append('g')
      .call(yAxis)
      .call(g => g.selectAll('.domain').remove())
    .append('text')
      .attr('text-anchor', 'start')
      .attr('dominant-baseline', 'middle')
      .attr('fill', 'black')
      .attr('x', 5)
      .text('Amounts');
  
    const line = d3.line()
      .x(d => x(d.year))
      .y(d => y(d.commitment_amount_usd_constant));
  
  
  const linesSelection = g.selectAll('.line')
      .data(mod_data);
  
  const lineGroups = linesSelection
      .join('g')
        .attr('stroke', d=>color(d.purpose))
        .attr('stroke-opacity', 0.2)
        .attr('stroke-width', 1.2);
  
  lineGroups
    .append('path')
      .datum(d => d.years)
      .attr('d', line)
      .attr('fill', 'none');
  
  lineGroups.selectAll('.circle')
    .data(lg => lg.years)
    .enter().append('circle')
      .attr('r', d => maxvals.includes(d.commitment_amount_usd_constant)?5:0)
      .attr('cx', d => x(new Date(d.year)))
      .attr('cy', d => y(new Date(d.commitment_amount_usd_constant)))
      .attr('fill', d => maxvals.includes(d.commitment_amount_usd_constant)?color(d.coalesced_purpose_name):'none')
      .attr('opacity', 0.7);
  

}










