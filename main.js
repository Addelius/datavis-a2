// Waiting until document has loaded
window.onload = () => {

  // YOUR CODE GOES HERE
  console.log("YOUR CODE GOES HERE");
  loadFile();
  // Set Dimensions



};


async function loadFile() {
  const response = await fetch("cars.csv");
  const content = await response.text();   //  content as a string

  // console.log(content);

  const xSize = 600;
  const ySize = 500;
  const margin = 40;
  const xMax = xSize - margin * 2;
  const yMax = 100;

  // Create Random Points
  const data = [];
  const cars = CSVToArray(content);
  const numPoints = cars.length / 1;

  const selected_attributes = ["Horsepower(HP)", "City Miles Per Gallon", "Type", "AWD", "Retail Price", "Engine Size (l)", "Cyl"];

  const attribute_indizes = selected_attributes.map(attribute => cars[0].indexOf(attribute));
  const type_index = cars[0].indexOf("Type");

  const yScale = 5;

  for (let i = 1; i < numPoints; i++) {
    const dataset = attribute_indizes.map(index => cars[i][index]);
    data.push(dataset);
    if (i % 10 == 0) {
      // console.log(dataset)
    }
    // data.push([cars[i][hp_index], cars[i][mpg_index], cars[i][type_index]]);
    // console.log([cars[i][hp_index], cars[i][mpg_index]]);
  }

  const car_colors = new Map([
    ["Sedan", "Blue"],
    ["SUV", "Gray"],
    ["Sports Car", "Red"],
    ["Wagon", "Purple"],
    ["Minivan", "Pink"]
  ])

  // console.log(new Set(cars.map(car => car[type_index])))
  // Append SVG Object to the Page
  const svg = d3.select("#myPlot")
    .append("svg")
    .append("g")
    .attr("transform", "translate(" + 2 * margin + "," + margin + ")");

  // X Axis
  const x = d3.scaleLinear()
    .domain([0, xMax])
    .range([0, 2 * xMax]);

  svg.append("g")
    .attr("transform", "translate(0," + yScale * yMax + ")")
    .call(d3.axisBottom(x));

  // Y Axis
  const y = d3.scaleLinear()
    .domain([0, yMax])
    .range([yScale * yMax, 0]);

  svg.append("g")
    .call(d3.axisLeft(y));

  // X Axis label
  svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", xMax / 2)
    .attr("y", yScale * yMax + 35)
    .text("Horsepower");

  // Y Axis label
  svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("x", -(yScale * yMax) / 2)
    .attr("y", -35)
    .text("City Miles Per Gallon");

  // Dots
  const AWDtoSymbol = {
    "0": d3.symbolCircle,
    "1": d3.symbolSquare
  };

  svg.append('g')
    .selectAll("dot")
    .data(data).enter()
    .append("path")
    .attr("transform", d =>
      `translate(${2 * d[0]}, ${yScale * (yMax - d[1])})`
    )
    .attr("d", d => d3.symbol()
      .type(AWDtoSymbol[d[3]])
      .size(40)()
    )
    .style("fill", function (d) { return car_colors.get(d[2]) })
    .style("cursor", "pointer")
    .on("mouseover", handleDotHover)
    .on("mousemove", moveTooltip)
    .on("mouseout", hideTooltip);


  const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(300, -10)");
  const legendData = Array.from(car_colors, ([label, color]) => ({ label, color }));
  // console.log(legendData);
  legendData.push({label: "Square: AWD", color: "White"});
  legendData.push({label: "Circle: no AWD", color: "White"});
  // Legend circles
  legend.selectAll(".legend-dot")
    .data(legendData)
    .enter()
    .append("circle")
    .attr("class", "legend-dot")
    .attr("cx", 100)
    .attr("cy", (d, i) => 100 + i * 25)
    .attr("r", 7)
    .style("fill", d => d.color);

  // Legend labels
  legend.selectAll(".legend-label")
    .data(legendData)
    .enter()
    .append("text")
    .attr("class", "legend-label")
    .attr("x", 120)
    .attr("y", (d, i) => 100 + i * 25)
    .text(d => d.label)
    .attr("text-anchor", "start")
    .style("alignment-baseline", "middle");
}
//  const selected_attributes = ["Horsepower(HP)", "City Miles Per Gallon", "Type", "AWD", "Retail Price", "Engine Size (l)", "Cyl"];

function handleDotHover(d, i) {
  console.log(d)
  const hp = d[0];
  const mpg = d[1];
  const type = d[2];
  const AWD = Number(d[3]);
  const price = d[4]
  const engine_size = d[5];
  const cyl = d[6];

  const tooltip = document.getElementById("carTooltip");

  tooltip.innerHTML = `
    <table>
      <tr><th colspan="2" style="text-align:center">${type}</th></tr>
      <tr><td><b>Horsepower</b></td><td>${hp}</td></tr>
      <tr><td><b>City MPG</b></td><td>${mpg}</td></tr>
      <tr><td><b>AWD</b></td><td>${AWD ? "yes" : "no"}</td></tr>
      <tr><td><b>Retail Price</b></td><td>${price}</td></tr>
      <tr><td><b>Engine Size (l)</b></td><td>${engine_size}</td></tr>
      <tr><td><b>Cylinders</b></td><td>${cyl}</td></tr>
    </table>
  `;

  tooltip.style.display = "block";
}

function moveTooltip(d, i) {
  const tooltip = document.getElementById("carTooltip");
  const offset = 15;

  tooltip.style.left = (event.pageX + offset) + "px";
  tooltip.style.top = (event.pageY + offset) + "px";
}

function hideTooltip() {
  const tooltip = document.getElementById("carTooltip");
  tooltip.style.display = "none";
}



// ref: http://stackoverflow.com/a/1293163/2343
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray(strData, strDelimiter) {
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  strDelimiter = (strDelimiter || ",");

  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
    (
      // Delimiters.
      "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

      // Quoted fields.
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

      // Standard fields.
      "([^\"\\" + strDelimiter + "\\r\\n]*))"
    ),
    "gi"
  );


  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]];

  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;


  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while (arrMatches = objPattern.exec(strData)) {

    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[1];

    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (
      strMatchedDelimiter.length &&
      strMatchedDelimiter !== strDelimiter
    ) {

      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push([]);

    }

    var strMatchedValue;

    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[2]) {

      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      strMatchedValue = arrMatches[2].replace(
        new RegExp("\"\"", "g"),
        "\""
      );

    } else {

      // We found a non-quoted value.
      strMatchedValue = arrMatches[3];

    }


    // Now that we have our value string, let's add
    // it to the data array.
    arrData[arrData.length - 1].push(strMatchedValue);
  }

  // Return the parsed data.
  return (arrData);
}


