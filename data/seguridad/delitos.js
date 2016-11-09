var conn = new Mongo();
var db = conn.getDB("PICS");

////////////////////////////////////////////////////////////////////////
// PROCESAR DATOS DE POBLACIÓN PARA AJUSTAR DELITOS POR UNIDAD DEL SUN
///////////////////////////////////////////////////////////////////////

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



///////////////////////////////////////////////////////////////
// PULIR VARIABLE EN CUESTIÓN PARA COTEJAR CON CLAVES DEL SUN
/////////////////////////////////////////////////////////////


var delitos = db.getCollection("delitos").find().toArray();
db.delitos.drop();

delitos.forEach(function(doc) {
 doc._id = String(doc._id);
// doc['Daño en las cosas'] = doc['Da�o en las cosas'];
// delete doc['Da�o en las cosas'];
 db.delitos.insert(doc);
});

delitos = db.delitos.find({
  '$where': '(this._id.length > 2)',
   '$and': [
    { 'Nombre': { '$ne':'Otros estados' } },
    { 'Nombre': { '$ne':'No especificado' } },
    { 'Nombre': { '$ne':'Otros municipios' } }
   ] 
},{'Total delitos':1}).toArray();

delitos.forEach(function(d) {
  d._id = +d._id;
});


for(var i in array) {
 for(var j in delitos) {

   if( array[i].cveMun == delitos[j]._id ) {
    array[i]['Total delitos'] = delitos[j]['Total delitos'];
   }

 }
}


////////////////////////////////////////////
// ASIGNAR NOMBRE DE CIUDADES Y FILTRARLAS
///////////////////////////////////////////

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

array.forEach(function(d) {
  if(d.pobLoc) {
    d['pob %'] = d.pobLoc / d.pobMun;
    d['delitos ajustados'] = +(d['pob %'] * d['Total delitos']).toFixed(0);
  } else {
    d['pob %'] = d.pobMun / d.pobMun;
    d['delitos ajustados'] = +(d['pob %'] * d['Total delitos']).toFixed(0);
  }
});



db.delitos.drop();

array.forEach(function(doc) {
  if(!doc.pobLoc) {
    doc.pob = doc.pobMun;
    delete doc.pobMun;
  }
  if(doc.pobLoc) {
    doc.pob = doc.pobLoc;
    delete doc.pobLoc;
    delete doc.pobMun;
  }
  db.delitos.insert(doc);
});


delitos = db.delitos.aggregate([
 { '$group': {
    '_id': { 'cveSUN':'$cveSUN', 'ciudad':'$ciudad' },
    'delitos ajustados': { '$sum':'$delitos ajustados' },
    'pob': { '$sum':'$pob' },
//    'Daño en las cosas': { '$sum':'$Daño en las cosas' },
//    'Delitos sexuales': { '$sum':'$Delitos sexuales' },
//    'Homicidio': { '$sum':'$Homicidio' },
//    'Lesiones': { '$sum':'$Lesiones' },
//    'Robo': { '$sum':'$Robo' },
//    'Otros delitos': { '$sum':'$Otros delitos' }
 } },
 { '$project': {
    '_id': '$_id.cveSUN',
    'ciudad': '$_id.ciudad',
    'delitos ajustados':1,
    'pob':1,
    'delitos': { '$divide': ['$delitos ajustados','$pob'] }
//    'Daño en las cosas':1,
//    'Delitos sexuales':1,
//    'Homicidio':1,
//    'Lesiones':1,
//    'Robo':1,
//    'Otros delitos':1
 } },
 { '$project': {
    '_id':1,
    'ciudad':1,
    'delitos por cada 1000 habitantes': { '$multiply': ['$delitos',1000] }
 } }
]).toArray();


db.delitos.drop();
var key = 'delitos por cada 1000 habitantes';

delitos.forEach(function(doc) {
  if( typeof(doc[key]) == 'number' ) {
   doc[key] = Number( doc[key].toFixed(0) );

   if(doc[key] == 0) {
    doc[key] = "Se reportaron 0";
   }

  }

  db.delitos.insert(doc);
});


