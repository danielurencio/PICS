var canvas1 = document.getElementById("canvas1");
var context1 = canvas1.getContext("2d");
var canvas2 = document.getElementById("canvas1");
var context2 = canvas1.getContext("2d");

var width = window.innerWidth, height = window.innerHeight;

var colors = { 
    orange:"rgb(255,42,44)",
    blue:"rgb(13,26,129)",
    black:"black"
};

d3.selectAll("canvas").attr({ "width": width, "height": height });
d3.select("body").style({ "background-color": colors.black });

var projection = d3.geo.mercator();
var path = d3.geo.path()
	.projection(projection)
	.context(context1);

queue()
    .defer(d3.json, "/manzanas")
//    .defer(d3.json, "/households")
    .await(map);


function map(err, data, points) {

context2.font = "bold 35px Helvetica";
context2.fillStyle = "rgba(255,255,255,.5)";
context2.fillText("San Pedro Cholula", canvas1.width*.66, canvas1.height*.33);

    var sanpedro = new City(data,width,height,"white","rgba(255,255,255,.05)");
    sanpedro.display(context1);
    var i = 0, j = 0;

    (function animate1() {
if(i<points.length) {
	requestAnimationFrame(animate1, canvas1);
	//context.clearRect(0,0,canvas.width,canvas.height);
	//sanpedro.display(context);

	households();
	i++;
}
    })();

    (function animate2() {
if(i<points.length) {
	context2.font = "15px Helvetica";
	var x = canvas2.width*.75
	var y = canvas2.height*0.34;
	var num = j + " Viviendas"//new Date().toISOString();//points[j].num;
	var textW = context2.measureText(num).width;
	var textH = parseInt(context2.font);
	requestAnimationFrame(animate2, canvas2);
	context2.clearRect(x-1,y,textW+2,textH);
	context2.fillStyle = "rgba(255,255,255,.2)";
	context2.fillText(num, x,y+textH);
	j++;
}
    })//();


    function households() {
      //for(var i=0; i<=points.length-1; i++) {

var p = points[i].coordinates;

          var circle = d3.geo.circle().angle(0.000095)
	    .origin(p);

          context1.beginPath()
          context1.lineWidth = 0.5;
          context1.strokeStyle = "rgba(255,255,255,0.8)";
          path(circle());
          context1.stroke();
      //}
    };

}



function City(d,w,h,stroke,fill) {
  this.data = d;
  this.width = w;
  this.height = h;
  this.stroke = stroke;
  this.fill = fill;
}

City.prototype = {

  key: function() { return Object.keys(this.data.objects) },

  feats: function () {
	return topojson.feature(this.data,this.data.objects[this.key()])
  },

  display: function(context1) {

    projection.scale(1).translate([0,0]);
    var b = path.bounds(this.feats());
    var s = 0.95 / Math.max((b[1][0]-b[0][0]/width, (b[1][1]-b[0][1])/height));
    var t = [(width-s*(b[1][0]+b[0][0]))/2, (height-s*(b[1][1]+b[0][1]))/2];
    projection.scale(s).translate(t);

    context1.strokeStyle = this.stroke;
    context1.fillStyle = this.fill;
    context1.beginPath();
    context1.lineWidth = 0.09;
    path(this.feats()); console.log(path(this.feats()));
    context1.fill();
    context1.stroke();
  }

};
