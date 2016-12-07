var conn = new Mongo();
var db = conn.getDB("PICS");
var db1 = conn.getDB("test");

var centros = db.alexCentrosUrbanos.find({},{_id:1, ciudad:1}).toArray(); // son 53
var conurbaciones = db.alexConurbaciones.find({},{_id:1,ciudad:1}).toArray(); // son 23
var zm = db.SUNsocio.find({"Tipo de ciudad":1},{"Número de registro en el Sistema Urbano Nacional 2010":1, "Nombre de la ciudad":1, _id: 0}).toArray();
var ZM = [];

zm.forEach(function(d) {
 var obj = {};
 obj._id = d['Número de registro en el Sistema Urbano Nacional 2010'];
 obj.ciudad = d['Nombre de la ciudad'];
 ZM.push(obj);
});

var sun = ZM.concat(conurbaciones).concat(centros);
var a = db1.potencial.find().toArray();

for(var i in a) {
 for(var j in sun) {
  if( a[i].cveSUN == sun[j]._id ) a[i].ciudad = sun[j].ciudad;
 }
}

db1.potencial.drop();
a = a.filter(function(d) { return d.ciudad; });
db1.potencial.insert(a);
