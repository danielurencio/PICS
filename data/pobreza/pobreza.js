var conn = new Mongo();
var db = conn.getDB("PICS");

var pobreza = db.getCollection("pobrezaExtrema").find().toArray();
var sunXmunicipio = db.SUN.find({},{"Clave del municipio":1,"Número de registro en el Sistema Urbano Nacional 2010":1,"_id":0}).toArray();

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

// Cotejar claves del SUN con todos los municipios
for(var i in sunXmunicipio) {
 for(var j in pobreza) {
  if( sunXmunicipio[i]['Clave del municipio'] == pobreza[j]['cveMun'] ) {

pobreza[j]["cveSUN"] = sunXmunicipio[i]['Número de registro en el Sistema Urbano Nacional 2010']

  }
 }
}

// Cotejar claves del componente principal con todos los municipios
for(var i in sun) {
 for(var j in pobreza) {
  if( sun[i]._id == pobreza[j].cveSUN ) pobreza[j].ciudad = sun[i].ciudad;
 }
}

pobreza = pobreza.filter(function(d) { if(d.ciudad) return d; });


db.pobrezaExtrema.drop();

pobreza.forEach(function(doc) {
  db.pobrezaExtrema.insert(doc);
});

pobreza = db.pobrezaExtrema.aggregate([
 { '$group': {
    '_id': { 'cveSUN': '$cveSUN', 'ciudad': '$ciudad' },
    'municipios': { '$sum':1 },
    'población': { '$sum': "$población" },
    'pobreza extrema (personas)': { '$sum':'$pobreza extrema (personas)' },
    'carencia por acceso a la alimentación (personas)': { '$sum':'$carencia por acceso a la alimentación (personas)' },
    'pobres extremos y con carencia por acceso a la alimentación (personas)': { '$sum':'$población pobre extrema y que también es carente por acceso a la alimentación (personas)' }
 } },
 { '$project': {
     '_id': '$_id.cveSUN',
     'ciudad': '$_id.ciudad',
     'pobreza extrema (%)': { '$divide': ['$pobreza extrema (personas)','$población'] },
     'carencia por acceso a la alimentación (%)': { '$divide': ['$carencia por acceso a la alimentación (personas)','$población'] },
     'pobreza extrema y con carencia por acceso a la alimentación (%)': { '$divide': ['$pobres extremos y con carencia por acceso a la alimentación (personas)','$población'] }
 } },
 { '$project': {
     '_id':1,
     'ciudad':1,
     'pobreza extrema (%)': { '$multiply': ['$pobreza extrema (%)',100] },
     'carencia por acceso a la alimentación (%)': { '$multiply': ['$carencia por acceso a la alimentación (%)',100] },
     'pobreza extrema y con carencia por acceso a la alimentación (%)': { '$multiply': ['$pobreza extrema y con carencia por acceso a la alimentación (%)',100] },

 } }
]).toArray();

db.pobrezaExtrema.drop();

pobreza.forEach(function(doc) {
  db.pobrezaExtrema.insert(doc);
});
