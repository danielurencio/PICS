var conn = new Mongo();
var db = conn.getDB("PICS");

var finanzas = db.getCollection("finanzas").find().toArray();

db.finanzas.drop();

finanzas.forEach(function(d) {
  d._id = String(d._id);
  db.finanzas.insert(d);
});


finanzas = db.finanzas.find({
  '$where': '(this._id.length > 2)',
   '$and': [
    { 'Nombre': { '$ne':'No especificado' } },
    { 'Nombre': { '$ne':'Otros estados' } },
    { 'Nombre': { '$ne':'Otros municipios' } },
    { 'Nombre': { '$ne':'Estados Unidos de América' } },
    { 'Nombre': { '$ne':'Otros países latinoamericanos' } },
    { 'Nombre': { '$ne':'Otros países' } }
   ]
}).toArray();


var sunXmunicipio = db.SUN.find({},{"Clave del municipio":1,"Número de registro en el Sistema Urbano Nacional 2010":1,"_id":0}).toArray();

// Cotejar claves del SUN con todos los municipios
for(var i in sunXmunicipio) {
 for(var j in finanzas) {
  if( sunXmunicipio[i]['Clave del municipio'] == finanzas[j]['_id'] ) {

finanzas[j]["cveSUN"] = sunXmunicipio[i]['Número de registro en el Sistema Urbano Nacional 2010']

  }
 }
}

finanzas = finanzas.filter(function(d) { if(d.cveSUN) return d; });

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
 for(var j in finanzas) {
  if( sun[i]._id == finanzas[j].cveSUN ) finanzas[j].ciudad = sun[i].ciudad;
 }
}

finanzas = finanzas.filter(function(d) { if(d.ciudad) return d; });

for(var i in finanzas) {
  for(var k in finanzas[i]) {
    if( typeof(finanzas[i][k]) == "object" ) finanzas[i][k] = +finanzas[i][k]; 
  }
}

db.finanzas.drop();

finanzas.forEach(function(doc) {
  db.finanzas.insert(doc);
});
