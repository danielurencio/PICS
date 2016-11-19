var conn = new Mongo();
var db = conn.getDB("PICS");

/////////////////////////////////////////////////////////////////////////////////////////
// Borrar campos vacíos en municipios.
/////////////////////////////////////////////////////////////////////////////////////////
var empty = db.proyMunicipios.find({ '2010':'' }).count();
if( empty == 4914 ) { db.proyMunicipios.remove({ '2010':'' }); };

///////////////////////////////////////////////////////////////////////////////////////
// OBTERNER CLAVES-SUN DE LAS ZONAS METROPOLITANAS//
///////////////////////////////////////////////////////////////////////////////////////
var zm = db.SUN.find({ "Tipo de ciudad":1 },
  { "Número de registro en el Sistema Urbano Nacional 2010":1,
//    "Nombre de la ciudad":1,
    "_id": 0,
    "Clave del municipio":1
}).toArray();

var ZM = [];

zm.forEach(function(d) {
 var obj = {};
 obj.cveSUN = d['Número de registro en el Sistema Urbano Nacional 2010'];
// obj.ciudad = d['Nombre de la ciudad'];
 obj.cveMun = d['Clave del municipio'];
 ZM.push(obj);
});


///////////////////////////////////////////////////////////////////////////////////
// GUARDAR EN UNA VARIABLE TODAS LAS PROYECCIONES MUNICIPALES Y ASIGNAR CLAVE-SUN
//////////////////////////////////////////////////////////////////////////////////

var muns = db.proyMunicipios.find().toArray();

for(var i in muns) {
 for(var j in ZM) {

  if( muns[i].cveMun == ZM[j].cveMun ) { muns[i].cveSUN = ZM[j].cveSUN; }

 }
}

muns = muns.filter(function(d) { return d.cveSUN; });
var ZMcount = db.proyZM.find().count();

if( ZMcount == 0 ) {
  muns.forEach(function(doc) {
    db.proyZM.insert(doc);
  });
}


////////////////////////////////////////////////////////////////////////////
/// CALCULAR EL AUMENTO AUMENTO POBLACIONAL TOTAL DE TODAS LOS MUNICIPIOS
//////////////////////////////////////////////////////////////////////////

var munCves = db.proyZM.aggregate([
  { '$group': {
    '_id':'$cveMun'
  } }
]).toArray();

munCves = munCves.map(function(d) { return d._id; });

function todos (mun,sexo) {
 var a = db.proyZM.aggregate([
  { '$match': { "cveMun": mun, "Sexo":sexo } },
  { '$group': {
     '_id':{ "cveMun":"$cveMun", "Municipio":"$Municipio", "cveSUN":"$cveSUN", "Sexo":"$Sexo" },
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
  } },
  { '$project': {
     "_id":0,
     "cveMun":"$_id.cveMun",
     "Municipio":"$_id.Municipio",
     "Sexo":"$_id.Sexo",
     "2010":1,
     "2011":1,
     "2012":1,
     "2013":1,
     "2014":1,
     "2015":1,
     "2016":1,
     "2017":1,
     "2018":1,
     "2019":1,
     "2020":1,
     "2021":1,
     "2022":1,
     "2023":1,
     "2024":1,
     "2025":1,
     "2026":1,
     "2027":1,
     "2028":1,
     "2029":1,
     "2030":1,
     "cveSUN":"$_id.cveSUN"
  } }
 ]).toArray();

 a = a[0];
 a['Grupo de Edad'] = "Todos";
 return a; 
}

var todoEdad = db.proyMunicipios.find({ 'Grupo de Edad':'Todos' }).count();

if( todoEdad == 0 ) {

 munCves.forEach(function(d) {
  db.proyMunicipios.insert(todos(d,"Ambos"));
 });

}


/////////////////////////////////////////////////////////////////////////
//  Filtrar por SUN
////////////////////////////////////////////////////////////////////////

var zonasM = db.proyMunicipios.aggregate([
 { '$match': { 'Grupo de Edad':'Todos' } },
 { '$group': {
    '_id':'$cveSUN',
    '2010': { '$sum':'$2010' },
    '2011': { '$sum':'$2011' },
    '2012': { '$sum':'$2012' },
    '2013': { '$sum':'$2013' },
    '2014': { '$sum':'$2014' },
    '2015': { '$sum':'$2015' },
    '2016': { '$sum':'$2016' },
    '2017': { '$sum':'$2017' },
    '2018': { '$sum':'$2018' },
    '2019': { '$sum':'$2019' },
    '2020': { '$sum':'$2020' },
    '2021': { '$sum':'$2021' },
    '2022': { '$sum':'$2022' },
    '2023': { '$sum':'$2023' },
    '2024': { '$sum':'$2024' },
    '2025': { '$sum':'$2025' },
    '2026': { '$sum':'$2026' },
    '2027': { '$sum':'$2027' },
    '2028': { '$sum':'$2028' },
    '2029': { '$sum':'$2029' },
    '2030': { '$sum':'$2030' }
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
 for(var j in zonasM) {
  if(sun[i]._id == zonasM[j]._id) zonasM[j].ciudad = sun[i].ciudad;
 }
}

var emptySUN = db.proySUN.find().count();

if( emptySUN == 0 || emptySUN == 76 ) {
  zonasM.forEach(function(doc) {
    db.proySUN.insert(doc);
  });
}

