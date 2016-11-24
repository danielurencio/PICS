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
