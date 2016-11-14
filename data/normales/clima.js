lima = db.clima.find({},{'_id':0}).toArray();r conn = new Mongo();
var db = conn.getDB("PICS");

var array = [];
var sunXmunicipio = db.SUN.find({},{
 "Clave del municipio":1,
 "Número de registro en el Sistema Urbano Nacional 2010":1,
// "Tipo de ciudad":1,
 "_id":0,
 "Clave de la localidad":1,
// "Población total 2010":1,
// "Población total de la localidad 2010":1
}).toArray();


sunXmunicipio.forEach(function(d) {
 var obj = {};
 obj.cveMun = d['Clave del municipio'];
 obj.cveSUN = d['Número de registro en el Sistema Urbano Nacional 2010'];
// obj.tipo = d['Tipo de ciudad'];
 if(d['Clave de la localidad']) obj.loc = d['Clave de la localidad'];
 if(d['Población total 2010']) obj.pobMun = d['Población total 2010'];
 if(d['Población total de la localidad 2010']) obj.pobLoc = d['Población total de la localidad 2010'];

 array.push(obj);
});


var clima = db.clima.find({},{'_id':0}).toArray();

for(var i in array) {
 for(var j in clima) {
  if( array[i].cveMun == clima[j].cveMun ) {
    array[i]['temperatura máxima'] = clima[j].tempMax;
    array[i]['temperatura mínima'] = clima[j].tempMin;
    array[i]['precipitación'] = clima[j].precip;
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

db.clima.drop();

array.forEach(function(d) {
  db.clima.insert(d);
});


var no = db.clima.aggregate([
 { '$match': { 'precipitación': { '$exists':false } } },
 { '$group': {
    '_id': { 'cveSUN':'$cveSUN', 'ciudad':'$ciudad' },
    'muns': { '$push':'$cveMun' }
 } },
 { '$project': {
    '_id':'$_id.cveSUN',
    'ciudad':'$_id.ciudad',
    'muns':1
 } }
]).toArray();

var si = db.clima.aggregate([
 { '$match': { 'precipitación': { '$exists':true } } },
 { '$group': {
    '_id': { 'cveSUN':'$cveSUN', 'ciudad':'$ciudad' },
    'temperatura máxima': { '$avg': '$temperatura máxima' },
    'temperatura mínima': { '$avg': '$temperatura mínima' },
    'precipitación': { '$avg': '$precipitación' }
 } },
 { '$project': {
     '_id':'$_id.cveSUN',
     'ciudad':'$_id.ciudad',
     'temperatura máxima':1,
     'temperatura mínima':1,
     'precipitación':1
 } }
]).toArray()

for(var i in no) {
 for(var j in si) {
  if( no[i]._id == si[j]._id ) no[i].is = true;
 }
}

no = no.filter(function(d) { return !d.is; });

var faltantes = [ 2,4,16,21,23,26,27,28 ];
var datosDeFaltantes = [];

function calcularFaltantes(ent,med) {
  var datos = db.normales.find({
   '$where': "/^" + ent + ".*/.test(this.cveMun)",
   'medición': med
  }, {cveMun:1,medición:1,'valor medio':1,_id:0}).toArray();

  var sumatoria = datos.map(function(d) { return d['valor medio']; })
	.reduce(function sum(a,b) { return a + b; });

  var media = sumatoria / datos.length;

  return media;
};

faltantes.forEach(function(d) {
 var obj = {};
 obj['entidad'] = d;
 obj['temperatura máxima'] = calcularFaltantes(d,'temperatura máxima');
 obj['temperatura mínima'] = calcularFaltantes(d,'temperatura mínima');
 obj['precipitación'] = calcularFaltantes(d,'precipitación');

 datosDeFaltantes.push(obj);
});


// Completar datos de ciudades en Sonora
no.filter(function(d) { if(d._id == 333 || d._id == 329) return d }).forEach(function(d) {
	  delete d.muns;
	  d['temperatura máxima'] = datosDeFaltantes[5]['temperatura máxima'];
	  d['temperatura mínima'] = datosDeFaltantes[5]['temperatura mínima'];
	  d['precipitación'] = datosDeFaltantes[5]['precipitación'];
	});

// Completar datos de ciudades en Tamaulipas
no.filter(function(d) { if(d._id == 44 || d._id == 45) return d }).forEach(function(d) {
          delete d.muns;
          d['temperatura máxima'] = datosDeFaltantes[7]['temperatura máxima'];
          d['temperatura mínima'] = datosDeFaltantes[7]['temperatura mínima'];
          d['precipitación'] = datosDeFaltantes[7]['precipitación'];
        });


// Completar datos de ciudades en Michoacán
no.filter(function(d) { if(d._id == 264 || d._id == 268) return d }).forEach(function(d) {
          delete d.muns;
          d['temperatura máxima'] = datosDeFaltantes[2]['temperatura máxima'];
          d['temperatura mínima'] = datosDeFaltantes[2]['temperatura mínima'];
          d['precipitación'] = datosDeFaltantes[2]['precipitación'];
        });

// Completar datos de ciudades en Quintana Roo
no.filter(function(d) { if(d._id == 305 ) return d }).forEach(function(d) {
          delete d.muns;
          d['temperatura máxima'] = datosDeFaltantes[4]['temperatura máxima'];
          d['temperatura mínima'] = datosDeFaltantes[4]['temperatura mínima'];
          d['precipitación'] = datosDeFaltantes[4]['precipitación'];
        });


// Completar datos de ciudades en Tabasco
no.filter(function(d) { if(d._id == 123 ) return d }).forEach(function(d) {
          delete d.muns;
          d['temperatura máxima'] = datosDeFaltantes[6]['temperatura máxima'];
          d['temperatura mínima'] = datosDeFaltantes[6]['temperatura mínima'];
          d['precipitación'] = datosDeFaltantes[6]['precipitación'];
        });

// Completar datos de ciudades en Baja California
no.filter(function(d) { if(d._id == 60 ) return d }).forEach(function(d) {
          delete d.muns;
          d['temperatura máxima'] = datosDeFaltantes[0]['temperatura máxima'];
          d['temperatura mínima'] = datosDeFaltantes[0]['temperatura mínima'];
          d['precipitación'] = datosDeFaltantes[0]['precipitación'];
        });

// Completar datos de ciudades en Puebla
no.filter(function(d) { if(d._id == 35 ) return d }).forEach(function(d) {
          delete d.muns;
          d['temperatura máxima'] = datosDeFaltantes[3]['temperatura máxima'];
          d['temperatura mínima'] = datosDeFaltantes[3]['temperatura mínima'];
          d['precipitación'] = datosDeFaltantes[3]['precipitación'];
        });

// Completar datos de ciudades en Campeche
no.filter(function(d) { if(d._id == 145 ) return d }).forEach(function(d) {
          delete d.muns;
          d['temperatura máxima'] = datosDeFaltantes[1]['temperatura máxima'];
          d['temperatura mínima'] = datosDeFaltantes[1]['temperatura mínima'];
          d['precipitación'] = datosDeFaltantes[1]['precipitación'];
        });

var completos = si.concat(no);

db.clima.drop();

completos.forEach(function(doc) {
  db.clima.insert(doc);
});
