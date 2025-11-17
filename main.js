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

  console.log(content);

  const xSize = 500; 
  const ySize = 500;
  const margin = 40;
  const xMax = xSize - margin*2;
  const yMax = ySize - margin*2;

  // Create Random Points
  const data = [];
  const cars = CSVToArray(content);
  const numPoints = cars.length;

  const hp_index = 8;
  const mpg_index = 9

  const yScale = 0.1;

  for (let i = 1; i < numPoints; i++) {
    data.push([cars[i][hp_index], cars[i][mpg_index]]);
    console.log([cars[i][hp_index], cars[i][mpg_index]]);
  }

  // Append SVG Object to the Page
  const svg = d3.select("#myPlot")
    .append("svg")
    .append("g")
    .attr("transform","translate(" + margin + "," + margin + ")");

  // X Axis
  const x = d3.scaleLinear()
    .domain([0, xMax])
    .range([0, xMax]);

  svg.append("g")
    .attr("transform", "translate(0," + yScale * yMax + ")")
    .call(d3.axisBottom(x));

  // Y Axis
  const y = d3.scaleLinear()
    .domain([0, yScale * yMax])
    .range([ yScale * yMax, 0]);

  svg.append("g")
    .call(d3.axisLeft(y));

  // Dots
  svg.append('g')
    .selectAll("dot")
    .data(data).enter()
    .append("circle")
    .attr("cx", function (d) { return d[0] } )
    .attr("cy", function (d) { return yScale * (yMax - d[1]) } )
    .attr("r", 3)
    .style("fill", "Red");
  
}


// ref: http://stackoverflow.com/a/1293163/2343
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray( strData, strDelimiter ){
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
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
            ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
}


