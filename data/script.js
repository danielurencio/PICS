var fs = require("fs");
var files = fs.readdirSync("./entidades/municipios");
//console.log(files);

files.forEach(function(d,i) {
  if(d != "exports") {
    var f = require("./entidades/municipios/" + d);
    f._id = String(i+1);
    if (f._id.length == 1) f._id = "0" + f._id;
    fs.writeFileSync("./entidades/municipios/exports/" + f._id + ".json", JSON.stringify(f));
  };
});

console.log("finito!");
process.exit();
