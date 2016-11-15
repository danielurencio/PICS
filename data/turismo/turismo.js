var conn = new Mongo();
var db = conn.getDB("PICS");

var array = [];
/////PUSE UN ERROR A PROPÓSITO PARA RECORDAR QUE TENGO QUE LLENAR LAS CLAVES PARA CADA ENTIDAD!!
error var claves = [
{ 'ent':'', 'cve':1 },
{ 'ent':'', 'cve':2 },
{ 'ent':'', 'cve':3 },
{ 'ent':'', 'cve':4 },
{ 'ent':'', 'cve':5 },
{ 'ent':'', 'cve':6 },
{ 'ent':'', 'cve':7 },
{ 'ent':'', 'cve':8 },
{ 'ent':'', 'cve':9 },
{ 'ent':'', 'cve':10 },
{ 'ent':'', 'cve':11 },
{ 'ent':'', 'cve':12 },
{ 'ent':'', 'cve':13 },
{ 'ent':'', 'cve':14 },
{ 'ent':'', 'cve':15 },
{ 'ent':'', 'cve':16 },
{ 'ent':'', 'cve':17 },
{ 'ent':'', 'cve':18 },
{ 'ent':'', 'cve':19 },
{ 'ent':'', 'cve':20 },
{ 'ent':'', 'cve':21 },
{ 'ent':'', 'cve':22 },
{ 'ent':'', 'cve':23 },
{ 'ent':'', 'cve':24 },
{ 'ent':'', 'cve':25 },
{ 'ent':'', 'cve':26 },
{ 'ent':'', 'cve':27 },
{ 'ent':'', 'cve':28 },
{ 'ent':'', 'cve':29 },
{ 'ent':'', 'cve':30 },
{ 'ent':'', 'cve':31 },
{ 'ent':'', 'cve':32 },
];

db.SUN.find({}, { "Nombre del municipio":1, "Clave del municipio":1, "Número de registro en el Sistema Urbano Nacional 2010":1,"_id":0,"Clave de la localidad":1,"Clave de la entidad federativa":1 }).toArray().forEach(function(d) {
 var obj = {};
 obj.mun = d['Nombre del municipio'];
 obj.cveEnt = d['Clave de la entidad federativa'];
 obj.cveMun = d['Clave del municipio'];
 obj.cveSUN = d['Número de registro en el Sistema Urbano Nacional 2010'];
 if( d['Clave de la localidad'] ) obj.loc = d['Clave de la localidad'];
 array.push(obj);
});

var cuartos = db.turismoCuartos.find({},{_id:0}).toArray();
var establecimientos = db.turismoEstablecimientos.find({},{_id:0}).toArray();

for(var i in array) {
 for(var j in cuartos) {
  if( array[i].mun == cuartos[j].mun ) array[i].cuartos = cuartos[j].cuartos;
 }
}


for(var i in array) {
 for(var j in establecimientos) {
  if( array[i].mun == establecimientos[j].mun ) array[i].establecimientos = establecimientos[j].establecimientos;
 }
}


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
 for(var j in array) {
  if( sun[i]._id == array[j].cveSUN ) array[j].ciudad = sun[i].ciudad;
 }
}

array = array.filter(function(d) { if(d.ciudad) return d; });


array.forEach(function(d) { db.turismo.insert(d); });

var t = db.turismo.aggregate([
// { $match: { "loc": { $exists:true} } },
 { $group: {
    _id: { cveSUN: "$cveSUN", ciudad: "$ciudad" },
    locs: { $addToSet:"$loc" },
    cuartos: { $addToSet: "$cuartos" },
    establecimientos: { $addToSet: "$establecimientos" },
    muns: { $push: "$cveMun"  }
 } },
 { $project: {
    _id: "$_id.cveSUN",
    ciudad: "$_id.ciudad",
    cuartos: { "$sum":"$cuartos" },
    establecimientos: { "$sum":"$establecimientos" },
    muns: 1
//    locs:1
 } }
]).toArray();

db.turismo.drop();

