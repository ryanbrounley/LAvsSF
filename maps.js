			//Width and height
			var w = 600;
			var h = 500;


            var projection = d3.geo.mercator()
               .center([-122.433701, 37.767683])
               .scale(250000)
               .translate([w / 2, h / 2]);

			//Define path generator
			var path = d3.geo.path()
                       .projection(projection)
            
			//Create SVG element
			var svg = d3.select("body")
						.append("svg")
						.attr("width", w)
						.attr("height", h);

			//Load in GeoJSON data
			d3.json("SanFrancisco.json", function(json) {
				
				//Bind data and create one path per GeoJSON feature
				svg.selectAll("path")
				   .data(json.features)
				   .enter()
				   .append("path")
				   .attr("d", path)
                   .style("fill", "steelblue");
                   console.log(json.features);
		
			});



          var LAprojection = d3.geo.mercator()
             .center([-118.25, 34.05])
             .scale(50000)
             .translate([w / 2, h / 2]);

          var LApath = d3.geo.path()
             .projection(LAprojection)
          
          var LAsvg = d3.select("body")
				.append("svg")
				.attr("width", w)
				.attr("height", h);

			//Load in GeoJSON data
			d3.json("LA-Nonsimple.json", function(json) {
				
				//Bind data and create one path per GeoJSON feature
				LAsvg.selectAll("path")
				   .data(json.features)
				   .enter()
				   .append("path")
				   .attr("d", LApath)
                   .style("fill", "steelblue");
                   console.log(json.features);
		
			});



		
