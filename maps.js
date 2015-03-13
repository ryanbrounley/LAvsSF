// Width and height
var w = 700;
var h = 900;

var sfPopData = [], sfPriceData = [];
var minPop, maxPop, minPrice, maxPrice, minIncome, maxIncome, minEmployment, maxEmployment, minPoverty, maxPoverty;

var tooltip = d3.select("body").append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0);
		
document.write('<button id="Population" onclick="Population();">Population</button>');
document.write('<button id="Housing Prices" onclick="Prices();">Housing Prices</button>');
document.write('<button id="Income" onclick="Income();">Income</button>');
document.write('<button id="Employment" onclick="Employment();">Employment</button>');
document.write('<button id="Poverty" onclick="Poverty();">Poverty</button>');

var color = d3.scale.quantize()
                    .range(["rgb(237,248,233)", "rgb(186,228,179)",
                     "rgb(116,196,118)", "rgb(49,163,84)","rgb(0,109,44)"]);
                     
var SFColor = d3.scale.quantize()
                .range(["#feedde", "#fdbe85", "#fd8d3c", "#e6550d", "#a63603"]);


var LABasecolor = d3.scale.quantize()
                    .range(["rgb(237,248,233)", "rgb(186,228,179)",
                     "rgb(116,196,118)", "rgb(49,163,84)","rgb(0,109,44)"]);
                     
var LAColor = d3.scale.quantize()
                .range(["#eff3ff", "#bdd7e7", "#3182bd", "#3182bd", "#08519c"]);


// Set up projections
var SFprojection = d3.geo.mercator()
   	.center([-122.433701, 37.767683])
    .scale(180000)
    .translate([w / 2, h / 2]);
var LAprojection = d3.geo.mercator()
    .center([-118.35, 34.10])
    .scale(50000)
    .translate([w / 2, h / 2]);
               
// Set up paths
var SFpath = d3.geo.path()
   	.projection(SFprojection)
var LApath = d3.geo.path()
	.projection(LAprojection)
			
// Set up zoom behavior
var SFzoom = d3.behavior.zoom()
    .translate([0, 0])
    .scale(1)
    .scaleExtent([1, 8])
    .on("zoom", SFzoomed);
var LAzoom = d3.behavior.zoom()
    .translate([0, 0])
    .scale(1)
    .scaleExtent([1, 8])
    .on("zoom", LAzoomed);
			    
// Set up SVGs
var SFsvg = d3.select("#container")
	.append("svg")
	.attr("width", w)
	.attr("height", h)
	.call(SFzoom);
var LAsvg = d3.select("#container")
	.append("svg")
	.attr("width", w)
	.attr("height", h)
    .call(LAzoom);


d3.json("CACounties.json", function(json){
    console.log(json);
    LAsvg.append("g")
         .selectAll("path")
         .data(json.features)
         .enter()
         .append("path")
         .attr("d", LApath)
         .style("stroke", "black")
         .style("fill", "none");
   });
						
