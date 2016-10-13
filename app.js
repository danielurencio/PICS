var express = require("express"),
    app = express(),
    engines = require("consolidate"),
    MongoClient = require("mongodb").MongoClient,
    bodyParser = require("body-parser");

var routes = require("./routes");
app.engine("html", engines.nunjucks);
app.set("view engine", "html");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



MongoClient.connect("mongodb://localhost:27017/PICS", function(err,db) {

////// A MUNICIPIOS!!! <---- Esto consulta la cartografía municipal
  app.post("/municipios", function(req,res) {
    
    var id = req.body.cve;
    var query = db.collection("municipios").find({ "_id":id });
    var array = [];

    query.stream().on("data", function(d) { array.push(d); });

    query.stream().on("end", function() {
      console.log("Entidad " + id);
      res.send(array[0])
      app.get("/"+ id, function(req,ress,next) {
	return ress.json(array[0]); array = null;
      })
    });

  });

  app.post("/localidades", function(req,res,next) {
    var id = req.body.cve.ent;
    var page = req.body.cve.mun;
    var query = db.collection("localidades").find({ "_id":id });
    var array = [];

    query.stream().on("data", function(d) { array.push(d); });

    query.stream().on("end", function(d) {
      res.send("");
      app.get("/" + page, function(req,ress,next) {
        return ress.json(array[0]);
        return ress.end(); return
      });
      console.log("Localidad " + page);
    });

  });

  app.post("/manzanas", function(req,res) {
    var id = req.body.id;
    console.log(id);

    var query = db.collection("manzanas").find({ "_id": id });
    var array = [];

    query.stream().on("data", function(d) { array.push(d); });

    query.stream().on("end", function() {
      res.send(array[0]);
/*      app.get("/" + id, function(req,ress,next) {
	ress.json(array[0]);
	ress.end();
      });*/
    });

  });

  app.get("/entidadesJSON", function(req,res) {
      var query = db.collection("entidades").find({})
		.project({ "_id":0 });

      query.stream().on("data", function(d) { return res.json(d); });
      query.stream().on("close", function() { db.close(); return res.end()});
  });


  app.get("/SUN", function(req,res,next) {
    var query = db.collection("SUNsocio").find({})
		.project({
		  "_id":0,
		  "Número de registron en el Sistema Urbano Nacional 2010":1,
		  "Nombre de la ciudad":1,
		  "Tipo de ciudad": 1,
		  "Población total 2010": 1,
		  "Densidad media urbana": 1
		});
    var arr = [];
    query.stream().on("data", function(d) { arr.push(d);});
    query.stream().on("end", function(d) { res.json(arr); })

  });

  app.get("/denue", function(req,res,next) {
    var cveSUN = "1";
    var array = [];
    var query = db.collection("denue")
	.find({
	  "cveSUN": cveSUN,
//	  "$where": "/^22*/.test(this['Código de la clase de actividad SCIAN'])"
	})
	.project({
	  "Código de la clase de actividad SCIAN":1,
	  "Nombre de clase de la actividad":1,
	  "_id":0
	});

    query.stream().on("data", function(d) { array.push(d); });
    query.stream().on("end", function(d) { res.json(array); console.log(array.length); });
  });
  
});


  app.get("/entidades", routes.entidades);
  app.get("/Puebla", routes.puebla);
  app.get("/localidadesPue", routes.localidadesPue);
  app.get("/manzanasPue", routes.manzanasPue);
  app.get("/charts", routes.charts);


app.listen(8080, function() {
  console.log("server is on!");
});
