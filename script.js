// set the dimensions and margins of the graph
const margin = {top: 10, right: 10, bottom: 150, left: 10},
    width = 1000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom,
    innerRadius = 100,
    outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${width/2},${height/2+100})`); // Add 100 on Y translation, cause upper bars are longer

    d3.csv("Bigfoot Sightings in MA - Sheet1.csv").then(function (data) {
        data.forEach(function (d) {
            d["Number of Witnesses"] = +d["Number of Witnesses"];
            d["Sightings per Season"] = +d["Sightings per Season"];
          });

  // X scale
  const x = d3.scaleBand()
      .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .align(0)                  // This does nothing ?
      .domain( data.map(d => d.Index)); // The domain of the X axis is the list of states.

  // Y scale
  const y = d3.scaleRadial()
      .range([innerRadius, outerRadius])   // Domain will be define later.
      .domain([0, 5]); // Domain of Y is from 0 to the max seen in the data

// second Y scale
 // Second barplot Scales
 var ybis = d3.scaleRadial()
 .range([innerRadius, 5])   // Domain will be defined later.
 .domain([0, 10]);

// Seasons color scale
var seasonsScale = d3.scaleOrdinal().domain(data)
  .range(["#2f52e0", "#bced09", "#f9cb40", "#ff715b"])
// Environment color scale
var enviroScale = d3.scaleOrdinal().domain(data)
  .range(["#beb0a7", "#8b9d83", "#6a7b76", "#3a4e48", "#040303"])

  // Add bars
  svg.append("g")
    .selectAll("path")
    .data(data)
    .join("path")
    .attr("fill", function (d) {
        return enviroScale(d.Environment);
      })
      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius(innerRadius)
          .outerRadius(d => y(d['Number of Witnesses']))
          .startAngle(d => x(d.Index))
          .endAngle(d => x(d.Index) + x.bandwidth())
          .padAngle(0.01)
          .padRadius(innerRadius))


    // Add the labels
  svg.append("g")
  .selectAll("g")
  .data(data)
  .enter()
  .append("g")
    .attr("text-anchor", function(d) { return (x(d.Index) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
    .attr("transform", function(d) { return "rotate(" + ((x(d.Index) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d['Number of Witnesses'])+10) + ",0)"; })
  .append("text")
    .text(function(d){return(d.County)})
    .attr("transform", function(d) { return (x(d.County) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
    .style("font-size", "11px")
    .attr("alignment-baseline", "middle")

// Add the second series
svg.append("g")
.selectAll("path")
.data(data)
.enter()
.append("path")
.attr("fill", function (d) {
    return seasonsScale(d.Season);
  })
  .attr("d", d3.arc()     // imagine your doing a part of a donut plot
      .innerRadius( function(d) { return ybis(0) })
      .outerRadius( function(d) { return ybis(d['Sightings per Season']); })
      .startAngle(function(d) { return x(d.Index); })
      .endAngle(function(d) { return x(d.Index) + x.bandwidth(); })
      .padAngle(0.01)
      .padRadius(innerRadius))

});