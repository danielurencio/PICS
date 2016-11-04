var conn = new Mongo();
var db = conn.getDB("PICS");
/*
var array1 = [];

var consumo1 = db.getCollection("consumoE").aggregate([
 { '$match': {
     'Tarifa': 'TOTAL',
     'Cve Mun': { '$ne': 999 }
 } },
 { '$project': {
      'Cve Inegi':1,
      'Cve Mun':1,
      'Enero':1,
      'Febrero':1,
      'Marzo':1,
      'Abril':1,
      'Junio':1,
      'Julio':1,
      'Agosto':1,
 } }
]).toArray();

 

consumo1.forEach(function(d) {
  var obj = {};
  for(var i in d) {
    d[i] = String(d[i]);
    d[i] = 
  }

  obj['cveEnt'] = d['Cve Inegi'];
  obj['cveMun'] = d['Cve Mun'];

});
*/

var consumo = db.getCollection("consumoE").find({ 'Tarifa': 'TOTAL', 'Cve Mun': { '$ne':999 } },{'Cve Inegi':1,'Cve Mun':1,'Anual 2016':1,'_id':0}).toArray();
var array = [];
var sunXmunicipio = db.SUN.find({},{"Clave del municipio":1,"Número de registro en el Sistema Urbano Nacional 2010":1,"_id":0}).toArray();

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

//  print(i,obj['cveMun'], obj['consumo promedio']);

  array.push(obj);
});

// Cotejar claves del SUN con todos los municipios
for(var i in sunXmunicipio) {
 for(var j in array) {
  if( sunXmunicipio[i]['Clave del municipio'] == array[j]['cveMun'] ) {

array[j]["cveSUN"] = sunXmunicipio[i]['Número de registro en el Sistema Urbano Nacional 2010']

  }
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



db.consumoE.drop();

array.forEach(function(doc) {
  db.consumoE.insert(doc);
});

array = db.consumoE.aggregate([
  { '$group': {
      '_id': { 'cveSUN':'$cveSUN', 'ciudad': '$ciudad' },
      'consumo promedio': { '$avg': '$consumo promedio' }
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
});
