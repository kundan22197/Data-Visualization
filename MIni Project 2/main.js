


Promise.all([
  d3.json('data/countries.json'),
  d3.csv('data/vis_1.csv', d3.autoType),
  d3.csv('data/vis_2.csv', d3.autoType),
  d3.csv('data/v30.csv', d3.autoType),
  d3.csv('data/v31.csv', d3.autoType),
  d3.csv('data/v32.csv', d3.autoType),
  d3.csv('data/v33.csv', d3.autoType),

]).then(([geoJSON, data_vis1, data_vis2, datav31, datav32, datav33, datav34]) => {
  vis1(data_vis1, d3.select('#vis1'));
  vis2(data_vis2, d3.select('#vis2'));
  vis3(geoJSON, datav31, datav32, datav33, datav34, d3.select('#vis3'));
});