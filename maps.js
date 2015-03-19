// Width and height
var w = 1500;
var h = 700;
var centered;

var sfPopData = [], sfPriceData = [];
var minPop, maxPop, minPrice, maxPrice, minIncome, maxIncome, minEmployment, maxEmployment, minPoverty, maxPoverty;

document.write('<button id="Population" class="PopButton" onclick="Population();">Population</button>');
document.write('<button id="Housing Prices" class="HouseButton" onclick="Prices();">Housing Prices</button>');
document.write('<button id="Income" class="IncomeButton" onclick="Income();">Income</button>');
document.write('<button id="Employment" class="EmploymentButton" onclick="Employment();">Employment</button>');
document.write('<button id="Poverty" class="PovertyButton" onclick="Poverty();">Poverty</button>');

var tooltip = d3.select("body").append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0);

var poparray = ["#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"];

var incomearray = ["rgb(237,248,233)", "rgb(186,228,179)",
                     "rgb(116,196,118)", "rgb(49,163,84)","rgb(0,109,44)"];

var povarray = ["#fee5d9", "#fcae91", "#fb6a4a", "#de2d26", "#a50f15"];

var pricearray = ["#f2f0f7", "#cbc9e2", "#9e9ac8", "#756bb1", "#54278f"];

var employarray = ["#feebe2", "#fbb4b9", "#f768a1", "#c51b8a", "#7a0177"];

var Popcolor = d3.scale.quantize()
                 .range(["#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"])
                 .domain([0, 9453]);


var IncomeColor = d3.scale.threshold()
                    .range(["rgb(237,248,233)", "rgb(186,228,179)",
                     "rgb(116,196,118)", "rgb(49,163,84)","rgb(0,109,44)"])
                    .domain([0, 30000, 70000, 120000, 3600000])

var PovertyColor = d3.scale.quantize()
                    .range(["#fee5d9", "#fcae91", "#fb6a4a", "#de2d26", "#a50f15"])
                    .domain([0, 17]);

var PriceColor = d3.scale.quantize()
                   .range(["#f2f0f7", "#cbc9e2", "#9e9ac8", "#756bb1", "#54278f"]);

var EmploymentColor = d3.scale.quantize()
                        .range(["#feebe2", "#fbb4b9", "#f768a1", "#c51b8a", "#7a0177"]);

 var colorScale = d3.scale.threshold()
    .domain([0, 5, 10, 15, 20])
    .range([0].concat(Popcolor.range()));

// Set up projections

//Geomap template code taken from http://bost.ocks.org/mike/map/
var SFprojection = d3.geo.mercator()
   	.center([-122.433701, 37.767683])
    .scale(200000)
    .translate([w / 2 - 400, h / 2 - 60]);
var LAprojection = d3.geo.mercator()
    .center([-118.35, 34.10])          //original:[(-118.35, 34.10])
    .scale(45000)
    .translate([w / 2 + 400, h / 2 - 100]);
               
// Set up paths
var SFpath = d3.geo.path()
   	.projection(SFprojection)
var LApath = d3.geo.path()
	.projection(LAprojection)

var popNums = ["0 - 3,100", "3,100 - 6,500", "6,500 - 7,700", "7,700 - 8,400", "8,400 +"];

var incomeNums = ["$10,000 -","10,000 - $30,000", "30,000 - $64,000","64,000 - $115,000","$115,000 +"];

var houseNums = ["0 - $115,000","115,000 - $190,000", "200,000 - $360,000","360,000 - $450,000","$450,000 +"];

var povNums = ["0 - 4.5%","4.5 - 8.0%", "8.0 - 12.5%","12.5 - 16.0%","16.0% +"];

var empNums = ["30 - 42%","42 - 59%", "59 - 71%","71 - 80%","80% +"];
			    
// Set up SVGs


var svg = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h);

svg.append("rect")
    .attr("class", "background")
    .attr("width", w)
    .attr("height", h)
    .style("fill", "#edf8fb")
    .on("click", SFclicked);

var g = svg.append("g");

//legend code based loosely on day/hour heatmap link below
//http://bl.ocks.org/tjdecke/5558084

