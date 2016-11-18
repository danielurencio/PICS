var conn = new Mongo();
var db = conn.getDB("PICS");

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

var array = [];
var array1 = [];
var array2 = []; // llegadas sólo municipios
var aaa = [];

var SUNLIST = db.SUN.find({}, { "Nombre del municipio":1, "Clave del municipio":1, "Número de registro en el Sistema Urbano Nacional 2010":1,"_id":0,"Clave de la localidad":1,"Clave de la entidad federativa":1 }).toArray()


var SUNLIST1 = db.SUN.find({}, { "Nombre del municipio":1, "Clave del municipio":1, "Número de registro en el Sistema Urbano Nacional 2010":1,"_id":0,"Clave de la localidad":1,"Clave de la entidad federativa":1 }).toArray()

var SUNLIST2 = db.SUN.find({}, { "Nombre del municipio":1, "Clave del municipio":1, "Número de registro en el Sistema Urbano Nacional 2010":1,"_id":0,"Clave de la localidad":1,"Clave de la entidad federativa":1 }).toArray()

SUNLIST.forEach(function(d) {
 var obj = {};
 obj.mun = d['Nombre del municipio'];
 obj.cveEnt = d['Clave de la entidad federativa'];
 obj.cveMun = d['Clave del municipio'];
 obj.cveSUN = d['Número de registro en el Sistema Urbano Nacional 2010'];
 if( d['Clave de la localidad'] ) obj.loc = d['Clave de la localidad'];
 array.push(obj);
 //array1.push(obj);
// array2.push(obj);
 //aaa.push(obj);
});

SUNLIST1.forEach(function(d) {
 var obj = {};
 obj.mun = d['Nombre del municipio'];
 obj.cveEnt = d['Clave de la entidad federativa'];
 obj.cveMun = d['Clave del municipio'];
 obj.cveSUN = d['Número de registro en el Sistema Urbano Nacional 2010'];
 if( d['Clave de la localidad'] ) obj.loc = d['Clave de la localidad'];
// array.push(obj);
 array1.push(obj);
// array2.push(obj);
 //aaa.push(obj);
});


SUNLIST2.forEach(function(d) {
 var obj = {};
 obj.mun = d['Nombre del municipio'];
 obj.cveEnt = d['Clave de la entidad federativa'];
 obj.cveMun = d['Clave del municipio'];
 obj.cveSUN = d['Número de registro en el Sistema Urbano Nacional 2010'];
 if( d['Clave de la localidad'] ) obj.loc = d['Clave de la localidad'];
// array.push(obj);
 //array1.push(obj);
 array2.push(obj);
 //aaa.push(obj);
});

var ocupa = db.turismoOcupa.find({},{ '_id':0 }).toArray();
var cens = db.cens.find({},{ '_id':0 }).toArray();
var llegadas = db.llegadas.find({},{ '_id':0 }).toArray();

var j;
ocupa.forEach(function(d,i) {
 if( d['centro turístico'] == "Ciudad Juárez" ) j=i;
});
ocupa[j]['centro turístico'] = "Juárez";

/// CLAVES PARA OCUPAS...
for(var i in ocupa) {
 for(var j in claves) {
  if ( ocupa[i].ent == claves[j].ent ) ocupa[i].cve = claves[j].cve;
 }
}

/// CLAVES PARA CENS...
for(var i in cens) {
 for(var j in claves) {
  if ( cens[i].ent == claves[j].ent ) cens[i].cve = claves[j].cve;
 }
}

/// CLAVES PARA LLEGADAS...
for(var i in llegadas) {
 for(var j in claves) {
  if ( llegadas[i].ent == claves[j].ent ) llegadas[i].cve = claves[j].cve;
 }
}


for(var i in array) {
 for(var j in cens) {
  if( array[i].mun == cens[j].mun && array[i].cveEnt == cens[j].cve ) {
    array[i]['ocupación hotelera (%)'] = cens[j]['ocupación hotelera (%)'];
    array[i]['estadía promedio (noches por turista)'] = cens[j]['estadía promedio (noches por turista)'];
  }
 }
}

array = array.filter(function(d) { return d['ocupación hotelera (%)'] });

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


// Cotejar claves del componente principal con todos los municipios
for(var i in sun) {
 for(var j in array1) {
  if( sun[i]._id == array1[j].cveSUN ) array1[j].ciudad = sun[i].ciudad;
 }
}

// Cotejar claves del componente principal con todos los municipios
for(var i in sun) {
 for(var j in array2) {
  if( sun[i]._id == array2[j].cveSUN ) array2[j].ciudad = sun[i].ciudad;
 }
}

array = array.filter(function(d) { return d.ciudad; });
array1 = array1.filter(function(d) { return d.ciudad; });
array2 = array2.filter(function(d) { return d.ciudad; });

array.forEach(function(d) {
 db.turismo.insert(d);
});

