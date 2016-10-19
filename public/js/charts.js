d3.json("/SUN", function(err,data) {
  var w = window.innerWidth, h = window.innerHeight;
  var body = d3.select("body");
  body.style("margin", "0");

  var zm = data.filter(function(d) {
    return d["Tipo de ciudad"] == 1;
  });

  var zmMean = d3.mean(zm, function(d) { return d["Población total 2010"] });
  //console.log(zmMean);

  var dd = zm.map(function(d) { return d["Población total 2010"] });
  //console.log(dd);

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
});

function Scales(data,feature) {
  this.data = data;
  this.feature = feature;
};

function barChart(cveSUN) {
  d3.json("/sectorCount", function(err, data) {
    var ciudad = data.filter(function(d) { return d['_id'] == cveSUN; });
    console.log(ciudad);
  });
};