//legend creation attached to the svg
var legend = svg.selectAll(".legend")
    .data(colorScale.domain(), function(d) { return d; })
    .enter()
    .append("g")
    .attr("class", "legend");

//the appending of the legend by color
 legend.append("rect")
        //sets the location and width of each colored rectangles and adds the iteratively
        .attr("x", function(d,i){ return 250 + (200 * i);})
        .attr("y", h-60)
        .attr("width", 200)
        .attr("height", 30)
        .attr("fill", function(d, i){ return poparray[i];})
        .style("stroke", "black")
        .style("stroke-width", "3px");  

//appends the text in the legend color boxes
 legend.append("text")
        .attr("x", function(d,i){ return 260 + (200 * i);})
        .attr("y", h-40)
        .attr("width", 200)
        .attr("height", 30)
        .style("fill", "black")
        .style("font-weight", "bold")
        .text(function(d, i) { return popNums[i];});

						
d3.csv("LAData.csv", function(data) {
    //console.log(data);
    
    
    minPop = d3.min(data, function(d) { return d.population; });
    maxPop = d3.max(data, function(d) { return d.population; });
    
    minPrice = d3.min(data, function(d) { return d.price; });
    maxPrice = d3.max(data, function(d) { return d.price; });
    
    minIncome = d3.min(data, function(d) { return d.income; });
    maxIncome = d3.max(data, function(d) { return d.income; });
    
    minEmployment = d3.min(data, function(d) { return d.employment; });
    maxEmployment = d3.max(data, function(d) { return d.employment; });
    
    minPoverty = d3.min(data, function(d) { return d.poverty; });
    maxPoverty = d3.max(data, function(d) { return d.poverty; });
    
 


		    
// Parse geojson files.
d3.json("LACountyTracts.geojson", function(json) {
    
    for (var i = 0; i < data.length; i++) {
        // Grab area name
        var dataArea = data[i].area;
        //console.log(dataArea);
        // Grab data value, and convert from string to float
        var dataPopulation = parseFloat(data[i].population);
        var dataPrice = parseFloat(data[i].price);
        var dataIncome = parseFloat(data[i].income);
        var dataEmployment = parseFloat(data[i].employment);
        var dataPoverty = parseFloat(data[i].poverty);
        var dataTract = parseFloat(data[i].tracts);
            
        //Find the corresponding area inside the GeoJSON
        //console.log(json.features.length);
        //for (var j = 0; j < json.features.length; j++) {
				//var jsonArea = json.features[j].properties.FID;
				//console.log(jsonArea);
				//if (dataArea == jsonArea) {
					//Copy the data value into the JSON
                	json.features[i].properties.population = dataPopulation;
                	json.features[i].properties.price = dataPrice;
                	json.features[i].properties.income = dataIncome;
                	json.features[i].properties.employment = dataEmployment;
                	json.features[i].properties.poverty = dataPoverty;
                    json.features[i].properties.tract = dataTract;
                	
					//Stop looking through the JSON
                //break;
        		//}
    		//}
   		}   		

    
	// Draw svg lines of the boundries.
	g.append("g")
		.selectAll("path")
	    .data(json.features)
	    .enter()
	    .append("path")
	    .attr("d", LApath)
        .on("click", LAclicked)
        .style("stroke", "black")
        .style("fill", function(d) {
		        //Get data value
		        var value = d.properties.population;
				//console.log(value);
		        if (value) {
		        	//If value exists…
		            return Popcolor(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             })
                    .on("mouseover", function(e){
                tooltip.transition()
                        .duration(20)
                        .style("opacity", .9);
                tooltip.html("Population: " + e.properties.population + "<br>Employment: " + e.properties.employment + "%<br>Income: $" + Math.round(e.properties.income / 1000) + ",000" +"<br>Poverty: " + Math.round(e.properties.poverty/e.properties.population * 10000) / 100 + "%<br>Housing Rates: $" + Math.round(e.properties.price / 1000) + ",000")
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");})
            .on("mouseout", function(e){
                tooltip.transition()
                   .duration(20)
                   .style("opacity", 0);});
        
   		
		});

});


// Set up left scale
//     3 lines and a piece of text above
svg.append("line")
	.attr("id", "leftLength")
	.attr("x1", 25)
	.attr("y1", 50)
	.attr("x2", 93)
	.attr("y2", 50)
		.attr("style", "stroke:rgb(0,0,0);stroke-width:2;font-weight:bold;")
svg.append("line")
	.attr("x1", 25)
	.attr("y1", 50)
	.attr("x2", 25)
	.attr("y2", 55)
	.attr("style", "stroke:rgb(0,0,0);stroke-width:2;font-weight:bold;")
svg.append("line")
	.attr("id", "leftEnd")
	.attr("x1", 93)
	.attr("y1", 50)
	.attr("x2", 93)
	.attr("y2", 55)
    .attr("style", "stroke:rgb(0,0,0);stroke-width:2;font-weight:bold;")
svg.append("text")
	.attr("id", "leftText")
	.attr("x", 44)
	.attr("y", 40)
    .style("font-weight","bold")
	.attr("fill", "black")
	.text("1 mi")
	
// Set up right scale
//    3 lines and a piece of text above
svg.append("line")
	.attr("id", "rightLength")
	.attr("class", "rightScale")
	.attr("x1", 700)
	.attr("y1", 50)
	.attr("x2", 767)
	.attr("y2", 50)
    .attr("style", "stroke:rgb(0,0,0);stroke-width:2;font-weight:bold;")
svg.append("line")
	.attr("class", "rightScale")
	.attr("x1", 700)
	.attr("y1", 50)
	.attr("x2", 700)
	.attr("y2", 55)
	.attr("style", "stroke:rgb(0,0,0);stroke-width:2;font-weight:bold;")
svg.append("line")
	.attr("id", "rightEnd")
	.attr("class", "rightScale")
	.attr("x1", 767)
	.attr("y1", 50)
	.attr("x2", 767)
	.attr("y2", 55)
	.attr("style", "stroke:rgb(0,0,0);stroke-width:2;font-weight:bold;")
svg.append("text")
	.attr("id", "leftText")
	.attr("class", "rightScale")
	.attr("x", 715)
	.attr("y", 40)
	.attr("fill", "black")
    .style("font-weight","bold")
	.text("10 mi")
	

d3.csv("SFData.csv", function(data) {
    
    minPop = d3.min(data, function(d) { return d.population; });
    maxPop = d3.max(data, function(d) { return d.population; });
    
    minPrice = d3.min(data, function(d) { return d.price; });
    maxPrice = d3.max(data, function(d) { return d.price; });
    
    minIncome = d3.min(data, function(d) { return d.income; });
    maxIncome = d3.max(data, function(d) { return d.income; });
    
    minEmployment = d3.min(data, function(d) { return d.employment; });
    maxEmployment = d3.max(data, function(d) { return d.employment; });
    
    minPoverty = d3.min(data, function(d) { return d.poverty; });
    maxPoverty = d3.max(data, function(d) { return d.poverty; });
    
        
        
    d3.json("SanFrancisco.json", function(json) {
        // Loop through once for each pop data value
        for (var i = 0; i < data.length; i++) {
            // Grab area name
            var dataArea = data[i].area;
            //console.log(dataArea);
            // Grab data value, and convert from string to float
            var dataPopulation = parseFloat(data[i].population);
            var dataPrice = parseFloat(data[i].price);
            var dataIncome = parseFloat(data[i].income);
            var dataEmployment = parseFloat(data[i].employment);
            var dataPoverty = parseFloat(data[i].poverty) * dataPopulation / 100;
            var dataTract = parseFloat(data[i].tracts);
            
            //Find the corresponding area inside the GeoJSON
            //console.log(json.features.length);
            for (var j = 0; j < json.features.length; j++) {
				var jsonArea = json.features[j].properties.FID;
				//console.log(jsonArea);
				if (dataArea == jsonArea) {
					//Copy the data value into the JSON
                	json.features[j].properties.population = dataPopulation;
                	json.features[j].properties.price = dataPrice;
                	json.features[j].properties.income = dataIncome;
                	json.features[j].properties.employment = dataEmployment;
                	json.features[j].properties.poverty = dataPoverty;
                    json.features[j].properties.tract = dataTract;
                	
					//Stop looking through the JSON
                	break;
        		}
    		}
   		}   		
   		g.selectAll("path")
        	.data(json.features)
            .enter()
            .append("path")
            .attr("d", SFpath)
            .style("stroke", "black")
            .on("click", SFclicked)
            .style("fill", function(d) {
		        //Get data value
		        var value = d.properties.population;
				//console.log(value);
		        if (value) {
		        	//If value exists…
		            return Popcolor(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             })
            .on("mouseover", function(e){
                tooltip.transition()
                        .duration(20)
                        .style("opacity", .9);
                tooltip.html("Population: " + e.properties.population + "<br>Employment: " + e.properties.employment + "%<br>Income: $" + Math.round(e.properties.income / 1000) + ",000" +"<br>Poverty: " + Math.round(e.properties.poverty/e.properties.population * 10000) / 100 + "%<br>Housing Rates: $" + Math.round(e.properties.price / 1000) + ",000")
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");})
            .on("mouseout", function(e){
                tooltip.transition()
                   .duration(20)
                   .style("opacity", 0);});
   		
		});

});

// g.append("rect")
//        .attr("class", "legend")
//        .attr("x", w/2 - 120)
//        .attr("y", h/2 - 300)
//        .attr("width", 15)
//        .attr("height", 600)
//        .attr("fill", "black")
//        .style("stroke-size", "1px");


function Population() {
	
    //overrides previous legend with population one
    legend.append("rect")
        .attr("x", function(d,i){ return 250+ (200 * i);})
        .attr("y", h-60)
        .attr("width", 200)
        .attr("height", 30)
        .attr("fill", function(d, i){ return poparray[i];})
        .style("stroke", "black")
        .style("stroke-width", "3px");   
    //overrides previous legend with text
    legend.append("text")
            .attr("x", function(d,i){ return 260 + (200 * i);})
            .attr("y", h-40)
            .attr("width", 200)
            .attr("height", 30)
            .style("fill", "black")
            .style("font-weight", "bold")
            .text(function(d, i) { return popNums[i];});

	d3.selectAll("path")
            .style("stroke", "black")
            .transition().duration(1000)
            .style("fill", function(d) {
		        //Get data value
		        var value = d.properties.population;
		        if (value) {
		        	//If value exists…
		            return Popcolor(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             });
    
}
                
function Income() {
	
   //overrides previous legend with income legend
   legend.append("rect")
        .attr("x", function(d,i){ return 250+(200 * i);})
        .attr("y", h-60)
        .attr("width", 200)
        .attr("height", 30)
        .attr("fill", function(d, i){ return incomearray[i];})
        .style("stroke", "black")
        .style("stroke-width", "3px");   
    
    //overrides previous legend text with income text
    legend.append("text")
            .attr("x", function(d,i){ return 260 + (200 * i);})
            .attr("y", h-40)
            .attr("width", 200)
            .attr("height", 30)
            .style("fill", "black")
            .style("font-weight", "bold")
            .text(function(d, i) { return incomeNums[i];});
    
	d3.selectAll("path")
            .style("stroke", "black")
            .transition().duration(1000)
            .style("fill", function(d) {
		        //Get data value
		        var value = d.properties.income;
		        if (value) {
		        	//If value exists…
		            return IncomeColor(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             });
}
                
function Prices() {
	
	PriceColor.domain([
                minPrice,
                maxPrice
    ]);
    
    //overrides previous legend with housingprices legend
    legend.append("rect")
        .attr("x", function(d,i){ return 250+(200 * i);})
        .attr("y", h-60)
        .attr("width", 200)
        .attr("height", 30)
        .attr("fill", function(d, i){ return pricearray[i];})
        .style("stroke", "black")
        .style("stroke-width", "3px");   
    
    //overrides previous legend text with housingprices legend
    legend.append("text")
            .attr("x", function(d,i){ return 260 + (200 * i);})
            .attr("y", h-40)
            .attr("width", 200)
            .attr("height", 30)
            .style("fill", "black")
            .style("font-weight", "bold")
            .text(function(d, i) { return houseNums[i];});
    
	d3.selectAll("path")
            .style("stroke", "black")
            .transition().duration(1000)
            .style("fill", function(d) {
		        //Get data value
		        var value = d.properties.price;
		        if (value) {
		        	//If value exists…
		            return PriceColor(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             });
            
    
    
}

function Employment() {
	EmploymentColor.domain([
                50,
                maxEmployment
    ]);
    
    //overrides previous legend with employment legend
    legend.append("rect")
        .attr("x", function(d,i){ return 250+(200 * i);})
        .attr("y", h-60)
        .attr("width", 200)
        .attr("height", 30)
        .attr("fill", function(d, i){ return employarray[i];})
        .style("stroke", "black")
        .style("stroke-width", "3px");  
    
    //overrides previous legend text 
    legend.append("text")
        .attr("x", function(d,i){ return 260 + (200 * i);})
        .attr("y", h-40)
        .attr("width", 200)
        .attr("height", 30)
        .style("fill", "black")
        .style("font-weight", "bold")
        .text(function(d, i) { return empNums[i];});
	
	d3.selectAll("path")
            .style("stroke", "black")
            .transition().duration(1000)
            .style("fill", function(d) {
		        //Get data value
		        var value = d.properties.employment;
		        if (value) {
		        	//If value exists…
		            return EmploymentColor(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             });
    
}

function Poverty() {
	PovertyColor.domain([
                minPoverty,
                18
    ]);
    
    //overrides previous legend with poverty legend
    legend.append("rect")
        .attr("x", function(d,i){ return 250+(200 * i);})
        .attr("y", h-60)
        .attr("width", 200)
        .attr("height", 30)
        .attr("fill", function(d, i){ return povarray[i];})
        .style("stroke", "black")
        .style("stroke-width", "3px"); 
    
    //overrides previous legend text with poverty legend
    legend.append("text")
        .attr("x", function(d,i){ return 260 + (200 * i);})
        .attr("y", h-40)
        .attr("width", 200)
        .attr("height", 30)
        .style("fill", "black")
        .style("font-weight", "bold")
        .text(function(d, i) { return povNums[i];});
    
	d3.selectAll("path")
            .style("stroke", "black")
            .transition().duration(1000)
            .style("fill", function(d) {
		        //Get data value
                if(d.properties.poverty == 0){
                    value = 0;
                }else{
		        var value = d.properties.poverty/d.properties.population * 100;
                }
				//console.log(value);
		        if (value) {
		        	//If value exists…
		            return PovertyColor(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             });

}


//Zoom functions taken from http://bl.ocks.org/mbostock/2206590, Mike Bostock's 
//geomap example
  function SFclicked(d) {
  var x, y, k;

  // Zoom into SF
  if (d && centered !== d) {
    var centroid = SFpath.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
    // Change SF scale
    svg.select("#leftText")
    	.text("2 mi")
    // Hide SF scale
    svg.selectAll(".rightScale")
    	.attr("opacity", 0)
  } 
  // Zoom out of SF
  else {
    x = w / 2;
    y = h / 2;
    k = 1;
    centered = null;
    svg.select("#leftText")
    	.text("1 mi")
    // Reshow LA scale
    svg.selectAll(".rightScale")
    .attr("opacity", 100)
  }

  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}

 function LAclicked(d) {
  var x, y, k;
    
  // Zoom into LA     
  if (d && centered !== d) {
    var centroid = LApath.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
    
    svg.select("#leftText")
    	.text("3 mi")
    svg.selectAll(".rightScale")
    	.attr("opacity", 0)
  } 
  // Zoom out from LA
  else {
    x = w / 2;
    y = h / 2;
    k = 1;
    centered = null;
    
    svg.select("#leftText")
    	.text("1 mi")
    svg.selectAll(".rightScale")
    	.attr("opacity", 100)
  }

  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1 / k + "px");
}