var CENS = db.turismo.aggregate([
 { '$group': {
     '_id': { 'cveSUN': '$cveSUN', 'ciudad':'$ciudad' },
     'ocupación hotelera (%)': { '$addToSet':'$ocupación hotelera (%)' },
     'estadía promedio (noches por turista)': { '$addToSet':'$estadía promedio (noches por turista)' }
 } },
 { '$project': {
      '_id':'$_id.cveSUN',
      'ciudad':'$_id.ciudad',
      'ocupación hotelera (%)': { '$avg':'$ocupación hotelera (%)' },
      'estadía promedio (noches por turista)': { '$avg':'$estadía promedio (noches por turista)' }
 } }
]).toArray();

var comparten = db.turismo.aggregate([
 { $group: {
   _id: "$cveMun",
   ciudades: { "$addToSet":"$ciudad" }
 } }
]).toArray();

db.turismo.drop();

///////////////////////////////////////////////////////////////////////////////////////////////
// Para corroborar si cada uno de los centros turísticos corresponde a una zona metropolitana,
// conurbación, localidad o municipio hay que checar uno por uno dentro de cada una de las
// categorías. Si existe el cotejo entre un 'ocupa' y cualquiera de las categorías anterior-
// mente mencionadas se le pondrá una etiqueta al 'ocupa' para resaltar esta distinción.
/////////////////////////////////////////////////////////////////////////////////////////////
/*
// 1). Primero hay que checar nombres inusuales.
//Zona Corredor Los Cabos
var corredor = ocupa.filter(function(d) {
 return d['centro turístico'] == 'Zona Corredor Los Cabos'
});
// En la ciudad de México el nombre del centro turístico es 'Total'
var cdmx = ocupa.filter(function(d) { return d.cve == 9 });

// ¿Ixtapa y Zihuatanejo son dos elementos de una ciudad?
var zihuatanejo = ocupa.filter(function(d) {
 return d['centro turístico'] == 'Ixtapa-Zihuatanejo'
});

// Todos los nombres de los centros turísticos en Hidalgo empiezan con 'Centro turístico'...
var hgo = ocupa.filter(function(d) {
 return d.cve == 13
});

// "Puerto Escondido b/"
var puertoEscondido = ocupa.filter(function(d) {
 return d['centro turístico'] == 'Puerto Escondido b/'
});
*/
ocupa[58]['centro turístico'] = "Puerto Escondido";
/*
// "Centro turístico Puebla"
var puebla = ocupa.filter(function(d) {
  return d.cve == 21
});

// "Playacar"
var playacar = ocupa.filter(function(d) {
  return d['centro turístico'] == 'Playacar'
});

// ¿Guaymas y San Carlos son dos localidades o municipios diferentes?
var guaymasSancarlos = ocupa.filter(function(d) {
  return d['centro turístico'] == 'Guaymas-San Carlos'
});

// "Centro turístico Tlaxcala"
var tlaxcala = ocupa.filter(function(d) {
  return d.cve == 29
});

// ¿Veracruz y Boca del Río?
var boca = ocupa.filter(function(d) {
  return d['centro turístico'] == "Veracruz-Boca del Río"
});
*/

/////////////////// OCUPACIÓN POR MUNICIPIO (Y NO POR CENTRO TURÍSTICO)

for(var i in array1) {
 for(var j in ocupa) {

 if ( array1[i].cveEnt == ocupa[j].cve && array1[i].mun == ocupa[j]['centro turístico'] ) {
   
   array1[i]['llegada de turistas'] = ocupa[j]['llegada de turistas'];
   array1[i]['ocupación hotelera (%)'] = ocupa[j]['ocupación hotelera (%)'];
   array1[i]['estadía promedio (noches por turista)'] = ocupa[j]['estadía promedio (noches por turista)'];
   
  }

 }
}


array1 = array1.filter(function(d) { return d['llegada de turistas']; });
notArray1 = array1.filter(function(d) { return !d['llegada de turistas']; });

array1.forEach(function(doc) {
 db.turismo.insert(doc);
});

var centrosT = db.turismo.aggregate([
  { '$group': {
     '_id': { "cveSUN":"$cveSUN", "ciudad":"$ciudad" },
     'llegada de turistas': { '$sum':'$llegada de turistas' },
     'ocupación hotelera (%)': { '$addToSet':'$ocupación hotelera (%)' },
     'estadía promedio (noches por turista)': { '$addToSet':'$estadía promedio (noches por turista)' }
  } },
  { '$project': {
     '_id':'$_id.cveSUN',
     'ciudad':'$_id.ciudad',
     'llegada de turistas': 1,//{ '$addToSet':'$llegada de turistas' },
     'ocupación hotelera (%)': { '$avg':'$ocupación hotelera (%)' },
     'estadía promedio (noches por turista)': { '$avg':'$estadía promedio (noches por turista)' }
  } }
]).toArray();

