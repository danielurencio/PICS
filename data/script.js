var fs = require("fs");
var input = process.argv[2];
//var files = fs.readdirSync("./entidades/municipios");
//console.log(files);

function setIDMunicipio() {
  var files = fs.readdirSync("./entidades/municipios");

  files.forEach(function(d,i) {
    if(d != "exports") {
      var f = require("./entidades/municipios/" + d);
      f._id = String(i+1);
      if (f._id.length == 1) f._id = "0" + f._id;
      fs.writeFileSync("./entidades/municipios/exports/" + f._id + ".json", JSON.stringify(f));
    };
  });
  console.log("finito!");

};


function denueJSON() {
  var files = fs.readdirSync("./denue/json");

  files.forEach(function(d,i) {
    if(d!="no") {
     var file = require("./denue/json/" + d);
     file = file.features;
     fs.writeFileSync("./denue/json/" + i + ".json", JSON.stringify(file));
      console.log(i);
    }
  });

};

if( input == "denue" ) denueJSON();

process.exit();
