var index = function(req,res) {
  return res.render("gis")
};

var entidades = function(req,res) {
  return res.render("entidades");
};

var puebla = function(req,res) {
  return res.render("puebla");
};

var localidadesPue = function(req,res) {
  return res.render("localidadesPue");
};

var manzanasPue = function(req,res) {
  return res.render("manzanasPue");
};

module.exports = {
  "index":index,
  "entidades":entidades,
  "puebla":puebla,
  "localidadesPue":localidadesPue,
  "manzanasPue":manzanasPue
};
