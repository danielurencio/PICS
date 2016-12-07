var conn = new Mongo();
var db = conn.getDB('PICS');
var count = db.vulYres.find().count();

if(count != 445) {
var sunXmunicipio = db.SUN.find({},{"Clave del municipio":1,"Número de registro en el Sistema Urbano Nacional 2010":1,"_id":0}).toArray();

var cenapred = db.vulYres.find().toArray();

for(var i in sunXmunicipio) {
 for(var j in cenapred) {
  if( sunXmunicipio[i]['Clave del municipio'] == cenapred[j]['cveMun'] ) {

cenapred[j]["cveSUN"] = sunXmunicipio[i]['Número de registro en el Sistema Urbano Nacional 2010']

  }
 }
}


var cenapred = cenapred.filter(function(d) { return d.cveSUN; });

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

// Cotejar claves del componente principal con todos los municipios
for(var i in sun) {
 for(var j in cenapred) {
  if( sun[i]._id == cenapred[j].cveSUN ) cenapred[j].ciudad = sun[i].ciudad;
 }
}

cenapred = cenapred.filter(function(d) { if(d.ciudad) return d; });
db.vulYres.drop();
db.vulYres.insert(cenapred);
}

var cenapred = db.vulYres.aggregate([
  { '$group': {
     '_id':{ 'cveSUN':'$cveSUN', 'ciudad':'$ciudad' },
     'vulnerabilidad social': { '$addToSet': { 'mun':'$cveMun','grado':'$grado de vulnerabilidad social' } },
     'resiliencia': { '$addToSet': { 'mun':'$cveMun','grado':'$resiliencia' } },

  } }
]).toArray();