centrosT.forEach(function(d) {
 d['centro turístico'] = "sí";
});

var comparten1 = db.turismo.aggregate([
 { $group: {
   _id: "$cveMun",
   ciudades: { "$addToSet":"$ciudad" }
 } }
]).toArray();

db.turismo.drop();

///llegadas
for(var i in array2) {
 for(var j in llegadas) {

 if ( array2[i].cveEnt == llegadas[j].cve && array2[i].mun == llegadas[j].mun ) {
  
    array2[i]['llegada de turistas'] = llegadas[j].llegadas;
   
  }

 }
}


array2 = array2.filter(function(d) { return d['llegada de turistas']; });

array2.forEach(function(doc) {
 db.turismo.insert(doc);
});

var Llegadas = db.turismo.aggregate([
  { '$group': {
     '_id': { "cveSUN":"$cveSUN", "ciudad":"$ciudad" },
     'llegada de turistas': { '$addToSet':'$llegada de turistas' }
  } },
  { '$project': {
     '_id':'$_id.cveSUN',
     'ciudad':'$_id.ciudad',
     'llegada de turistas': { '$sum':'$llegada de turistas' }
  } }
]).toArray();

var comparten2 = db.turismo.aggregate([
 { $group: {
   _id: "$cveMun",
   ciudades: { "$addToSet":"$ciudad" }
 } }
]).toArray();

db.turismo.drop();


for(var i in Llegadas) {
 for(var j in CENS) {
  if( Llegadas[i]._id == CENS[j]._id ) {
    CENS[j]['llegada de turistas'] = Llegadas[i]['llegada de turistas'];
    Llegadas[i].is = true;
  }
 }
}

var indices = []
for(var i in CENS) {
 if( CENS[i]['ocupación hotelera (%)'] == null ) indices.push(i)
}

for(var i in indices) {
  CENS.splice(indices[i],1);
}

var otrosMuns = Llegadas.filter(function(d) {
 return !d.is;
});

var subtotal = CENS.concat(otrosMuns);
var total = centrosT.concat(subtotal);

total.forEach(function(d) {
 if(!d['ocupación hotelera (%)']) d['ocupación hotelera (%)'] = "ND";
 if(!d['estadía promedio (noches por turista)']) d['estadía promedio (noches por turista)'] = "ND";
 if(d['estadía promedio (noches por turista)']==null) d['estadía promedio (noches por turista)'] = "ND";
 if(!d['llegada de turistas']) d['llegada de turistas'] = "ND";

})


for(var i in sun) {
 for(var j in total) {
  if( sun[i]._id == total[j]._id ) { 
   sun[i]['llegada de turistas'] = total[j]['llegada de turistas']; 
   sun[i]['ocupación hotelera (%)'] = total[j]['ocupación hotelera (%)'];
   sun[i]['estadía promedio (noches por turista)'] = total[j]['estadía promedio (noches por turista)'];
  }
 }
}

sun.forEach(function(d) {
 if(!d['llegada de turistas']) d['llegada de turistas'] = "ND";
 if(!d['ocupación hotelera (%)']) d['ocupación hotelera (%)'] = "ND";
 if(!d['estadía promedio (noches por turista)']) d['estadía promedio (noches por turista)']= "ND";
 if( !d['centro turístico'] ) d['centro turístico'] = "No";
});

for(var i in sun) {
 for(var j in ocupa) {
  if( sun[i].ciudad == ocupa[j]['centro turístico'] ) sun[i]['centro turístico'] = "Sí";
 }
}

var cadaMun = db.SUN.find({},{"Nombre del municipio":1,_id:0,"Número de registro en el Sistema Urbano Nacional 2010":1}).toArray();

cadaMun.forEach(function(d) {
 d.mun = d['Nombre del municipio'];
 d.cveSUN = d['Número de registro en el Sistema Urbano Nacional 2010'];
 delete d['Nombre del municipio'];
 delete d['Número de registro en el Sistema Urbano Nacional 2010'];
})

for(var i in cadaMun) {
 for(var j in ocupa) {

  if( cadaMun[i].mun == ocupa[j]['centro turístico'] ) cadaMun[i].is = true;

 }
}

cadaMun = cadaMun.filter(function(d) { return d.is; });

cadaMun.forEach(function(doc) {
  db.cadaMun.insert(doc);
});

cadaMun = db.cadaMun.aggregate([
 { "$group": {
    _id:"$cveSUN"
 } }
]).toArray();

db.cadaMun.drop();

for(var i in sun) {
 for(var j in cadaMun) {

 if( sun[i]._id == cadaMun[j]._id ) sun[i]['centro turístico'] = "Sí";

 }
}

sun.forEach(function(d) {
//    if(d.ciudad == "Juárez") d['centro turístico'] == "Sí";
  db.llegadasOcupaEstadia.insert(d);
});
