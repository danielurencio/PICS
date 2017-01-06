var conn = new Mongo();
var db = conn.getDB('PICS');
var count = db.vulYres.find().count();

if(count != 480) {
var sunXmunicipio = db.SUN.find({},{"Clave del municipio":1,"Número de registro en el Sistema Urbano Nacional 2010":1,"_id":0}).toArray();

sunXmunicipio.forEach(function(d) {
  d.cveSUN = d['Número de registro en el Sistema Urbano Nacional 2010'];
  delete d['Número de registro en el Sistema Urbano Nacional 2010'];

  d.cveMun = d['Clave del municipio'];
  delete d['Clave del municipio'];
});

var cenapred = db.vulYres.find().toArray();

for(var i in sunXmunicipio) {
 for(var j in cenapred) {
  if( sunXmunicipio[i]['cveMun'] == cenapred[j]['cveMun'] ) {

//   cenapred[j]["cveSUN"] = sunXmunicipio[i]['cveSUN'];
sunXmunicipio[i]['grado de vulnerabilidad social'] = cenapred[j]['grado de vulnerabilidad social'];
sunXmunicipio[i]['resiliencia'] = cenapred[j]['resiliencia'];
  }
 }
}

var cenapred = sunXmunicipio;
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
  if( sun[i]._id == cenapred[j].cveSUN ) {
    cenapred[j].ciudad = sun[i].ciudad;
    sun[i].is = true
  }
 }
}

cenapred = cenapred.filter(function(d) { if(d.ciudad) return d; });
db.vulYres.drop();
db.vulYres.insert(cenapred);
}

var cenapred = db.vulYres.aggregate([
  { '$group': {
     '_id':{ 'cveSUN':'$cveSUN', 'ciudad':'$ciudad' },
     'vulnerabilidad social': { '$push': "$grado de vulnerabilidad social"},//{ 'mun':'$cveMun','grado':'$grado de vulnerabilidad social' } },
     'resiliencia': { '$push': "$resiliencia"}//{ 'mun':'$cveMun','grado':'$resiliencia' } },

  } },
  { "$project": {
     "cveSUN":"$_id.cveSUN",
     "ciudad":"$_id.ciudad",
     "vulnerabilidad social":1,
     "resiliencia":1,
     "_id":0,
     
  } },
  { '$unwind':"$resiliencia" },
//  { '$unwind':"$vulnerabilidad social" },
  { '$group': {
     '_id': { 'cveSUN':'$cveSUN', 'ciudad':'$ciudad', "vulnerabilidad social":"$vulnerabilidad social" },
     'Muy alta resiliencia': {
	"$sum": { "$cond": [ { "$eq": [ "$resiliencia", "Muy alto" ] },1,0 ] }
     },
     'Alta resiliencia': {
	"$sum": { "$cond": [ { "$eq": [ "$resiliencia", "Alto" ] },1,0 ] }
     },
     'Media resiliencia': {
	"$sum": { "$cond": [ { "$eq": [ "$resiliencia", "Medio" ] },1,0 ] }
     },
     'Baja resiliencia': {
	"$sum": { "$cond": [ { "$eq": [ "$resiliencia", "Bajo" ] },1,0 ] }
     },
     'Muy baja resiliencia': {
	"$sum": { "$cond": [ { "$eq": [ "$resiliencia", "Muy bajo" ] },1,0 ] }
     }
  } },
  { '$project': {
     "cveSUN":"$_id.cveSUN",
     "ciudad":"$_id.ciudad",
     "vulnerabilidad social":"$_id.vulnerabilidad social",
     "_id":0,
     "resiliencia":  [
      { "Muy alta":"$Muy alta resiliencia" },
      { "Alta":"$Alta resiliencia" },
      { "Media":"$Media resiliencia" },
      { "Baja":"$Baja resiliencia" },
      { "Muy Baja":"$Muy baja resiliencia" }
    ]
  } },
  { '$unwind':'$vulnerabilidad social' },
  { '$group': {
     '_id': { 'cveSUN':'$cveSUN', 'ciudad':'$ciudad', "resiliencia":"$resiliencia" },
     'Muy alta vulnerabilidad': {
	"$sum": { "$cond": [ { "$eq": [ "$vulnerabilidad social", "Muy alto" ] },1,0 ] }
     },
     'Alta vulnerabilidad': {
	"$sum": { "$cond": [ { "$eq": [ "$vulnerabilidad social", "Alto" ] },1,0 ] }
     },
     'Media vulnerabilidad': {
	"$sum": { "$cond": [ { "$eq": [ "$vulnerabilidad social", "Medio" ] },1,0 ] }
     },
     'Baja vulnerabilidad': {
	"$sum": { "$cond": [ { "$eq": [ "$vulnerabilidad social", "Bajo" ] },1,0 ] }
     },
     'Muy baja vulnerabilidad': {
	"$sum": { "$cond": [ { "$eq": [ "$vulnerabilidad social", "Muy bajo" ] },1,0 ] }
     }
  } },
  { '$project': {
     "cveSUN":"$_id.cveSUN",
     "ciudad":"$_id.ciudad",
     "resiliencia":"$_id.resiliencia",
     "_id":0,
     "vulnerabilidad social":  [
      { "Muy alta":"$Muy alta vulnerabilidad" },
      { "Alta":"$Alta vulnerabilidad" },
      { "Media":"$Media vulnerabilidad" },
      { "Baja":"$Baja vulnerabilidad" },
      { "Muy Baja":"$Muy baja vulnerabilidad" }
    ]
  } }
]).toArray();


cenapred.forEach(function(d) {
 var obj = ["resiliencia","vulnerabilidad social"];

 for(var j in obj) {
    var a, b;

    for(var i in d[obj[j]]) {
      var k = Object.keys(d[obj[j]][i])[0];

      if( i == 0 ) { a = k; b = d[obj[j]][i][k] }
      else {
       if ( d[obj[j]][i][k] > b ) { b = d[obj[j]][i][k]; a = k; }
       else if ( d[obj[j]][i][k] == b ) { a += "/" + k; }
      }

    }

    d[obj[j]] = a;
 }


});
