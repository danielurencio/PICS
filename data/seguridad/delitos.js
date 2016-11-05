var conn = new Mongo();
var db = conn.getDB("PICS");

var delitos = db.getCollection("delitos").find().toArray();
db.delitos.drop();

delitos.forEach(function(doc) {
 doc._id = String(doc._id);
// doc['Daño en las cosas'] = doc['Da�o en las cosas'];
// delete doc['Da�o en las cosas'];
 db.delitos.insert(doc);
});

delitos = db.delitos.find({
  '$where': '(this._id.length > 2)',
   '$and': [
    { 'Nombre': { '$ne':'Otros estados' } },
    { 'Nombre': { '$ne':'No especificado' } },
    { 'Nombre': { '$ne':'Otros municipios' } }
   ] 
}).toArray();

delitos.forEach(function(d) {
  d._id = +d._id;
});

var sunXmunicipio = db.SUN.find({},{"Clave del municipio":1,"Número de registro en el Sistema Urbano Nacional 2010":1,"_id":0}).toArray();

// Cotejar claves del SUN con todos los municipios
for(var i in sunXmunicipio) {
 for(var j in delitos) {
  if( sunXmunicipio[i]['Clave del municipio'] == delitos[j]['_id'] ) {

delitos[j]["cveSUN"] = sunXmunicipio[i]['Número de registro en el Sistema Urbano Nacional 2010']

  }
 }
}

delitos = delitos.filter(function(d) { if(d.cveSUN) return d; });


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
 for(var j in delitos) {
  if( sun[i]._id == delitos[j].cveSUN ) delitos[j].ciudad = sun[i].ciudad;
 }
}

delitos = delitos.filter(function(d) { if(d.ciudad) return d; });

db.delitos.drop();

delitos.forEach(function(doc) {
  db.delitos.insert(doc);
});


delitos = db.delitos.aggregate([
 { '$group': {
    '_id': { 'cveSUN':'$cveSUN', 'ciudad':'$ciudad' },
    'Total delitos': { '$sum':'$Total delitos' },
    'Daño en las cosas': { '$sum':'$Daño en las cosas' },
    'Delitos sexuales': { '$sum':'$Delitos sexuales' },
    'Homicidio': { '$sum':'$Homicidio' },
    'Lesiones': { '$sum':'$Lesiones' },
    'Robo': { '$sum':'$Robo' },
    'Otros delitos': { '$sum':'$Otros delitos' }
 } },
 { '$project': {
    '_id': '$_id.cveSUN',
    'ciudad': '$_id.ciudad',
    'Total delitos':1,
    'Daño en las cosas':1,
    'Delitos sexuales':1,
    'Homicidio':1,
    'Lesiones':1,
    'Robo':1,
    'Otros delitos':1
 } }
]).toArray();


delitos.forEach(function(d) {

  if( d['Total delitos'] != 0 ) {
   for(var i in d) {
     if( i != '_id' && i != 'ciudad' && i != 'Total delitos') {
       d[i + ' (%)'] = ( d[i] / d['Total delitos'] ) * 100;
       delete d[i];
     }
   }
  }

 if( d['Total delitos'] == 0 ) {
  d['Total delitos'] = "ND";
  for(var i in d) {
     if( i != '_id' && i != 'ciudad' && i != 'Total delitos') {
       d[i + ' (%)'] = "ND";
       delete d[i];
     }
   }
 }

});

db.delitos.drop();

delitos.forEach(function(doc) {
  db.delitos.insert(doc);
});
