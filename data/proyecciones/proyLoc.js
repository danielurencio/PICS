var conn = new Mongo();
var db = conn.getDB('PICS');

var cvesLoc = db.proyConYcen.find().count();

if( cvesLoc == 0 ) {
  var array = [];
  locs = db.proyLocalidades.find().toArray();
//  db.proyLocalidades.drop();

  locs.forEach(function(d,j) {
    var obj = {};

    for(var i in d) {
      if(
	i != '_id' &&
	i != 'Clave entidad' &&
	i != 'Clave municipio' &&
	i != 'Clave localidad') {
	  obj[i] = d[i];
	}
      }

      var ent = String( d['Clave entidad'] );
      var mun = String( d['Clave municipio'] );
      var loc = String( d['Clave localidad'] );

	if( mun.length == 1 ) {
	  mun = '00' + mun;
        } else if ( mun.length == 2 ) {
	  mun = '0' + mun;
        }

	if( loc.length == 1 ) {
	  loc = '000' + loc;
        } else if ( loc.length == 2 ) {
	  loc = '00' + loc;
        } else if ( loc.length == 3 ) {
	  loc = '0' + loc;
	}

      var cveLoc = Number( ent + mun + loc );
      obj.cveLoc = cveLoc;
    
      array.push(obj);
  });

  delete locs;

  var locsSUN = db.SUN.find({ 'Clave de la localidad': { '$exists':true } }, 
  {
    '_id':0,
    'Clave de la localidad':1,
    'Número de registro en el Sistema Urbano Nacional 2010':1
  }).toArray();

  for(var i in locsSUN) {
   for(var j in array) {
    if( locsSUN[i]['Clave de la localidad'] == array[j]['cveLoc'] ) {
      array[j].cveSUN = locsSUN[i]['Número de registro en el Sistema Urbano Nacional 2010']
    }
   }
  }

  array = array.filter(function(d) {
   return d.cveSUN;
  });

  array.forEach(function(doc) {
    db.proyConYcen.insert(doc);
  });

}


var sunLocs = db.proyConYcen.aggregate([
 { '$group': {
    '_id':'$cveSUN',
      "2010": { '$sum': "$2010" },
      "2011": { '$sum': "$2011" },
      "2012": { '$sum': "$2012" },
      "2013": { '$sum': "$2013" },
      "2014": { '$sum': "$2014" },
      "2015": { '$sum': "$2015" },
      "2016": { '$sum': "$2016" },
      "2017": { '$sum': "$2017" },
      "2018": { '$sum': "$2018" },
      "2019": { '$sum': "$2019" },
      "2020": { '$sum': "$2020" },
      "2021": { '$sum': "$2021" },
      "2022": { '$sum': "$2022" },
      "2023": { '$sum': "$2023" },
      "2024": { '$sum': "$2024" },
      "2025": { '$sum': "$2025" },
      "2026": { '$sum': "$2026" },
      "2027": { '$sum': "$2027" },
      "2028": { '$sum': "$2028" },
      "2029": { '$sum': "$2029" },
      "2030": { '$sum': "$2030" } 
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

for(var i in sun) {
 for(var j in sunLocs) {
  if(sun[i]._id == sunLocs[j]._id) sunLocs[j].ciudad = sun[i].ciudad;
 }
}

sunLocs = sunLocs.filter(function(d) { return d.ciudad; });

var emptySUN = db.proySUN.find().count();

if( emptySUN == 0 || emptySUN == 59 ) {
  sunLocs.forEach(function(doc) {
    db.proySUN.insert(doc);
  });
}
