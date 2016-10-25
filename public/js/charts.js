d3.json("/SUN", function(err,data) {
  var w = window.innerWidth, h = window.innerHeight;
  var body = d3.select("body");
  body.style("margin", "0");

  var zm = data.filter(function(d) {
    return d["Tipo de ciudad"] == 1;
  });

  var zmMean = d3.mean(zm, function(d) { return d["Población total 2010"] });

  var dd = zm.map(function(d) { return d["Población total 2010"] });

  var x = d3.scale.linear()
    .domain([
	d3.min(data, function(d) { return d["Población total 2010"] }),
	d3.max(data, function(d) { return d["Población total 2010"] })
    ])
    .range([ 100, 500 ]);

  var y = d3.scale.linear()
    .domain([
	d3.min(data, function(d) { return d["Densidad media urbana"]; }),
	d3.max(data, function(d) { return d["Densidad media urbana"]; })
    ])
    .range([ 500, 100 ]);


  var svg = body.append("svg")
   .attr({
     "width": window.innerWidth,
     "height": window.innerHeight
    })
    .style({
      "display": "block",
      "position": "absoulute",
      "margin": "0 auto"
    });

  var menus = [
   { "dimension": 30 }
  ];

  var menu = svg.selectAll("rect")
    .data(menus).enter()
    .append("rect")
    .attr({
      "x": function(d) { return w - d.dimension - 2; },
      "y": function(d) { return h - d.dimension - 2; },
      "width": function(d) { return d.dimension; },
      "height":function(d) { return d.dimension; }
    })
    .on("click", function() { change(); } )

  var zms = svg.selectAll("circle")
      .data(zm)
    .enter().append("circle")
      .attr({
	"cx": 10,
	"cy": function(d,i) { return (i * 11) + 12},
	"r": 4,
	"id": function(d) { return d["Nombre de la ciudad"]; },
	"fill": "rgba(0,0,0,0.5)"
      })

  var zmsText = svg.selectAll("text")
      .data(zm)
      .enter().append("text")
	.attr({
	  "x": 14,
	  "y": function(d,i) { return (i * 11) + 12 },
	  "font-size": 10,
	  "alignment-baseline": "central"
	})
	.text(function(d) { return d["Nombre de la ciudad"]; })
	.on("click", function(d) {
	  var cveSUN = d['Número de registro en el Sistema Urbano Nacional 2010'];
	  console.log(cveSUN);
	  barChart(cveSUN);
	});

  function change() {
      zms.transition()
      .delay(function(d,i) {
	return i / zm.length * 1000;
      })
      .each("start", function() {
	d3.select(this)
	  .transition()
	  .attr({
	    "cx": function(d) { x.range([200,500]); return x(d["Población total 2010"]); },
	    "cy": function(d) { y.range([500,200]); return y(d["Densidad media urbana"]); }
	  })
      });
  }

  function barChart(cveSUN) {

    d3.selectAll("rect").remove();
    d3.json("/sectorCount", function(err, data) {

      var margin = { 'top':20, 'bottom':100, 'right':250, 'left':40 };
      var width = 600 - margin.left - margin.right;
      var height = 600 - margin.top - margin.bottom;
      var ciudad = data.filter(function(d) { return d['_id'] == cveSUN; })[0];
      console.log(ciudad.count);

      var objArray = [];

      for(var i in ciudad.sectors) {
	var obj = { 'sector':i, 'count':ciudad.sectors[i] };
        objArray.push(obj);
      }; 

      var y = d3.scale.linear()
	.domain([ 0, d3.max(objArray, function(d) { return d.count; }) ])
	.range([ height, 10 ]);

      var x = d3.scale.ordinal()
	.domain(objArray.map(function(d) { return d.sector; }))
	.rangeRoundBands([ 0, width + margin.top + margin.bottom ], .1)


      var s = d3.scale.linear()
	.domain(
	  [d3.min(objArray, function(d) { return d.count; }),
	  d3.max(objArray, function(d) { return d.count; })]
	)
	.range([0.6,0.9])

      var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom");

      var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");

      svg.append("g")
	.attr({
	 "transform": "translate(" + margin.right + "," + 600 + ")",
	 "class": "x axis"
	})
	.call(xAxis);

      d3.selectAll(".axis text")
	.style({
	 "font-family": "helvetica",
	 "font-size": "10px"
	})
      d3.selectAll(".line").style({
	"stroke-width":"1",
	"fill":"none"
      });
      d3.selectAll(".x.axis path").attr("display", "inline");
      d3.selectAll(".axis line,.axis path")
	.attr({
	 "fill": "none",
	 "stroke": "black",
	 "shape-rendering": "crispEdges"
	});

      svg.selectAll("bars").data(objArray)
       .enter().append("rect")
       .style({
	"fill": function(d) {
	  var alpha = d.count / ciudad.count;
	  var color = "rgba(255,0,0," + s(d.count) + ")"
	  return color;
	},
//	"stroke": "white"
	})
       .attr({
        "x": function(d,i) { return margin.right + x(d.sector); },
        "y": function(d) { return y(d.count) },
        "width": x.rangeBand(),
        "height": function(d) { return height + margin.top + margin.bottom - y(d.count); }
       });

    });
  };


});

function Scales(data,feature) {
  this.data = data;
  this.feature = feature;
};


