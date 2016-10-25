var conn = new Mongo();
var db = conn.getDB("PICS");

var principal = db.getCollection("SUNsocio").find({
  "Población total 2010":{ $lte:20116842, $gte:50000 }},
  {"Nombre de la ciudad":1,
   "_id":0,
   "Tipo de ciudad":1,
   "Número de registro en el Sistema Urbano Nacional 2010":1
}).toArray();



// Ciudades tipo 2
var dos = db.getCollection("SUN").aggregate([
 { $match: { "Tipo de ciudad": 2 } },
 { $group: {
    _id: { "num": "$Número de registro en el Sistema Urbano Nacional 2010",
    ciudad: "$Nombre de la ciudad (conurbación)"},
    entidades: { $addToSet: "$Nombre de la entidad federativa" },
    municipios: { $addToSet: "$Nombre del municipio" },
    localidades: { $addToSet: "$Nombre de la localidad" } } },
 { $project: {
    "_id": "$_id.num",
    "ciudad": "$_id.ciudad",
    "entidades":1,
    "municipios": { $size: "$municipios" },
    "localidades": { $size: "$localidades" }
 } }
]).toArray();

dos.forEach(function(d) {
  if( d.entidades.length == 2 ) {
    d.entidades[0] = d.entidades[0] + " / ";
    d.entidades = d.entidades.reduce(function sum(a,b) { return a + b; });
  }

  if( d.entidades.length == 1 ) d.entidades = d.entidades[0];
});

principal.forEach(function(d) {
  dos.forEach(function(j) {
    if(d['Número de registro en el Sistema Urbano Nacional 2010'] == j._id) {
      j.sun = true;
    }
  });
});

dos = dos.filter(function(d) { return d.sun == true });


//Ciudades tipo 3
var tres = db.getCollection("SUN").aggregate([
  { $match: { "Tipo de ciudad": 3 } },
  { $group: {
     _id: {
     "num": "$Número de registro en el Sistema Urbano Nacional 2010",
     ciudad: "$Nombre de la ciudad (localidad)"},
     entidades: { $addToSet: "$Nombre de la entidad federativa" },
     municipios: { $addToSet: "$Nombre del municipio" },
     localidades: { $addToSet: "$Nombre de la localidad" } } },
  { $project: {
     "_id": "$_id.num",
     "ciudad": "$_id.ciudad",
     "entidades":1,
     "municipios": { $size: "$municipios" },
     "localidades": { $size: "$localidades" }  
  } }
]).toArray();

tres.forEach(function(d) {
  d.entidades = d.entidades[0];
  d.localidades = 1;
});

principal.forEach(function(d) {
  tres.forEach(function(j) {
    if(d['Número de registro en el Sistema Urbano Nacional 2010'] == j._id) {
      j.sun = true;
    }
  });
});

tres = tres.filter(function(d) { return d.sun == true });


// Añadir a collección
function addCollections() {
  dos.forEach(function(d) {
    db.getCollection("alexConurbaciones").insert(d);
  });

  tres.forEach(function(d) {
    db.getCollection("alexCentrosUrbanos").insert(d);
  });
};
