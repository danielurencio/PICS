var conn = new Mongo();
var db = conn.getDB("PICS");
var count = db.finanzasIMCO.find().count();

if( count != 420 ) {

	var sunXmunicipio = db.SUN.find({},{"Clave del municipio":1,"Número de registro en el Sistema Urbano Nacional 2010":1,"_id":0}).toArray();

	var imco = db.finanzasIMCO.find().toArray();

	// Cotejar claves del SUN con todos los municipios
	for(var i in sunXmunicipio) {
	 for(var j in imco) {
	  if( sunXmunicipio[i]['Clave del municipio'] == imco[j]['_id'] ) {

	imco[j]["cveSUN"] = sunXmunicipio[i]['Número de registro en el Sistema Urbano Nacional 2010']

	  }
	 }
	}

	var imco = imco.filter(function(d) { return d.cveSUN; });
	db.finanzasIMCO.drop()
	db.finanzasIMCO.insert(imco);
}

var imco = db.finanzasIMCO.aggregate([
 { '$group': {
    '_id': '$cveSUN',
    'info': { '$addToSet': { 'cveMun':'$_id', 'puntaje':'$puntaje' } }
 } },
 { '$project': {
    '_id':1,
    'puntaje': { '$avg':'$info.puntaje' }
 } }
]).toArray();

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
 for(var j in imco) {
  if( sun[i]._id == imco[j]._id ) {
    imco[j].ciudad = sun[i].ciudad;
    sun[i].puntaje = imco[j].puntaje;
  }
 }
}

//imco = imco.filter(function(d) { return d.ciudad });
sun.forEach(function(d) { if( d.puntaje == null || !d.puntaje ) d.puntaje = "NA"; });



