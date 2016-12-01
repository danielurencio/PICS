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
var cc = db1.sun.find().toArray();

for(var i in sun) {
 for(var j in cc) {
  if( sun[i]._id == cc[j].CVE_SUN ) cc[j].cc = sun[i]._id;
 }
}

db1.sun.drop();

cc.forEach(function(d) { 
  db1.sun.insert(d);
});
