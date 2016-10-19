var conn = new Mongo();
var db = conn.getDB("PICS");

var cities = db.getCollection("sectorCount").find().toArray();

cities.forEach(function(doc) {
  var obj = {};
  var codes = ["11","21","22","23","31","32","33","43","46","48","49","51","52","53","54","55","56","61","62","71","72","81","93"];
  var array = [];
  db.getCollection("denue").find({ "cveSUN": doc._id }).forEach(function(d) {
    array.push(d['Código de la clase de actividad SCIAN']);
  });

  codes.forEach(function(code) { print(array.length)
    var patt = new RegExp("^" + code + "....");
    var sector = array.filter(function(s) { return patt.test(s) });
    obj[code] = sector.length;
  });

  doc["sectors"] = obj;

});

// aquí
var sun = db.getCollection("SUNsocio").find({},
{
"Número de registro en el Sistema Urbano Nacional 2010":1,
"Tipo de ciudad":1,
"_id":0
}).toArray();

sun.pop(); sun.pop(); sun.pop();


sun.forEach(function(d) {
  d["_id"] = String(d['Número de registro en el Sistema Urbano Nacional 2010']);
  delete d['Número de registro en el Sistema Urbano Nacional 2010'];
});

cities.forEach(function(c) {
  sun.forEach(function(s) {
    if( c._id == s._id) {
      c['Tipo de ciudad'] = s['Tipo de ciudad'];
    }
  });
});
