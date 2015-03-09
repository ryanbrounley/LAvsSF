// Width and height
var w = 600;
var h = 500;
		
document.write('<button id="Population" onclick="Population();">Population</button>');
document.write('<button id="Housing Prices" onclick="Prices();">Housing Prices</button>');
document.write('<button id="Income" onclick="Income();">Income</button>');
			
var color = d3.scale.quantize()
                    .range(["rgb(237,248,233)", "rgb(186,228,179)",
                     "rgb(116,196,118)", "rgb(49,163,84)","rgb(0,109,44)"]);

var tooltip = d3.select("body").append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0);
			
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
								    
// Parse geojson files.
/*d3.json("SanFrancisco.json", function(json) {				
	// Draw svg lines of the boundries.
	SFsvg.append("g")
		.selectAll("path")
	    .data(json.features)
	    .enter()
	    .append("path")
	    .attr("d", SFpath)
	    .style("fill", "#07365F");
});*/
d3.json("LosAngeles.json", function(json) {				
	// Draw svg lines of the boundries.
	LAsvg.append("g")
		.selectAll("path")
	    .data(json.features)
	    .enter()
	    .append("path")
	    .attr("d", LApath)
	    .style("fill", "#07365F");
});

	// Draw svg lines of the boundries.
	

d3.csv("sf-pop-demo.csv", function(data) {
	color.domain([
                d3.min(data, function(d) { return d.population; }),
                d3.max(data, function(d) { return d.population; })
    ]);
        
        
    d3.json("SanFrancisco.json", function(json) {
        // Loop through once for each pop data value
        for (var i = 0; i < data.length; i++) {
            // Grab area name
            var dataArea = data[i].area;
            //console.log(dataArea);
            // Grab data value, and convert from string to float
            var dataPopulation = parseFloat(data[i].population);
            //Find the corresponding area inside the GeoJSON
            //console.log(json.features.length);
            for (var j = 0; j < json.features.length; j++) {
				var jsonArea = json.features[j].properties.FID;
				//console.log(jsonArea);
				if (dataArea == jsonArea) {
					//Copy the data value into the JSON
                	json.features[j].properties.value = dataPopulation;
					//Stop looking through the JSON
                	break;
        		}
    		}
   		}
        var dataPrinter;
   		SFsvg.selectAll("path")
        	.data(json.features)
            .enter()
            .append("path")
            .attr("d", SFpath)
            .style("fill", function(d) {
		        //Get data value
		        var value = d.properties.value;
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
                d3.select(this).style("fill", "#FB5B1F");
                tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                tooltip.html(e.properties.value + "<br>")
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");})
            .on("mouseout", function(e){
                d3.select(this).style("fill", function(d) {
		        //Get data value
		        var value = d.properties.value;
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
                   .style("opacity", 0);})
		});
 
});


// Zoom handler			
function SFzoomed() {
	SFsvg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}
function LAzoomed() {
	LAsvg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function Population() {
	d3.json("SanFrancisco.json", function(json) {
		SFsvg.selectAll("path")
    		.style("fill", "black")
	});
}
                
function Income() {
	d3.json("SanFrancisco.json", function(json) {
		SFsvg.selectAll("path")
			.style("fill", "green")
	});
}
                
function Prices() {
	d3.json("SanFrancisco.json", function(json) {
		SFsvg.selectAll("path")
        	.style("fill", "orange")
	});
}