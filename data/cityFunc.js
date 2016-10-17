var MongoClient = require("mongodb").MongoClient;

MongoClient.connect("mongodb://localhost/PICS", function(err, db) {

  db.collection("sectorCount").find().toArray(function(err,cursor) {
    cursor.forEach(function(city) {
     var array = [];
     var stream = db.collection("denue").find({ "cveSUN": city._id }).stream();

     var codes = ["11","21","22","23","31","32","33","43","46","48","49","51","52","53","54","55","56","61","62","71","72","81","93"];

     stream.on("data", function(doc) {
      array.push(doc['Código de la clase de actividad SCIAN']);
     });

     stream.on("end", function() {
      var obj = {};

      codes.forEach(function(c) {
	var patt = new RegExp("^" + c + "....");
	var sector = array.filter(function(d) { return patt.test(d); });
	obj[c] = sector.length;
      });

      city["sectors"] = obj; console.log(city);

     });

    }, function() { console.log(this); });
  });
});
