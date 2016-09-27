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
      res.send("");
      app.get("/" + id, function(req,ress) { ress.json(array[0]); });
    });
//    res.send(""); // < -- ¿Por qué FUNCIONA esto?
//    app.get("/" + id, function(req,ress) { ress.json(array[0]); });
  });

  app.post("/localidades", function(req,res) {
    var id = req.body.cve.ent; console.log(req.body)
    var page = req.body.cve.mun;
    var query = db.collection("localidades").find({ "_id":id });
    var array = [];
    query.stream().on("data", function(d) { array.push(d); });

    query.stream().on("end", function(d) {
      res.send("");
      app.get("/" + page, function(req,ress) { ress.json(array[0]); });
    });
//    res.send("");
//    app.get("/" + page, function(req,ress) { ress.json(array[0]); });
  });

  app.get("/entidadesJSON", function(req,res) {
      var query = db.collection("entidades").find({})
		.project({ "_id":0 });

      query.stream().on("data", function(d) { return res.json(d); });
      query.stream().on("close", function() { db.close(); });
  });


  app.get("/SUN", function(req,res,next) {
    var query = db.collection("sunList").find({})
		.project({ "_id":0 });
var arr = [];
    query.stream().on("data", function(d) { arr.push(d);});
    query.stream().on("end", function(d) { res.json(arr); })
//	res.send("hola");
  });
  
});


//  app.get("/", routes.index);
  app.get("/entidades", routes.entidades);
  app.get("/Puebla", routes.puebla);
  app.get("/localidadesPue", routes.localidadesPue);
  app.get("/manzanasPue", routes.manzanasPue);


app.listen(8080, function() {
  console.log("server is on!");
});
