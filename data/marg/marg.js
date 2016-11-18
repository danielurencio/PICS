var conn = new Mongo();
var db = conn.getDB("PICS");

var marg = db.marg.aggregate([
 { '$group':{ 
    '_id':"$cve_SUN",
    "imu": { "$push":"$IMU2010" }
 } },
 { "$project": {
     "_id":1,
     "imu": { "$avg": "$imu" }
 } }
]).toArray();

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

for(var i in marg) {
 for(var j in sun) {

  if( marg[i]._id == sun[j]._id ) marg[i].ciudad = sun[j].ciudad;

 }
}

marg = marg.filter(function(d) { return d.ciudad; });

marg.forEach(function(d) {
  if( d.imu >= -1.63283 && d.imu < -0.95978 ) d['Grado de marginación urbana 2010'] = "Muy bajo";
  if( d.imu >= -0.95978 && d.imu < -0.62325 ) d['Grado de marginación urbana 2010'] = "Bajo";
  if( d.imu >= -0.62325 && d.imu < 0.04980 ) d['Grado de marginación urbana 2010'] = "Medio";
  if( d.imu >= 0.04980 && d.imu < 1.05937 ) d['Grado de marginación urbana 2010'] = "Alto";
  if( d.imu >= 1.05937 && d.imu < 5.09767 ) d['Grado de marginación urbana 2010'] = "Muy Alto";

  db.gradoDemarg.insert(d);
 
});


