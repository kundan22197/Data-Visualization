


Promise.all([
  d3.csv('data/v1.csv', d3.autoType),
  d3.csv('data/v2.csv', d3.autoType),
  d3.csv('data/v30.csv', d3.autoType),
  d3.csv('data/v31.csv', d3.autoType),
  d3.csv('data/v32.csv', d3.autoType),
  d3.csv('data/v33.csv', d3.autoType),

]).then(([data_vis1, data_vis2, datav31, datav32, datav33, datav34]) => {
  vis1(data_vis1, d3.select('#vis1'));
  vis2(data_vis2, d3.select('#vis2'));
  vis3(datav31, datav32, datav33, datav34, d3.select('#vis3'));
});