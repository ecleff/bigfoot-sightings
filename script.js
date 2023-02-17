// set the dimensions and margins of the graph
const margin = {top: 10, right: 10, bottom: 150, left: 10},
    width = 1000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom,
    innerRadius = 150,
    outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${width/2},${height/2+100})`); // Add 100 on Y translation, cause upper bars are longer

    d3.csv("bigfoot.csv").then(function (data) {
        data.forEach(function (d) {
            d["Number.of.Witnesses"] = +d["Number.of.Witnesses"];
          });

  // X scale
  const x = d3.scaleBand()
      .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .align(0)                  // This does nothing ?
      .domain( data.map(d => d.index)); // The domain of the X axis is the list of states.

  // Y scale
  const y = d3.scaleRadial()
      .range([innerRadius, outerRadius])   // Domain will be define later.
      .domain([0, 5]); // Domain of Y is from 0 to the max seen in the data


// Seasons color scale

// // do a diverging color scale??
// var seasonsScale = d3.scaleOrdinal().domain(data)
//   .range(["#2f52e0", "#bced09", "#f9cb40", "#ff715b"])
// // Environment color scale

// do categorical discrete variables
var enviroScale = d3.scaleOrdinal().domain(data)
  .range(["#3943b7", "#bdf7b7", "#f8f4a6", "#e08e45"])

  // Add bars
  svg.append("g")
    .selectAll("path")
    .data(data)
    .join("path")
    .attr("fill", function (d) {
        return enviroScale(d.Environment);
      })
      .attr("stroke", "grey")
      .attr("stroke-width",0.7)
      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius(innerRadius)
          .outerRadius(d => y(d['Number.of.Witnesses']))
          .startAngle(d => x(d.index))
          .endAngle(d => x(d.index) + x.bandwidth())
          .padAngle(0.03)
          .padRadius(innerRadius))


    // Add the labels
  svg.append("g")
  .selectAll("g")
  .data(data)
  .enter()
  .append("g")
    .attr("text-anchor", function(d) { return (x(d.index) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
    .attr("transform", function(d) { return "rotate(" + ((x(d.index) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d['Number.of.Witnesses'])+10) + ",0)"; })
  .append("text")
    .text(function(d){return(d.County)})
    .attr("transform", function(d) { return (x(d.County) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
    .style("font-size", "11px")
    .attr("alignment-baseline", "top")

    // add season axes lines

  svg.append("g")
    .selectAll("path")
    .data(data)
    .join("path")
    .attr("fill", "black")
      .attr("stroke", "black")
      .attr("stroke-width",1)
      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
          .startAngle(d => x(d.season_start_index))
          .endAngle(d => x(d.season_start_index))
          .padAngle(0.03)
          .padRadius(innerRadius))

    // Add the labels
    svg.append("g")
    // .selectAll("g")
    // .data(data)
    // .enter()
    // .append("g")
    //   .attr("text-anchor", function(d) { return (x(d.season_start_index) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
    //   .attr("transform", function(d) { return "rotate(" + ((x(d.season_start_index) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d['Number.of.Witnesses'])) + ",0)"; })
    // .append("text")
    //   .text(function(d){return(d.Season)})
    //   .attr("transform", function(d) { return (x(d.Season) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
    //   .style("font-size", "11px")
    //   .attr("alignment-baseline", "middle")
    .selectAll("g")
    .data(data)
    .enter().append("g")
         .attr("text-anchor", function(d) { return (x(d.season_start_index) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
  
      .attr("transform", function(d) { return "rotate(" + ((x(d.Season) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)"; });
  label.append("text")
      .attr("transform", function(d) { return (x(d.Season) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,16)" : "rotate(-90)translate(0,-9)"; })
      .text(function(d) { return d.Season; });



});