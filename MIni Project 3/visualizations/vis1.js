

function continuousLegend(color, width, height) {
    const svg = d3.create('svg')
        .attr('width', width)
        .attr('height', height);

    
    // margin set up
   
    const margin = {top: 0, bottom: 20, left: 450, right: 20};
    
    const w = width - margin.left - margin.right;  
    const h = height - margin.top - margin.bottom;
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      // g.append('g')
      //   .call(g => g.append("text")
      //   .attr("x", marginLeft)
      //   .attr("y", marginTop - marginBottom - height)
      //   .attr("fill", "currentColor")
      //   .attr("text-anchor", "start")
      //   .attr("font-size", 20)
      //   .attr("font-weight", "bold")
      //   .text(title));


    
    // create a canvas element to draw the legend
    
    const canvas = document.createElement('canvas');
    
    canvas.width = w;
    canvas.height = h;
    
    const context = canvas.getContext("2d");

    for (let i = 0; i < w; ++i) {
      context.fillStyle = color.interpolator()(i / w);
      context.fillRect(i, 0, 100, h);
    }

    // add canvas to SVG as an image
    g.append('svg:image')
        .attr('href', canvas.toDataURL())
    
    // set up the axis
    
    // create scale for tick marks
    const domain = color.domain();
    // sequential scales have domain length 2
    // diverging scales have domain length 3
    const range = domain.length === 2 ?
          [0, w] :
          [0, w/2, w];
    const scale = d3.scaleLinear()
        .domain(domain)
        .range(range);
    
    // create and add axis
    const axis = d3.axisBottom(scale)
        .ticks(5);
    g.append('g')
        .attr('transform', `translate(0, ${h})`)
        .call(axis)
        .call(g => g.select('.domain').remove());

    return svg.node();
  }


 


function vis1(data, div) {

  var margin = {top: 80, right: 25, bottom: 50, left: 110},
  width = 450 - margin.left - margin.right + 1000,
  height = 450 - margin.top - margin.bottom + 200;




  var extent = d3.extent(data, d => d.commitment_amount_usd_constant);


var myColor = d3.scaleSequential()
    .interpolator(d3.interpolateReds)
    .domain([0,extent[1]])


  d3.select('#vis1')
              .append(() => continuousLegend(myColor, 1000, 35));



var svg = d3.select("#vis1")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);


    // const svg = div.append('svg').attr("viewBox", [0, 0, 1000, 1000]);
var g = svg.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


  // Build color scale
  var myColor = d3.scaleSequential()
    .interpolator(d3.interpolateReds)
    .domain([0,48830067295])

  var tooltip = d3.select("#vis1")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

//   svg.append("g")
//     .attr("class", "legendLinear")
//     .style("font-size","4px")
//     .attr("transform", "translate(300,0)");

//   var legendLinear = d3.legendColor()
//     .shapeWidth(35)
//     .orient('horizontal')
//     .shapePadding(0)
//     .cells(10)
//     .title("Donation received")
//     .titleWidth(100)
//     .scale(myColor);

// svg.select(".legendLinear")
//     .call(legendLinear);




var myVars = d3.map(data, function(d){return d.donor;}).keys()
var myGroups = d3.map(data, function(d){return d.recipient;}).keys()

var topRec = ['India', 'Thailand', 'Brazil', 'Colombia', 'Korea', 'Poland', 'South Africa', 'Kuwait', 'Chile', 'Saudi Arabia'];
var topDon = ['United States', 'Japan', 'Germany', 'United Kingdom', 'France', 'Netherlands', 'Canada', 'Sweden', 'Norway', 'Italy', 'Denmark', 'Switzerland', 'Australia', 'Belgium', 'Spain', 'Saudi Arabia', 'Kuwait', 'Korea', 'Austria', 'Finland']


myVars.sort(function(a, b) {
  return topDon.indexOf(a) - topDon.indexOf(b);
});

myGroups.sort(function(a, b) {
  return topRec.indexOf(a) - topRec.indexOf(b);
});
console.log(myVars);
console.log(myGroups);
// console.log(myGroups);

var x = d3.scaleBand()
    .range([ 0, width])
    .domain(myGroups)
    .padding(0.05);
  // g.append("g")
  //   .style("font-size", 15)
  //   .attr("transform", "translate(0," + height + ")")
  //   .call(d3.axisBottom(x).tickSize(0))
  //   .select(".domain").remove()

    g.append("g")
    .style("font-size", 15)
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain").remove()


var y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(myVars)
    .padding(0.05);
  g.append("g")
    .style("font-size", 15)
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove()



  // var mouseover = function(d) {
  //   tooltip
  //     .style("opacity", 1)
  //   d3.select(this)
  //     .style("stroke", "black")
  //     .style("opacity", 1)
  // }
  // var mousemove = function(d) {
  //   tooltip
  //     .html("The exact donated amount is: " + d.commitment_amount_usd_constant)
  //     .style("left", (d3.mouse(this)[0]+70) + "px")
  //     .style("top", (d3.mouse(this)[1]) + "px")
  // }
  // var mouseleave = function(d) {
  //   tooltip
  //     .style("opacity", 0)
  //   d3.select(this)
  //     .style("stroke", "none")
  //     .style("opacity", 0.8)
  // }


g.selectAll()
    .data(data, function(d) {return d.recipient+':'+d.donor;})
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.recipient) })
      .attr("y", function(d) { return y(d.donor) })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return (d.commitment_amount_usd_constant)?myColor(d.commitment_amount_usd_constant):'#000000'} )
      .style("stroke-width", 4)
      .style("stroke", "none")
      // .style("opacity", 0.8)
    // .on("mouseover", mouseover)
    // .on("mousemove", mousemove)
    // .on("mouseleave", mouseleave)

g.append("text")
        .attr("x", -110)
        .attr("y", -20)
        .attr("text-anchor", "left")
        .style("font-size", "14px")
        .style("fill", "grey")
        .style("max-width", 50)
        .text("Donors(↓ Ascending)");

g.append("text")
        .attr("x", (width/2)-80)
        .attr("y", height+40)
        .attr("text-anchor", "left")
        .style("font-size", "14px")
        .style("fill", "grey")
        .style("max-width", 50)
        .text("Recipient(→ Descending)");

}