d3.csv("LAData.csv", function(data) {
    console.log(data);
	LABasecolor.domain([
                d3.min(data, function(d) { return d.population; }),
                d3.max(data, function(d) { return d.population; })
    ]);
    
    LAColor.domain([
                d3.min(data, function(d) {return d.population;}),
                d3.max(data, function(d) { return d.population; })
    ]);
    
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
    console.log(json);
	LAsvg.append("g")
		.selectAll("path")
	    .data(json.features)
	    .enter()
	    .append("path")
	    .attr("d", LApath)
        .style("stroke", "black")
        .style("fill", function(d) {
		        //Get data value
		        var value = d.properties.population;
				//console.log(value);
		        if (value) {
		        	//If value exists…
		            return color(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             })
                    .on("mouseover", function(e){
                d3.select(this).style("fill", function(f){
                    var value = f.properties.population;
                    if(value) {
                        return LAColor(value);
                    }else {
                        return "#ccc";
                    }
                })
                
                tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                tooltip.html("Population: " + e.properties.population + "<br>Tract: " + e.properties.tract + "<br>FID: " + e.properties.FID)
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");})
            .on("mouseout", function(e){
                d3.select(this).style("fill", function(d) {
		        //Get data value
		        var value = d.properties.population;
				console.log(value);
		        if (value) {
		        	//If value exists…
		            return color(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             })
                
                tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);});
        
   		
		});

});


d3.csv("SFData.csv", function(data) {
    console.log(data);
	color.domain([
                d3.min(data, function(d) { return d.population; }),
                d3.max(data, function(d) { return d.population; })
    ]);
    
    SFColor.domain([
                d3.min(data, function(d) {return d.population;}),
                d3.max(data, function(d) { return d.population; })
    ]);
    
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
            var dataPoverty = parseFloat(data[i].poverty);
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
   		SFsvg.selectAll("path")
        	.data(json.features)
            .enter()
            .append("path")
            .attr("d", SFpath)
            .style("stroke", "black")
            .style("fill", function(d) {
		        //Get data value
		        var value = d.properties.population;
				//console.log(value);
		        if (value) {
		        	//If value exists…
		            return color(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             })
                    .on("mouseover", function(e){
                d3.select(this).style("fill", function(f){
                    var value = f.properties.population;
                    if(value) {
                        return SFColor(value);
                    }else {
                        return "#ccc";
                    }
                })
                
                tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                tooltip.html("Population: " + e.properties.population + "<br>Tract: " + e.properties.tract + "<br>FID: " + e.properties.FID)
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");})
            .on("mouseout", function(e){
                d3.select(this).style("fill", function(d) {
		        //Get data value
		        var value = d.properties.population;
				console.log(value);
		        if (value) {
		        	//If value exists…
		            return color(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             })
                
                tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);});
        
   		
		});

});


/*

*/

// Zoom handler			
function SFzoomed() {
	SFsvg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}
function LAzoomed() {
	LAsvg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function Population() {
	
	color.domain([
                minPop,
                maxPop
    ]);
    
    SFColor.domain([
                minPop,
                maxPop
    ]);
    LAColor.domain = SFColor.domain;
	
	SFsvg.selectAll("path")
            .style("stroke", "black")
            .style("fill", function(d) {
		        //Get data value
		        var value = d.properties.population;
				//console.log(value);
		        if (value) {
		        	//If value exists…
		            return color(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             })
                .on("mouseover", function(e){
                d3.select(this).style("fill", function(f){
                    var value = f.properties.population;
                    if(value) {
                        return SFColor(value);
                    }else {
                        return "#ccc";
                    }
                });
                tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                tooltip.html("Population: " + e.properties.population + "<br>Tract: " + e.properties.tract + "<br>FID: " + e.properties.FID)
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");})
            .on("mouseout", function(e){
                d3.select(this).style("fill", function(d) {
		        //Get data value
		        var value = d.properties.population;
				console.log(value);
		        if (value) {
		        	//If value exists…
		            return color(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             })
                tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);});
    
    
    LAsvg.selectAll("path")
            .style("stroke", "black")
            .style("fill", function(d) {
		        //Get data value
		        var value = d.properties.population;
				//console.log(value);
		        if (value) {
		        	//If value exists…
		            return color(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             })
                .on("mouseover", function(e){
                d3.select(this).style("fill", function(f){
                    var value = f.properties.population;
                    if(value) {
                        return LAColor(value);
                    }else {
                        return "#ccc";
                    }
                });
                tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                tooltip.html("Population: " + e.properties.population + "<br>Tract: " + e.properties.tract + "<br>FID: " + e.properties.FID)
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");})
            .on("mouseout", function(e){
                d3.select(this).style("fill", function(d) {
		        //Get data value
		        var value = d.properties.population;
				console.log(value);
		        if (value) {
		        	//If value exists…
		            return color(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             })
                tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);});
   		
}
                
function Income() {
	color.domain([
                minIncome,
                maxIncome
    ]);
    
        SFColor.domain([
                minIncome,
                maxIncome
    ]);
    
    LAColor.domain = SFColor.domain;
	
	SFsvg.selectAll("path")
            .style("stroke", "black")
            .style("fill", function(d) {
		        //Get data value
		        var value = d.properties.income;
				console.log(value);
		        if (value) {
		        	//If value exists…
		            return color(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             })
                .on("mouseover", function(e){
                d3.select(this).style("fill", function(f){
                    var value = f.properties.income;
                    if(value) {
                        return SFColor(value);
                    }else {
                        return "#ccc";
                    }
                });
                tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                tooltip.html("Income: $" + e.properties.income + "<br>Tract: " + e.properties.tract + "<br>FID: " + e.properties.FID)
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");})
            .on("mouseout", function(e){
                d3.select(this).style("fill", function(d) {
		        //Get data value
		        var value = d.properties.income;
				console.log(value);
		        if (value) {
		        	//If value exists…
		            return color(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             })
                tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);});
    
    
    LAsvg.selectAll("path")
            .style("stroke", "black")
            .style("fill", function(d) {
		        //Get data value
		        var value = d.properties.income;
				console.log(value);
		        if (value) {
		        	//If value exists…
		            return color(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             })
                .on("mouseover", function(e){
                d3.select(this).style("fill", function(f){
                    var value = f.properties.income;
                    if(value) {
                        return LAColor(value);
                    }else {
                        return "#ccc";
                    }
                });
                tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                tooltip.html("Income: $" + e.properties.income + "<br>Tract: " + e.properties.tract + "<br>FID: " + e.properties.FID)
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");})
            .on("mouseout", function(e){
                d3.select(this).style("fill", function(d) {
		        //Get data value
		        var value = d.properties.income;
				console.log(value);
		        if (value) {
		        	//If value exists…
		            return color(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             })
                tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);});
}
                
function Prices() {
	
	color.domain([
                minPrice,
                maxPrice
    ]);
    
        SFColor.domain([
                minPrice,
                maxPrice
    ]);
	
    
    LAColor.domain = SFColor.domain;
    
	SFsvg.selectAll("path")
            .style("stroke", "black")
            .style("fill", function(d) {
		        //Get data value
		        var value = d.properties.price;
				console.log(value);
		        if (value) {
		        	//If value exists…
		            return color(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             })
                .on("mouseover", function(e){
                d3.select(this).style("fill", function(f){
                    var value = f.properties.price;
                    if(value) {
                        return SFColor(value);
                    }else {
                        return "#ccc";
                    }
                });
                tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                tooltip.html("Housing Median: $" + e.properties.price + "<br>Tract: " + e.properties.tract + "<br>FID: " + e.properties.FID)
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");})
            .on("mouseout", function(e){
                d3.select(this).style("fill", function(d) {
		        //Get data value
		        var value = d.properties.price;
				console.log(value);
		        if (value) {
		        	//If value exists…
		            return color(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             })
                tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);});
    
    
    LAsvg.selectAll("path")
            .style("stroke", "black")
            .style("fill", function(d) {
		        //Get data value
		        var value = d.properties.price;
				console.log(value);
		        if (value) {
		        	//If value exists…
		            return color(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             })
                .on("mouseover", function(e){
                d3.select(this).style("fill", function(f){
                    var value = f.properties.price;
                    if(value) {
                        return LAColor(value);
                    }else {
                        return "#ccc";
                    }
                });
                tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                tooltip.html("Housing Median: $" + e.properties.price + "<br>Tract: " + e.properties.tract + "<br>FID: " + e.properties.FID)
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");})
            .on("mouseout", function(e){
                d3.select(this).style("fill", function(d) {
		        //Get data value
		        var value = d.properties.price;
				console.log(value);
		        if (value) {
		        	//If value exists…
		            return color(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             })
                tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);});
    
    
}

function Employment() {
	color.domain([
                minEmployment,
                maxEmployment
    ]);
    
        SFColor.domain([
                minEmployment,
                maxEmployment
    ]);
    
    LAColor.domain = SFColor.domain;
	
	SFsvg.selectAll("path")
            .style("stroke", "black")
            .style("fill", function(d) {
		        //Get data value
		        var value = d.properties.employment;
				console.log(value);
		        if (value) {
		        	//If value exists…
		            return color(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             })
                .on("mouseover", function(e){
                d3.select(this).style("fill", function(f){
                    var value = f.properties.employment;
                    if(value) {
                        return SFColor(value);
                    }else {
                        return "#ccc";
                    }
                });
                tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                tooltip.html("Employment rate: " + e.properties.employment + "%<br>Tract: " + e.properties.tract + "<br>FID: " + e.properties.FID)
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");})
            .on("mouseout", function(e){
                d3.select(this).style("fill", function(d) {
		        //Get data value
		        var value = d.properties.employment;
				console.log(value);
		        if (value) {
		        	//If value exists…
		            return color(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             })
                tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);});
    
    LAsvg.selectAll("path")
            .style("stroke", "black")
            .style("fill", function(d) {
		        //Get data value
		        var value = d.properties.employment;
				console.log(value);
		        if (value) {
		        	//If value exists…
		            return color(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             })
                .on("mouseover", function(e){
                d3.select(this).style("fill", function(f){
                    var value = f.properties.employment;
                    if(value) {
                        return LAColor(value);
                    }else {
                        return "#ccc";
                    }
                });
                tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                tooltip.html("Employment rate: " + e.properties.employment + "%<br>Tract: " + e.properties.tract + "<br>FID: " + e.properties.FID)
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");})
            .on("mouseout", function(e){
                d3.select(this).style("fill", function(d) {
		        //Get data value
		        var value = d.properties.employment;
				console.log(value);
		        if (value) {
		        	//If value exists…
		            return color(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             })
                tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);});
}

function Poverty() {
	color.domain([
                minPoverty,
                40//maxPoverty
    ]);
    
    SFColor.domain([
                minPoverty,
                40//maxPoverty
    ]);
    
    LAColor.domain = SFColor.domain;
    
	
	SFsvg.selectAll("path")
            .style("stroke", "black")
            .style("fill", function(d) {
		        //Get data value
		        var value = d.properties.poverty;
				console.log(value);
		        if (value) {
		        	//If value exists…
		            return color(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             })
                .on("mouseover", function(e){
                d3.select(this).style("fill", function(f){
                    var value = f.properties.poverty;
                    if(value) {
                        return SFColor(value);
                    }else {
                        return "#ccc";
                    }
                });
                tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                tooltip.html("Poverty rate: " + e.properties.poverty + "%<br>Tract: " + e.properties.tract + "<br>FID: " + e.properties.FID)
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");})
            .on("mouseout", function(e){
                d3.select(this).style("fill", function(d) {
		        //Get data value
		        var value = d.properties.poverty;
				console.log(value);
		        if (value) {
		        	//If value exists…
		            return color(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             })
                tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);});
    
    LAsvg.selectAll("path")
            .style("stroke", "black")
            .style("fill", function(d) {
		        //Get data value
		        var value = (d.properties.poverty / d.properties.population) * 100;
				console.log(value);
		        if (value) {
		        	//If value exists…
		            return color(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             })
                .on("mouseover", function(e){
                d3.select(this).style("fill", function(f){
                    var value = (f.properties.poverty / f.properties.population) * 100;
                    if(value) {
                        return LAColor(value);
                    }else {
                        return "#ccc";
                    }
                });
                tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                tooltip.html("Poverty rate: " + (e.properties.poverty / e.properties.population) * 100 + "%<br>Tract: " + e.properties.tract + "<br>FID: " + e.properties.FID)
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");})
            .on("mouseout", function(e){
                d3.select(this).style("fill", function(d) {
		        //Get data value
		        var value = (d.properties.poverty / d.properties.population) * 100;
				console.log(value);
		        if (value) {
		        	//If value exists…
		            return color(value);
		        } else {
		            //If value is undefined…
		            return "#ccc";
		        }
             })
                tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);});
}