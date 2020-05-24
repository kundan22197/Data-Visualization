

Promise.all([
  d3.csv('data/data.csv', d3.autoType),
  d3.json('data/countries.json'),
  d3.csv('data/data3.csv', d3.autoType),
]).then(([data, geoJSON, new_data]) => {
  vis1(data, d3.select('#vis1'));
  vis2(geoJSON, data, d3.select('#vis2'));
  vis3(new_data, data, d3.select('#vis3'));
});


