var conn = new Mongo();
var db = conn.getDB("PICS");

function clean() {
  db.getCollection('ce14').updateMany({},{ $unset: { field24:1, field25:1, field26:1, field27:1, field28:1, field29:1, field30:1, field31:1, field32:1, field33:1, field34:1, field35:1, field36:1, field37:1, field38:1, field39:1 } });

 print("Se limpiaron los campos innecesarios.");

 var ents = db.getCollection('ce14').find().toArray();
 var muns = db.getCollection('ce14').find({ 'Municipio': { '$ne':'' } }).toArray();
// var entsObj = { "nombre": "Entidad federativa", 'clave':'cveEntidad' };
// var munsObj = { "nombre": "Municipio", "clave": "cveMunicipio" };

 var bulk = db.getCollection('ce14').initializeUnorderedBulkOp();

// function Keys(C,k,bulk) {
  ents.forEach(function(d) {
   var id = d._id;
   var entidad = d['Entidad federativa'].split(" ");
   var cveEnt = entidad.splice(0,1);

   for(var i in entidad) {
    if( i != entidad.length - 1 ) {
     entidad[i] = entidad[i] + " ";
    }
   };

   var nombreEnt = entidad.reduce(function sum(a,b) { return a + b; });
   
   bulk.find({ '_id':id }).update({ '$set': {
	'Entidad federativa':nombreEnt,
	'cveEntidad':cveEnt[0]
   } });
 
   });
// }
  print("Se añadieron las entidades al 'bulk'.");

  muns.forEach(function(d) {
   var id = d._id;
   var entidad = d['Municipio'].split(" ");
   var cveEnt = entidad.splice(0,1);

   for(var i in entidad) {
    if( i != entidad.length - 1 ) {
     entidad[i] = entidad[i] + " ";
    }
   };

   var nombreEnt = entidad.reduce(function sum(a,b) { return a + b; });
   
   bulk.find({ '_id':id }).update({ '$set': {
	'Municipio':nombreEnt,
	'cveMunicipio':cveEnt[0]
   } });
 
   });

   print("Se añadieron los municipios al 'bulk'.");

   bulk.execute();
   print(bulk);
   print("Terminó el bulk!");
};

var P =  {
 'sectores': ['','Sector 11','Sector 21','Sector 22','Sector 23','Sector 31-33','Sector 43-46','Sector 48-49','Sector 51','Sector 52','Sector 53','Sector 54','Sector 55','Sector 56','Sector 61','Sector 62','Sector 71','Sector 72','Sector 81','Sector 93'],
 'entidades': ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32']
};


P.municipal = function(sector) {

 var prodTotal = db.getCollection("ce14").aggregate([
  { '$match': {
     'Municipio': { '$ne': '' },
     'Sector': sector,
     'Subsector':''
  } },
  { '$project': {
    'Producción bruta total': 1,
    'Municipio': 1,
    'Entidad federativa': 1,
    'cveEntidad': 1,
    'cveMunicipio': 1,
    '_id': 0
  } },
  { '$group': {
     '_id': { 'entidad':'$Entidad federativa', 'cveEnt':'$cveEntidad' },
     'Municipios': { '$addToSet': {
      'municipio':'$Municipio',
      'cveMun': '$cveMunicipio',
      'PBT':'$Producción bruta total' 
     } }
  } }
 ]).toArray();

 return prodTotal;
};

P.nacional = function(sector) {
 var prodNacional = db.getCollection("ce14").aggregate([
  { '$match': {
      'Entidad federativa':'Nal',
      //'Sector': sector,
      'Subsector':''
  } },
  { '$project': {
     'Producción bruta total':1,
     'Sector':1,
     '_id':0
  } }
 ]).toArray();

 return prodNacional;
};

var nacional = P.nacional();
var total = nacional.splice(0,1);
total = total[0]['Producción bruta total'];
nacional.forEach(function(d) { 
  d['Producción bruta total'] = (d['Producción bruta total'] / total) * 100; 
});

var cotejar = function(sectores,entidades) {
 var obj = {};
 var array = [];
 sectores.forEach(function(sector) {   // Para cada uno de los sectores ..
  print(sector); obj[sector] = {};

  if(sector != '') {  			// ... si no es el agregado nacional...
  entidades.forEach(function(entidad) {  // ... chechar cada una de las entidades...
   print(entidad); obj[sector][entidad] = [];

   var sectorEnt = P.municipal(sector).filter(function(ent) {
    return ent._id.cveEnt == entidad;
   })[0]

 if(sectorEnt != undefined) {

  sectorEnt = sectorEnt.Municipios;

   var sectorTotal = P.municipal('').filter(function(ent) { return ent._id.cveEnt == entidad; })[0].Municipios;

// if(sectorEnt != undefined) {
  sectorEnt.forEach(function(s) {
   sectorTotal.forEach(function(t) {

    if(s.cveMun == t.cveMun) {
      //print(s.cveMun)
// obj[sector][entidad].push(
      db.CLS.insert({
       sector:sector,
       entidad:entidad,
       municipio:s['municipio'],
       cve:s['cveMun'],
       //c1:(s['PBT']/t['PBT'])*100 
	PBTTotal:t['PBT'],
	PBTSector:s['PBT']
      });
    }

   });

  });

 }

  });
  };
 });

 return obj;
};

