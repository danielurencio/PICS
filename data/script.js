var fs = require("fs");
var d3 = require("d3");

var input = process.argv[2];
var flag = process.argv[3];


function setID(input) {
  var files = fs.readdirSync("./entidades/" + input + "/" + input +"_t");

  var bjSur = files[1];
  files[1] = files[2];
  files[2] = bjSur;
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
  if(!n) {
    console.log("\n  ATENCIÓN: ¡¡Tienes que especificar algún 'flag'!!\n");
  }

  else {
    var files = fs.readdirSync("./entidades/" + n + "/" + n + "_t");

    if( n == "mun" ) {
      var obj = {
	'sunFile': '1',
	'unidadType': 'Clave del municipio',
	'cityClass': 'Nombre de la ciudad (zona metropolitana)',
	'unidadLength': 4
      };
    };

    if( n == 'l' ) {
      var obj = {
        'sunFile': '3',
	'unidadType': 'Clave de la localidad',
	'cityClass': 'Nombre de la ciudad (conurbación)',
	'unidadLength': 8
      };
    };
      console.log(obj)
      cotejar(obj)

      function cotejar(o) {
        var U = fs.readFileSync("./SUN/" + o.sunFile + ".csv", "utf8")
        U = d3.csv.parse(U);

        U = U.map(function(d) {
          return {
            'entidad':d['Clave de la entidad federativa'],
            'unidad':d[o.unidadType],
	    'ciudad': d[o.cityClass],
            'cvesun':d['Número de registro en el Sistema Urbano Nacional 2010']
          };
        });

        U.forEach(function(d) {
          if(d.entidad.length == 1) d.entidad = "0" + d.entidad;
          if(d.unidad.length == o.unidadLength) d.unidad = "0" + d.unidad; // cambiar '4' ??
        });

        files.forEach(function(d) {
          if(d.length == 7) {
	    var cveEnt = d.split('.')[0];
            var file = require("./entidades/" + n + "/" + n + "_t/" + d);
            var key = Object.keys(file.objects)[0];
            var geometries = file.objects[key].geometries.length;

	    var cities = U.filter(function(d) { return d.entidad == cveEnt; });

	    cities.forEach(function(i) {
	      file.objects[key].geometries.forEach(function(j) {
	        if( i.unidad == j.properties.CVEGEO ) {
	          j.properties.ciudad = { 'nombre': i.ciudad, 'cve': i.cvesun };
	        };
	      });
	    });

/*
	    var count = file.objects[key].geometries.filter(function(d) {
	      return d.properties.ciudad;
	    });

	    console.log(cveEnt, count.length);
*/
	    fs.writeFileSync("./entidades/" + n + "/" + n + "_t/" + d, JSON.stringify(file));
	    console.log("File " + d + " written!");
          };

        });

    }; ///
  }

};


function SunJSON(p) {
  var file = fs.readFileSync("./SUN/" + p + ".csv", "utf8");
  var o = {};

  file = d3.csv.parse(file);

  if ( p == '1' ) {
    o = {
      'unidad':'Clave del municipio',
      'nombresun':'Nombre de la ciudad (zona metropolitana)'
    };
  }

  if ( p == '3' ) {
    o = {
      'unidad':'Clave de la localidad',
      'nombresun':'Nombre de la ciudad (conurbación)'
    };
  }


  file = file.map(function(d) {
    return {
      'cveun':d[o.unidad],
      'cvesun':d['Número de registro en el Sistema Urbano Nacional 2010'],
      'nombresun':d[o.nombresun]
    }
  });

  fs.writeFileSync("./" + p + ".js", JSON.stringify(file));
  
};


if( input && input == "mun" || input == "l" ) setID(input);
if( input == "sun" ) SUN(flag);
if( input == "sunFile") SunJSON(flag);

process.exit();
