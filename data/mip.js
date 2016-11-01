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
 'sectores': ['','Sector 11','Sector 21','Sector 22','Sector 23','Sector 31-33','Sector 43-46','Sector 48-49','Sector 51','Sector 52','Sector 53','Sector 54','Sector 55','Sector 56','Sector 61','Sector 62','Sector 71','Sector 72','Sector 81','Sector 93']
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