/*  AGREGAR A CADA REGISTRO EL PORCENTAJE NACIONAL DEL SECTOR CORRESPONDIENTE
for(var i in nacional) {
  db.CLS.updateMany({ sector: nacional[i]['Sector'] },{
   $set: { c2: nacional[i]['Producción bruta total'] }});
}
*/


// Obtener el la clave del SUN de cada Municipio.
//var sun = db.SUN.aggregate([ { $project: { cveSUN: "$Número de registro en el Sistema Urbano Nacional 2010", cveMun: "$Clave del municipio", _id:0 } } ]).toArray();


// CREAR UNA NUEVA COLECCIÓN CON LOS COEFICIENTES DE LOCALIZACIÓN SIMPLE
//db.CLS.aggregate([ { $project: { _id:1, sector:1, entidad:1, municipio:1, cve:1, c1:1, c2:1, CLS: { $divide: ["$c1","$c2"] } } }, {$out: "cls"} ])


/*

var a = db.cls.find().toArray();
a.forEach(function(d) { d['cve'] = +d['cve']; });

var sun = db.SUN.aggregate([ { $project: { cveSUN: "$Número de registro en el Sistema Urbano Nacional 2010", cveMun: "$Clave del municipio", _id:0 } } ]).toArray();

for(var i in a) {
  for(var j in sun) {
    if( a[i]['cve'] == sun[j]['cveMun'] ) a[i]['sun'] = sun[j]['cveSUN'];
  } 
}

*/


// AGRUPAR POR MUNICIPIO
//

var b = db.cls.aggregate([
{ "$group": { "_id": 
 { "municipio":"$municipio", "cve":"$cve", "sun":"$sun", "PBT":"$PBTTotal" },
   "sectores": { "$addToSet": {
    "sector": "$sector",
    "PBTSector": "$PBTSector",
    "c2":"$c2" } 
   } 
  }},
{ "$project": {
 "_id": "$_id.cve",
 "municipio": "$_id.municipio",
 "sun": "$_id.sun",
 "PBT": "$_id.PBT",
 "sectores": 1
} }
]).pretty().toArray();


for(var i in b) {
 for(var j in b[i].sectores) {
  b[i][ b[i].sectores[j].sector ] = {
   "PBT": b[i].sectores[j].PBTSector,
   "CN": b[i].sectores[j].c2
  }
 }


 delete b[i].sectores;
}

db.CLS.drop()

b.forEach(function(doc) {
 db.CLS.insert(doc);
});


var c = db.CLS.aggregate([
 { "$group": { _id:"$sun",
   "municipios": {$sum:1},
   "PBT": { "$sum": "$PBT" },
   "Sector 11": { "$sum": "$Sector 11.PBT" },
   "Sector 21": { "$sum": "$Sector 21.PBT" },
   "Sector 22": { "$sum": "$Sector 22.PBT" },
   "Sector 23": { "$sum": "$Sector 23.PBT" },
   "Sector 31-33": { "$sum": "$Sector 31-33.PBT" },
   "Sector 43-46": { "$sum": "$Sector 43-46.PBT" },
   "Sector 48-49": { "$sum": "$Sector 48-49.PBT" },
   "Sector 51": { "$sum": "$Sector 51.PBT" },
   "Sector 52": { "$sum": "$Sector 52.PBT" },
   "Sector 53": { "$sum": "$Sector 53.PBT" },
   "Sector 54": { "$sum": "$Sector 54.PBT" },
   "Sector 55": { "$sum": "$Sector 55.PBT" },
   "Sector 56": { "$sum": "$Sector 56.PBT" },
   "Sector 61": { "$sum": "$Sector 61.PBT" },
   "Sector 62": { "$sum": "$Sector 62.PBT" },
   "Sector 71": { "$sum": "$Sector 71.PBT" },
   "Sector 72": { "$sum": "$Sector 72.PBT" },
   "Sector 81": { "$sum": "$Sector 81.PBT" },
   "Sector 93": { "$sum": "$Sector 93.PBT" },

 } }
]).toArray();

var CN = [];
nacional.forEach(function(d) {
  var obj = {};
  obj[d['Sector']] = d['Producción bruta total']; CN.push(obj);
});


for(var e in c) {
 for(var i in c[e]) {
  for(var j in nacional) {
    if( i == nacional[j].Sector ) { 
      //print(i, nacional[j].Sector);
      c[e][i + " (%)"] = ( c[e][i] / c[e].PBT ) * 100;
      c[e][i + " (CLS)"] = ( ( c[e][i] / c[e].PBT ) ) * 100 / nacional[j]['Producción bruta total'];
     } 
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

// Se encuentran sólo 50 de 53 centros urbanos
for(var i in centros) {
 for(var j in c) {
  if( centros[i]._id == c[j]._id ) {
   c[j].ciudad = centros[i].ciudad; 
   c[j].sun = "centro urbano";
  }
 }
}

// Se encuenran sólo 19 de 23 conurbaciones
for(var i in conurbaciones) {
 for(var j in c) {
  if( conurbaciones[i]._id == c[j]._id ) {
   c[j].ciudad = conurbaciones[i].ciudad; 
   c[j].sun = "conurbación";
  }
 }
}

// Se encuenran 59 de 59 conurbaciones
for(var i in ZM) {
 for(var j in c) {
  if( ZM[i]._id == c[j]._id ) {
   c[j].ciudad = ZM[i].ciudad; 
   c[j].sun = "zona metropolitana";
  }
 }
}


c = c.filter(function(d) { if(d.sun) return d; });
