var conn = new Mongo();
var db = conn.getDB("PICS");

var array = [];
/////PUSE UN ERROR A PROPÓSITO PARA RECORDAR QUE TENGO QUE LLENAR LAS CLAVES PARA CADA ENTIDAD!!
 var claves = [
{ 'ent':'AGS', 'cve':1 },
{ 'ent':'BC', 'cve':2 },
{ 'ent':'BCS', 'cve':3 },
{ 'ent':'CAM', 'cve':4 },
{ 'ent':'COAH', 'cve':5 },
{ 'ent':'COL', 'cve':6 },
{ 'ent':'CHIS', 'cve':7 },
{ 'ent':'CHIH', 'cve':8 },
{ 'ent':'CDMX', 'cve':9 },
{ 'ent':'DGO', 'cve':10 },
{ 'ent':'GTO', 'cve':11 },
{ 'ent':'GRO', 'cve':12 },
{ 'ent':'HGO', 'cve':13 },
{ 'ent':'JAL', 'cve':14 },
{ 'ent':'MEX', 'cve':15 },
{ 'ent':'MICH', 'cve':16 },
{ 'ent':'MOR', 'cve':17 },
{ 'ent':'NAY', 'cve':18 },
{ 'ent':'NL', 'cve':19 },
{ 'ent':'OAX', 'cve':20 },
{ 'ent':'PUE', 'cve':21 },
{ 'ent':'QRO', 'cve':22 },
{ 'ent':'QROO', 'cve':23 },
{ 'ent':'SLP', 'cve':24 },
{ 'ent':'SIN', 'cve':25 },
{ 'ent':'SON', 'cve':26 },
{ 'ent':'TAB', 'cve':27 },
{ 'ent':'TAMS', 'cve':28 },
{ 'ent':'TLAX', 'cve':29 },
{ 'ent':'VER', 'cve':30 },
{ 'ent':'YUC', 'cve':31 },
{ 'ent':'ZAC', 'cve':32 },
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

/// CLAVES PARA CUARTOS...
for(var i in cuartos) {
 for(var j in claves) {
  if ( cuartos[i].ent == claves[j].ent ) cuartos[i].cve = claves[j].cve;
 }
}

/// CLAVES PARA ESTABLECIMIENTOS...
for(var i in establecimientos) {
 for(var j in claves) {
  if ( establecimientos[i].ent == claves[j].ent ) establecimientos[i].cve = claves[j].cve;
 }
}

for(var i in array) {
 for(var j in cuartos) {
  if( array[i].mun == cuartos[j].mun && array[i].cveEnt == cuartos[j].cve ) array[i].cuartos = cuartos[j].cuartos;
 }
}


for(var i in array) {
 for(var j in establecimientos) {
  if( array[i].mun == establecimientos[j].mun && array[i].cveEnt == establecimientos[j].cve ) array[i].establecimientos = establecimientos[j].establecimientos;
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

