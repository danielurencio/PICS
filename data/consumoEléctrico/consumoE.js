var conn = new Mongo();
var db = conn.getDB("PICS");

var consumo = db.getCollection("consumoE").find({
  'Tarifa': 'TOTAL',
  'Cve Mun': { '$ne':999 } },
 {'Cve Inegi':1,'Cve Mun':1,'Anual 2016':1,'_id':0}).toArray();

var consumo1 = [];
var array = [];
var sunXmunicipio = db.SUN.find({},{
 "Clave del municipio":1,
 "Número de registro en el Sistema Urbano Nacional 2010":1,
 "Tipo de ciudad":1,
 "_id":0,
 "Clave de la localidad":1,
 "Población total 2010":1,
 "Población total de la localidad 2010":1
}).toArray();

consumo.forEach(function(d,i) {
  var obj = {};
  obj['cveEnt'] = d['Cve Inegi'];
  obj['cveMun'] = d['Cve Mun'];
  obj['consumo promedio'] = String(d['Anual 2016']);

  if( String(obj.cveEnt).length == 1 ) obj.cveEnt = '0' + String(obj.cveEnt);
  if( String(obj.cveMun).length == 1 ) obj.cveMun = '00' + String(obj.cveMun);
  if( String(obj.cveMun).length == 2 ) obj.cveMun = '0' + String(obj.cveMun);
  if( String(obj.cveMun).length == 3 ) obj.cveMun = String(obj.cveMun);

  obj.cveMun = obj.cveEnt + obj.cveMun;
  obj.cveMun = +obj.cveMun;
  obj['consumo promedio'] = Number(obj['consumo promedio'].split(",").reduce(function sum(a,b) { return a + b; }));
  delete obj.cveEnt;


  consumo1.push(obj);
});

sunXmunicipio.forEach(function(d) {
 var obj = {};
 obj.cveMun = d['Clave del municipio'];
 obj.cveSUN = d['Número de registro en el Sistema Urbano Nacional 2010'];
 obj.tipo = d['Tipo de ciudad'];
 if(d['Clave de la localidad']) obj.loc = d['Clave de la localidad'];
 if(d['Población total 2010']) obj.pobMun = d['Población total 2010'];
 if(d['Población total de la localidad 2010']) obj.pobLoc = d['Población total de la localidad 2010'];

 array.push(obj);
});


var pobs = db.censo2010.find({'nom_loc':'Total del Municipio'},{entidad:1,mun:1,pobtot:1,_id:0,'nom_loc':1}).toArray();

pobs.forEach(function(d) {
  if( String(d.mun).length == 1 ) d.mun = "00" + d.mun;
  if( String(d.mun).length == 2 ) d.mun = "0" + d.mun;

  d.mun = Number( String(d.entidad) + String(d.mun) );
  delete d.entidad;
  delete d.nom_loc
  
});


for(var i in array) {
 for(var j in pobs) {
  if( array[i].pobLoc && array[i].cveMun == pobs[j].mun ) array[i].pobMun = pobs[j].pobtot;
 }
}


for(var i in array) {
 for(var j in consumo1) {
   if( array[i].cveMun == consumo1[j].cveMun ) array[i]['consumo promedio'] = consumo1[j]['consumo promedio'];
 }
}

array.forEach(function(d) {
  if(d.pobLoc) {
    d['pob %'] = d.pobLoc / d.pobMun;
    d['consumo ajustado'] = d['pob %'] * d['consumo promedio'];
  } else {
    d['pob %'] = d.pobMun / d.pobMun;
    d['consumo ajustado'] = d['pob %'] * d['consumo promedio'];
  }
});

/*
// Cotejar claves del SUN con todos los municipios
for(var i in sunXmunicipio) {
 for(var j in array) {

  if( sunXmunicipio[i]['Clave del municipio'] == array[j]['cveMun'] ) {
array[j]["cveSUN"] = sunXmunicipio[i]['Número de registro en el Sistema Urbano Nacional 2010']

  if(sunXmunicipio[i]['Clave de la localidad']) {
    array[j]['loc'] = sunXmunicipio[i]['Clave de la localidad'];  // se agregó localidad
    array[j]['pob'] = sunXmunicipio[i]['Población total de la localidad 2010'];
  }

  }
 }
}

*/
var centros = db.alexCentrosUrbanos.find({},{_id:1, ciudad:1}).toArray(); // son 53
var conurbaciones = db.alexConurbaciones.find({},{_id:1,ciudad:1}).toArray(); // son 23
var zm = db.SUNsocio.find({"Tipo de ciudad":1},
 {
  "Número de registro en el Sistema Urbano Nacional 2010":1,
  "Nombre de la ciudad":1,
  "_id":0
 }).toArray();

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



db.consumoE.drop();

array.forEach(function(doc) {
  db.consumoE.insert(doc);
});

array = db.consumoE.aggregate([
  { '$group': {
      '_id': { 'cveSUN':'$cveSUN', 'ciudad': '$ciudad' },
      'consumo promedio': { '$sum': '$consumo ajustado' }
  } },
  { '$project': {
      '_id': '$_id.cveSUN',
      'ciudad': '$_id.ciudad',
      'consumo promedio (enero a agosto de 2016)': '$consumo promedio'
  } }
]).toArray();;


db.consumoE.drop();

array.forEach(function(doc) {
  db.consumoE.insert(doc);
