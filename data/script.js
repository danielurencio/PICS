var fs = require("fs");
var d3 = require("d3");

var input = process.argv[2];
var flag = process.argv[3];


function setID(input) {
  var files = fs.readdirSync("./entidades/" + input + "/" + input +"_t");
  var chiapas = files[4];
  files[4] = files[6];
  files[6] = chiapas;
  var chihuahua = files[5];
  files[5] = files[7];
  files[7] = chihuahua;


  files.forEach(function(d,i) {

      var f = require("./entidades/" + input + "/" + input + "_t/" + d);
      f._id = String(i+1);
      if (f._id.length == 1) f._id = "0" + f._id;
      fs.writeFileSync("./entidades/" + input + "/" + input + "_t/" + f._id + ".json", JSON.stringify(f));

  });
  console.log("finito!");

};

function SUN(n) {
//  console.log(n);
  var files_mun = fs.readdirSync("./entidades/" + n + "/" + n + "_t");

  var zm = fs.readFileSync("./SUN/1.csv", "utf8")
  zm = d3.csv.parse(zm);

  zm = zm.map(function(d) {
    return {
      'entidad':d['Clave de la entidad federativa'],
      'municipio':d['Clave del municipio'],
      'sun':d['Número de registro en el Sistema Urbano Nacional 2010']
    };
  });

  zm.forEach(function(d) {
    if(d.entidad.length == 1) d.entidad = "0" + d.entidad;
  });

  files_mun.forEach(function(d) {
    if(d.length == 7) {
      var file = require("./entidades/" + n + "/" + n + "_t/" + d);
      var key = Object.keys(file.objects)[0];
      var geometries = file.objects[key].geometries.length;
      console.log(key, geometries);
    };

  });

};


if( input && input == "mun" || input == "l" ) setID(input);
if( input == "sun" ) SUN(flag);

process.exit();
