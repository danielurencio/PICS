var conn = new Mongo();
var db = conn.getDB("PICS");

var datos = db.energias.find().toArray();

datos.filter(function(d) { return d.MUNICIPIO == "José María"; }).forEach(function(m) {
 m.MUNICIPIO = "Jesús María";
});

datos.filter(function(d) {
 return d.ESTADO == 0 && d.MUNICIPIO == "Galeana";
})[0].ESTADO = "Chihuahua";

datos.filter(function(d) {
 return d.MUNICIPIO == "Mulegé" && d.ESTADO == "Baja California";
})[0].ESTADO = "Baja California Sur";

datos.filter(function(d) {
  return d.ESTADO == "Nayarit" && d.MUNICIPIO == "Francisco I. Madero";
})[0].MUNICIPIO = "Tepic";

datos.filter(function(d) {
  return d.ESTADO == "Oaxaca" && d.MUNICIPIO == "Ixtepec";
})[0].MUNICIPIO = "Ciudad Ixtepec";

datos.filter(function(d) {
  return d.ESTADO == "Veracruz de Ignacio de la Llave" && d.MUNICIPIO == "Veracruz de Ignacio de la Llave";
})[0].MUNICIPIO = "Veracruz";

datos.filter(function(d) {
  return d.ESTADO == "Chihuahua" && d.MUNICIPIO == "Temósachicc";
}).forEach(function(m) {
  m.MUNICIPIO = "Temósachic";
});

datos.filter(function(d) {
  return d.ESTADO == "Chihuahua" && d.MUNICIPIO == "Torreón";
}).forEach(function(m) {
  m.MUNICIPIO = "Jiménez";
});

datos.filter(function(d) {
  return d.ESTADO == "Coahuila de Zaragoza" && d.MUNICIPIO == "Lerdo";
}).forEach(function(m) {
  m.MUNICIPIO = "Torreón";
})



datos.filter(function(d) {
  return d.ESTADO == "Querétaro" && d.MUNICIPIO == "Felipe Carrillo Puerto";
}).forEach(function(m) {
  m.MUNICIPIO = "Querétaro";
});

var muns = db.censo2010.aggregate([
  { '$group': { 
     '_id': { ent:'$nom_ent', mun:'$nom_mun', cveEnt:'$entidad', 'cveMun':'$mun' }
  } },
  { '$project': {
     'ent':'$_id.ent',
     'mun':'$_id.mun',
     'cveEnt':'$_id.cveEnt',
     'cveMun':'$_id.cveMun',
     '_id':0
  } }
]).toArray()

for(var i in datos) {
 for(var j in muns) {

  if( datos[i]['MUNICIPIO'] == muns[j].mun && datos[i].ESTADO == muns[j].ent) {
//    print(datos[i].MUNICIPIO);
    datos[i].ent = muns[j].cveEnt;
    datos[i].mun = muns[j].cveMun;
  }

 }
}

var faltantes = datos.filter(function(d) { return !d.ent; }); // son 409;

function lista(ent) {
 var a = faltantes.filter(function(d) { return d.ESTADO == ent; }).map(function(m) {
  return m.MUNICIPIO;
 });

 return a;
}

var listos = datos.filter(function(d) { return d.mun; });

listos.forEach(function(d) {
  if( String(d.mun).length == 1) {
    d.mun = "00" + d.mun;
  } else if( String(d.mun).length == 2 ) {
    d.mun = "0" + d.mun;
  }

  d.cveMun = String(d.ent) + String(d.mun);
  d.cveMun = Number(d.cveMun);

  delete d.ent; delete d.mun;
});



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


var sunXmunicipio = db.SUN.find({},{"Clave del municipio":1,"Número de registro en el Sistema Urbano Nacional 2010":1,"_id":0}).toArray();

for(var i in sunXmunicipio) {
 for(var j in listos) {
  if( sunXmunicipio[i]['Clave del municipio'] == listos[j].cveMun ) {
    listos[j].cveSUN = sunXmunicipio[i]['Número de registro en el Sistema Urbano Nacional 2010'];
  }
 }
}


for(var i in sun) {
 for(var j in listos) {
  if( sun[i]._id == listos[j].cveSUN ) listos[j].ciudad = sun[i].ciudad;
 }
}


var enerSUNs = listos.filter(function(d) { return d.ciudad; });

var enerCount = db.enerSUN.find().count();

if( enerCount == 0 ) {

  enerSUNs.forEach(function(doc) {
    db.enerSUN.insert(doc);
  });

}

var e = db.enerSUN.aggregate([
 { '$group': {
   '_id': { 'cveSUN':'$cveSUN', 'ciudad':'$ciudad' },
   'proyectos': { '$push': {proyecto:'$PROYECTO',potencial:'$POTENCIAL (GWh/a)',tipo:'$TIPO'} },
    'potencial (GWh/a)': { '$sum':'$POTENCIAL (GWh/a)' },
 } },
 { '$unwind':'$proyectos' },
 { '$project': {
    'cveSUN':'$_id.cveSUN',
    'ciudad':'$_id.ciudad',
    'potencial (GWh/a)':1,
    'proyecto':'$proyectos.proyecto',
    'potencial proyecto':'$proyectos.potencial',
    'tipo':'$proyectos.tipo',
    '_id':0
 } },
 { '$group': {
    '_id': { 'cveSUN':'$cveSUN', 'ciudad':'$ciudad', 'tipo':'$tipo' },
    'potencial total':{ '$addToSet':'$potencial (GWh/a)' },
    'potencial tipo': { '$sum':'$potencial proyecto' }
 } },
 { '$project': {
    'cveSUN':'$_id.cveSUN',
    'ciudad':'$_id.ciudad',
    'tipo':'$_id.tipo',
    'potencial total': { '$sum':'$potencial total' },
    'potencial tipo':1,
    '_id':0
 } },
 { '$group': {
    '_id': { 'cveSUN':'$cveSUN', 'ciudad':'$ciudad', 'potencial total':'$potencial total' },
    'tipos': { '$addToSet':{ 'tipo':'$tipo', 'potencial':'$potencial tipo' } }
 } },
 { '$project': {
    'cveSUN':'$_id.cveSUN',
    'ciudad':'$_id.ciudad',
    'potencial total (GWh/a)':'$_id.potencial total',
    'tipos':1,
    '_id':0
 } }
]).toArray();


e.forEach(function(d) {

 for(var i in d.tipos) {
  d[d.tipos[i].tipo + ' %'] = (d.tipos[i].potencial / d['potencial total (GWh/a)']) * 100;
 }

 delete d.tipos;

});
