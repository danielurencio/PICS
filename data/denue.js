// BulkOp for updates.
var conn = new Mongo();
var db = conn.getDB("PICS");

function claveGeo() {
//  var conn = new Mongo();
//  var db = conn.getDB("PICS");
  var bulk = db.getCollection("denue").initializeUnorderedBulkOp();

  var docs = db.getCollection("denue").find({});

  docs.forEach(function(doc) {
    var ent = String(doc['Clave entidad']);
    var mun = String(doc['Clave municipio']);
    var loc = String(doc['Clave localidad']);

    if ( ent.length == 1 ) ent = '0' + ent;
    if ( mun.length == 1 ) mun = '00' + mun;
    if ( mun.length == 2 ) mun = '0' + mun;
    if ( loc.length == 1 ) loc = '000' + loc;
    if ( loc.length == 2 ) loc = '00' + loc;
    if ( loc.length == 3 ) loc = '0' + loc;

    var cveLoc = ent + mun + loc;
    var cveMun = ent + mun;

    bulk.find({ '_id': doc._id }).update({ '$set': { /*'claveLoc': cveLoc,*/ 'claveMun':cveMun } });
  });

  bulk.execute();
  print("finished");
}

var municipios = [{"cveun":"01001","cvesun":"1","nombresun":"Aguascalientes"},{"cveun":"01005","cvesun":"1","nombresun":"Aguascalientes"},{"cveun":"01011","cvesun":"1","nombresun":"Aguascalientes"},{"cveun":"02003","cvesun":"2","nombresun":"Tijuana"},{"cveun":"02004","cvesun":"2","nombresun":"Tijuana"},{"cveun":"02005","cvesun":"2","nombresun":"Tijuana"},{"cveun":"02002","cvesun":"3","nombresun":"Mexicali"},{"cveun":"05017","cvesun":"4","nombresun":"La Laguna"},{"cveun":"05035","cvesun":"4","nombresun":"La Laguna"},{"cveun":"10007","cvesun":"4","nombresun":"La Laguna"},{"cveun":"10012","cvesun":"4","nombresun":"La Laguna"},{"cveun":"05004","cvesun":"5","nombresun":"Saltillo"},{"cveun":"05027","cvesun":"5","nombresun":"Saltillo"},{"cveun":"05030","cvesun":"5","nombresun":"Saltillo"},{"cveun":"05006","cvesun":"6","nombresun":"Monclova-Frontera"},{"cveun":"05010","cvesun":"6","nombresun":"Monclova-Frontera"},{"cveun":"05018","cvesun":"6","nombresun":"Monclova-Frontera"},{"cveun":"05022","cvesun":"7","nombresun":"Piedras Negras"},{"cveun":"05025","cvesun":"7","nombresun":"Piedras Negras"},{"cveun":"06002","cvesun":"8","nombresun":"Colima-Villa de Álvarez"},{"cveun":"06003","cvesun":"8","nombresun":"Colima-Villa de Álvarez"},{"cveun":"06004","cvesun":"8","nombresun":"Colima-Villa de Álvarez"},{"cveun":"06005","cvesun":"8","nombresun":"Colima-Villa de Álvarez"},{"cveun":"06010","cvesun":"8","nombresun":"Colima-Villa de Álvarez"},{"cveun":"06001","cvesun":"9","nombresun":"Tecomán"},{"cveun":"06009","cvesun":"9","nombresun":"Tecomán"},{"cveun":"07012","cvesun":"10","nombresun":"Tuxtla Gutiérrez"},{"cveun":"07027","cvesun":"10","nombresun":"Tuxtla Gutiérrez"},{"cveun":"07101","cvesun":"10","nombresun":"Tuxtla Gutiérrez"},{"cveun":"08037","cvesun":"11","nombresun":"Juárez"},{"cveun":"08002","cvesun":"12","nombresun":"Chihuahua"},{"cveun":"08004","cvesun":"12","nombresun":"Chihuahua"},{"cveun":"08019","cvesun":"12","nombresun":"Chihuahua"},{"cveun":"09002","cvesun":"13","nombresun":"Valle de México"},{"cveun":"09003","cvesun":"13","nombresun":"Valle de México"},{"cveun":"09004","cvesun":"13","nombresun":"Valle de México"},{"cveun":"09005","cvesun":"13","nombresun":"Valle de México"},{"cveun":"09006","cvesun":"13","nombresun":"Valle de México"},{"cveun":"09007","cvesun":"13","nombresun":"Valle de México"},{"cveun":"09008","cvesun":"13","nombresun":"Valle de México"},{"cveun":"09009","cvesun":"13","nombresun":"Valle de México"},{"cveun":"09010","cvesun":"13","nombresun":"Valle de México"},{"cveun":"09011","cvesun":"13","nombresun":"Valle de México"},{"cveun":"09012","cvesun":"13","nombresun":"Valle de México"},{"cveun":"09013","cvesun":"13","nombresun":"Valle de México"},{"cveun":"09014","cvesun":"13","nombresun":"Valle de México"},{"cveun":"09015","cvesun":"13","nombresun":"Valle de México"},{"cveun":"09016","cvesun":"13","nombresun":"Valle de México"},{"cveun":"09017","cvesun":"13","nombresun":"Valle de México"},{"cveun":"13069","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15002","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15009","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15010","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15011","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15013","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15015","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15016","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15017","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15020","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15022","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15023","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15024","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15025","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15028","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15029","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15030","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15031","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15033","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15034","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15035","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15036","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15037","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15038","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15039","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15044","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15046","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15050","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15053","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15057","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15058","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15059","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15060","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15061","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15065","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15068","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15069","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15070","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15075","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15081","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15083","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15084","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15089","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15091","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15092","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15093","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15094","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15095","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15096","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15099","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15100","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15103","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15104","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15108","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15109","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15112","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15120","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15121","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15122","cvesun":"13","nombresun":"Valle de México"},{"cveun":"15125","cvesun":"13","nombresun":"Valle de México"},{"cveun":"11020","cvesun":"14","nombresun":"León"},{"cveun":"11037","cvesun":"14","nombresun":"León"},{"cveun":"11025","cvesun":"15","nombresun":"San Francisco del Rincón"},{"cveun":"11031","cvesun":"15","nombresun":"San Francisco del Rincón"},{"cveun":"11021","cvesun":"16","nombresun":"Moroleón-Uriangato"},{"cveun":"11041","cvesun":"16","nombresun":"Moroleón-Uriangato"},{"cveun":"12001","cvesun":"17","nombresun":"Acapulco"},{"cveun":"12021","cvesun":"17","nombresun":"Acapulco"},{"cveun":"13022","cvesun":"18","nombresun":"Pachuca"},{"cveun":"13039","cvesun":"18","nombresun":"Pachuca"},{"cveun":"13048","cvesun":"18","nombresun":"Pachuca"},{"cveun":"13051","cvesun":"18","nombresun":"Pachuca"},{"cveun":"13052","cvesun":"18","nombresun":"Pachuca"},{"cveun":"13082","cvesun":"18","nombresun":"Pachuca"},{"cveun":"13083","cvesun":"18","nombresun":"Pachuca"},{"cveun":"13016","cvesun":"19","nombresun":"Tulancingo"},{"cveun":"13056","cvesun":"19","nombresun":"Tulancingo"},{"cveun":"13077","cvesun":"19","nombresun":"Tulancingo"},{"cveun":"13010","cvesun":"20","nombresun":"Tula"},{"cveun":"13013","cvesun":"20","nombresun":"Tula"},{"cveun":"13070","cvesun":"20","nombresun":"Tula"},{"cveun":"13074","cvesun":"20","nombresun":"Tula"},{"cveun":"13076","cvesun":"20","nombresun":"Tula"},{"cveun":"14039","cvesun":"21","nombresun":"Guadalajara"},{"cveun":"14044","cvesun":"21","nombresun":"Guadalajara"},{"cveun":"14051","cvesun":"21","nombresun":"Guadalajara"},{"cveun":"14070","cvesun":"21","nombresun":"Guadalajara"},{"cveun":"14097","cvesun":"21","nombresun":"Guadalajara"},{"cveun":"14098","cvesun":"21","nombresun":"Guadalajara"},{"cveun":"14101","cvesun":"21","nombresun":"Guadalajara"},{"cveun":"14120","cvesun":"21","nombresun":"Guadalajara"},{"cveun":"14067","cvesun":"22","nombresun":"Puerto Vallarta"},{"cveun":"18020","cvesun":"22","nombresun":"Puerto Vallarta"},{"cveun":"14063","cvesun":"23","nombresun":"Ocotlán"},{"cveun":"14066","cvesun":"23","nombresun":"Ocotlán"},{"cveun":"15005","cvesun":"24","nombresun":"Toluca"},{"cveun":"15018","cvesun":"24","nombresun":"Toluca"},{"cveun":"15027","cvesun":"24","nombresun":"Toluca"},{"cveun":"15051","cvesun":"24","nombresun":"Toluca"},{"cveun":"15054","cvesun":"24","nombresun":"Toluca"},{"cveun":"15055","cvesun":"24","nombresun":"Toluca"},{"cveun":"15062","cvesun":"24","nombresun":"Toluca"},{"cveun":"15067","cvesun":"24","nombresun":"Toluca"},{"cveun":"15072","cvesun":"24","nombresun":"Toluca"},{"cveun":"15073","cvesun":"24","nombresun":"Toluca"},{"cveun":"15076","cvesun":"24","nombresun":"Toluca"},{"cveun":"15087","cvesun":"24","nombresun":"Toluca"},{"cveun":"15106","cvesun":"24","nombresun":"Toluca"},{"cveun":"15115","cvesun":"24","nombresun":"Toluca"},{"cveun":"15118","cvesun":"24","nombresun":"Toluca"},{"cveun":"16022","cvesun":"25","nombresun":"Morelia"},{"cveun":"16053","cvesun":"25","nombresun":"Morelia"},{"cveun":"16088","cvesun":"25","nombresun":"Morelia"},{"cveun":"16043","cvesun":"26","nombresun":"Zamora-Jacona"},{"cveun":"16108","cvesun":"26","nombresun":"Zamora-Jacona"},{"cveun":"11023","cvesun":"27","nombresun":"La Piedad-Pénjamo"},{"cveun":"16069","cvesun":"27","nombresun":"La Piedad-Pénjamo"},{"cveun":"17007","cvesun":"28","nombresun":"Cuernavaca"},{"cveun":"17008","cvesun":"28","nombresun":"Cuernavaca"},{"cveun":"17009","cvesun":"28","nombresun":"Cuernavaca"},{"cveun":"17011","cvesun":"28","nombresun":"Cuernavaca"},{"cveun":"17018","cvesun":"28","nombresun":"Cuernavaca"},{"cveun":"17020","cvesun":"28","nombresun":"Cuernavaca"},{"cveun":"17024","cvesun":"28","nombresun":"Cuernavaca"},{"cveun":"17028","cvesun":"28","nombresun":"Cuernavaca"},{"cveun":"17002","cvesun":"29","nombresun":"Cuautla"},{"cveun":"17004","cvesun":"29","nombresun":"Cuautla"},{"cveun":"17006","cvesun":"29","nombresun":"Cuautla"},{"cveun":"17026","cvesun":"29","nombresun":"Cuautla"},{"cveun":"17029","cvesun":"29","nombresun":"Cuautla"},{"cveun":"17030","cvesun":"29","nombresun":"Cuautla"},{"cveun":"18008","cvesun":"30","nombresun":"Tepic"},{"cveun":"18017","cvesun":"30","nombresun":"Tepic"},{"cveun":"19006","cvesun":"31","nombresun":"Monterrey"},{"cveun":"19009","cvesun":"31","nombresun":"Monterrey"},{"cveun":"19010","cvesun":"31","nombresun":"Monterrey"},{"cveun":"19018","cvesun":"31","nombresun":"Monterrey"},{"cveun":"19019","cvesun":"31","nombresun":"Monterrey"},{"cveun":"19021","cvesun":"31","nombresun":"Monterrey"},{"cveun":"19026","cvesun":"31","nombresun":"Monterrey"},{"cveun":"19031","cvesun":"31","nombresun":"Monterrey"},{"cveun":"19039","cvesun":"31","nombresun":"Monterrey"},{"cveun":"19045","cvesun":"31","nombresun":"Monterrey"},{"cveun":"19046","cvesun":"31","nombresun":"Monterrey"},{"cveun":"19048","cvesun":"31","nombresun":"Monterrey"},{"cveun":"19049","cvesun":"31","nombresun":"Monterrey"},{"cveun":"20067","cvesun":"32","nombresun":"Oaxaca"},{"cveun":"20083","cvesun":"32","nombresun":"Oaxaca"},{"cveun":"20087","cvesun":"32","nombresun":"Oaxaca"},{"cveun":"20091","cvesun":"32","nombresun":"Oaxaca"},{"cveun":"20107","cvesun":"32","nombresun":"Oaxaca"},{"cveun":"20115","cvesun":"32","nombresun":"Oaxaca"},{"cveun":"20157","cvesun":"32","nombresun":"Oaxaca"},{"cveun":"20174","cvesun":"32","nombresun":"Oaxaca"},{"cveun":"20227","cvesun":"32","nombresun":"Oaxaca"},{"cveun":"20293","cvesun":"32","nombresun":"Oaxaca"},{"cveun":"20338","cvesun":"32","nombresun":"Oaxaca"},{"cveun":"20350","cvesun":"32","nombresun":"Oaxaca"},{"cveun":"20375","cvesun":"32","nombresun":"Oaxaca"},{"cveun":"20385","cvesun":"32","nombresun":"Oaxaca"},{"cveun":"20390","cvesun":"32","nombresun":"Oaxaca"},{"cveun":"20399","cvesun":"32","nombresun":"Oaxaca"},{"cveun":"20403","cvesun":"32","nombresun":"Oaxaca"},{"cveun":"20409","cvesun":"32","nombresun":"Oaxaca"},{"cveun":"20519","cvesun":"32","nombresun":"Oaxaca"},{"cveun":"20539","cvesun":"32","nombresun":"Oaxaca"},{"cveun":"20553","cvesun":"32","nombresun":"Oaxaca"},{"cveun":"20565","cvesun":"32","nombresun":"Oaxaca"},{"cveun":"20079","cvesun":"33","nombresun":"Tehuantepec"},{"cveun":"20124","cvesun":"33","nombresun":"Tehuantepec"},{"cveun":"20515","cvesun":"33","nombresun":"Tehuantepec"},{"cveun":"21001","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"21015","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"21034","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"21041","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"21048","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"21060","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"21074","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"21090","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"21106","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"21114","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"21119","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"21122","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"21125","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"21132","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"21136","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"21140","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"21143","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"21163","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"21181","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"29015","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"29017","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"29019","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"29022","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"29023","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"29025","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"29027","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"29028","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"29029","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"29032","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"29041","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"29042","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"29044","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"29051","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"29053","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"29054","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"29056","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"29057","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"29058","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"29059","cvesun":"34","nombresun":"Puebla-Tlaxcala"},{"cveun":"21149","cvesun":"35","nombresun":"Tehuacán"},{"cveun":"21156","cvesun":"35","nombresun":"Tehuacán"},{"cveun":"22006","cvesun":"36","nombresun":"Querétaro"},{"cveun":"22008","cvesun":"36","nombresun":"Querétaro"},{"cveun":"22011","cvesun":"36","nombresun":"Querétaro"},{"cveun":"22014","cvesun":"36","nombresun":"Querétaro"},{"cveun":"23003","cvesun":"37","nombresun":"Cancún"},{"cveun":"23005","cvesun":"37","nombresun":"Cancún"},{"cveun":"24028","cvesun":"38","nombresun":"San Luis Potosí-Soledad de Graciano Sánchez"},{"cveun":"24035","cvesun":"38","nombresun":"San Luis Potosí-Soledad de Graciano Sánchez"},{"cveun":"24011","cvesun":"39","nombresun":"Ríoverde-Ciudad Fernández"},{"cveun":"24024","cvesun":"39","nombresun":"Ríoverde-Ciudad Fernández"},{"cveun":"26025","cvesun":"40","nombresun":"Guaymas"},{"cveun":"26029","cvesun":"40","nombresun":"Guaymas"},{"cveun":"27004","cvesun":"41","nombresun":"Villahermosa"},{"cveun":"27013","cvesun":"41","nombresun":"Villahermosa"},{"cveun":"28003","cvesun":"42","nombresun":"Tampico"},{"cveun":"28009","cvesun":"42","nombresun":"Tampico"},{"cveun":"28038","cvesun":"42","nombresun":"Tampico"},{"cveun":"30123","cvesun":"42","nombresun":"Tampico"},{"cveun":"30133","cvesun":"42","nombresun":"Tampico"},{"cveun":"28032","cvesun":"43","nombresun":"Reynosa-Río Bravo"},{"cveun":"28033","cvesun":"43","nombresun":"Reynosa-Río Bravo"},{"cveun":"28022","cvesun":"44","nombresun":"Matamoros"},{"cveun":"28027","cvesun":"45","nombresun":"Nuevo Laredo"},{"cveun":"29001","cvesun":"46","nombresun":"Tlaxcala-Apizaco"},{"cveun":"29002","cvesun":"46","nombresun":"Tlaxcala-Apizaco"},{"cveun":"29005","cvesun":"46","nombresun":"Tlaxcala-Apizaco"},{"cveun":"29009","cvesun":"46","nombresun":"Tlaxcala-Apizaco"},{"cveun":"29010","cvesun":"46","nombresun":"Tlaxcala-Apizaco"},{"cveun":"29018","cvesun":"46","nombresun":"Tlaxcala-Apizaco"},{"cveun":"29024","cvesun":"46","nombresun":"Tlaxcala-Apizaco"},{"cveun":"29026","cvesun":"46","nombresun":"Tlaxcala-Apizaco"},{"cveun":"29031","cvesun":"46","nombresun":"Tlaxcala-Apizaco"},{"cveun":"29033","cvesun":"46","nombresun":"Tlaxcala-Apizaco"},{"cveun":"29035","cvesun":"46","nombresun":"Tlaxcala-Apizaco"},{"cveun":"29036","cvesun":"46","nombresun":"Tlaxcala-Apizaco"},{"cveun":"29038","cvesun":"46","nombresun":"Tlaxcala-Apizaco"},{"cveun":"29039","cvesun":"46","nombresun":"Tlaxcala-Apizaco"},{"cveun":"29043","cvesun":"46","nombresun":"Tlaxcala-Apizaco"},{"cveun":"29048","cvesun":"46","nombresun":"Tlaxcala-Apizaco"},{"cveun":"29049","cvesun":"46","nombresun":"Tlaxcala-Apizaco"},{"cveun":"29050","cvesun":"46","nombresun":"Tlaxcala-Apizaco"},{"cveun":"29060","cvesun":"46","nombresun":"Tlaxcala-Apizaco"},{"cveun":"30011","cvesun":"47","nombresun":"Veracruz"},{"cveun":"30028","cvesun":"47","nombresun":"Veracruz"},{"cveun":"30090","cvesun":"47","nombresun":"Veracruz"},{"cveun":"30105","cvesun":"47","nombresun":"Veracruz"},{"cveun":"30193","cvesun":"47","nombresun":"Veracruz"},{"cveun":"30026","cvesun":"48","nombresun":"Xalapa"},{"cveun":"30038","cvesun":"48","nombresun":"Xalapa"},{"cveun":"30065","cvesun":"48","nombresun":"Xalapa"},{"cveun":"30087","cvesun":"48","nombresun":"Xalapa"},{"cveun":"30093","cvesun":"48","nombresun":"Xalapa"},{"cveun":"30136","cvesun":"48","nombresun":"Xalapa"},{"cveun":"30182","cvesun":"48","nombresun":"Xalapa"},{"cveun":"30033","cvesun":"49","nombresun":"Poza Rica"},{"cveun":"30040","cvesun":"49","nombresun":"Poza Rica"},{"cveun":"30124","cvesun":"49","nombresun":"Poza Rica"},{"cveun":"30131","cvesun":"49","nombresun":"Poza Rica"},{"cveun":"30175","cvesun":"49","nombresun":"Poza Rica"},{"cveun":"30022","cvesun":"50","nombresun":"Orizaba"},{"cveun":"30030","cvesun":"50","nombresun":"Orizaba"},{"cveun":"30074","cvesun":"50","nombresun":"Orizaba"},{"cveun":"30081","cvesun":"50","nombresun":"Orizaba"},{"cveun":"30085","cvesun":"50","nombresun":"Orizaba"},{"cveun":"30099","cvesun":"50","nombresun":"Orizaba"},{"cveun":"30101","cvesun":"50","nombresun":"Orizaba"},{"cveun":"30115","cvesun":"50","nombresun":"Orizaba"},{"cveun":"30118","cvesun":"50","nombresun":"Orizaba"},{"cveun":"30135","cvesun":"50","nombresun":"Orizaba"},{"cveun":"30138","cvesun":"50","nombresun":"Orizaba"},{"cveun":"30185","cvesun":"50","nombresun":"Orizaba"},{"cveun":"30048","cvesun":"51","nombresun":"Minatitlán"},{"cveun":"30059","cvesun":"51","nombresun":"Minatitlán"},{"cveun":"30089","cvesun":"51","nombresun":"Minatitlán"},{"cveun":"30108","cvesun":"51","nombresun":"Minatitlán"},{"cveun":"30120","cvesun":"51","nombresun":"Minatitlán"},{"cveun":"30199","cvesun":"51","nombresun":"Minatitlán"},{"cveun":"30039","cvesun":"52","nombresun":"Coatzacoalcos"},{"cveun":"30082","cvesun":"52","nombresun":"Coatzacoalcos"},{"cveun":"30206","cvesun":"52","nombresun":"Coatzacoalcos"},{"cveun":"30014","cvesun":"53","nombresun":"Córdoba"},{"cveun":"30044","cvesun":"53","nombresun":"Córdoba"},{"cveun":"30068","cvesun":"53","nombresun":"Córdoba"},{"cveun":"30196","cvesun":"53","nombresun":"Córdoba"},{"cveun":"30003","cvesun":"54","nombresun":"Acayucan"},{"cveun":"30116","cvesun":"54","nombresun":"Acayucan"},{"cveun":"30145","cvesun":"54","nombresun":"Acayucan"},{"cveun":"31013","cvesun":"55","nombresun":"Mérida"},{"cveun":"31041","cvesun":"55","nombresun":"Mérida"},{"cveun":"31050","cvesun":"55","nombresun":"Mérida"},{"cveun":"31100","cvesun":"55","nombresun":"Mérida"},{"cveun":"31101","cvesun":"55","nombresun":"Mérida"},{"cveun":"32017","cvesun":"56","nombresun":"Zacatecas-Guadalupe"},{"cveun":"32032","cvesun":"56","nombresun":"Zacatecas-Guadalupe"},{"cveun":"32056","cvesun":"56","nombresun":"Zacatecas-Guadalupe"},{"cveun":"11007","cvesun":"57","nombresun":"Celaya"},{"cveun":"11009","cvesun":"57","nombresun":"Celaya"},{"cveun":"11044","cvesun":"57","nombresun":"Celaya"},{"cveun":"15006","cvesun":"58","nombresun":"Tianguistenco"},{"cveun":"15012","cvesun":"58","nombresun":"Tianguistenco"},{"cveun":"15019","cvesun":"58","nombresun":"Tianguistenco"},{"cveun":"15043","cvesun":"58","nombresun":"Tianguistenco"},{"cveun":"15098","cvesun":"58","nombresun":"Tianguistenco"},{"cveun":"15101","cvesun":"58","nombresun":"Tianguistenco"},{"cveun":"21054","cvesun":"59","nombresun":"Teziutlán"},{"cveun":"21174","cvesun":"59","nombresun":"Teziutlán"},{"cveun":"","cvesun":"","nombresun":""},{"cveun":"","cvesun":"","nombresun":""}];

var localidades = [{"cveun":"020010001","cvesun":"60","nombresun":"Ensenada"},{"cveun":"020010247","cvesun":"60","nombresun":"Ensenada"},{"cveun":"030080001","cvesun":"61","nombresun":"San José del Cabo"},{"cveun":"030080247","cvesun":"61","nombresun":"San José del Cabo"},{"cveun":"030080304","cvesun":"61","nombresun":"San José del Cabo"},{"cveun":"030080054","cvesun":"62","nombresun":"Cabo San Lucas"},{"cveun":"030080753","cvesun":"62","nombresun":"Cabo San Lucas"},{"cveun":"030080952","cvesun":"62","nombresun":"Cabo San Lucas"},{"cveun":"040020001","cvesun":"63","nombresun":"Campeche"},{"cveun":"040020087","cvesun":"63","nombresun":"Campeche"},{"cveun":"050280003","cvesun":"64","nombresun":"Nueva Rosita-Cloete "},{"cveun":"050320014","cvesun":"64","nombresun":"Nueva Rosita-Cloete "},{"cveun":"060070001","cvesun":"65","nombresun":"Manzanillo"},{"cveun":"060070021","cvesun":"65","nombresun":"Manzanillo"},{"cveun":"070890001","cvesun":"66","nombresun":"Tapachula de Córdova y Ordóñez"},{"cveun":"070890150","cvesun":"66","nombresun":"Tapachula de Córdova y Ordóñez"},{"cveun":"070890991","cvesun":"66","nombresun":"Tapachula de Córdova y Ordóñez"},{"cveun":"070891025","cvesun":"66","nombresun":"Tapachula de Córdova y Ordóñez"},{"cveun":"110050001","cvesun":"67","nombresun":"Apaseo el Grande"},{"cveun":"110050051","cvesun":"67","nombresun":"Apaseo el Grande"},{"cveun":"110150001","cvesun":"68","nombresun":"Guanajuato"},{"cveun":"110150067","cvesun":"68","nombresun":"Guanajuato"},{"cveun":"110150126","cvesun":"68","nombresun":"Guanajuato"},{"cveun":"110170001","cvesun":"69","nombresun":"Irapuato"},{"cveun":"110170059","cvesun":"69","nombresun":"Irapuato"},{"cveun":"110170359","cvesun":"69","nombresun":"Irapuato"},{"cveun":"110280001","cvesun":"70","nombresun":"Salvatierra"},{"cveun":"110280064","cvesun":"70","nombresun":"Salvatierra"},{"cveun":"110330001","cvesun":"71","nombresun":"San Luis de la Paz"},{"cveun":"110330110","cvesun":"71","nombresun":"San Luis de la Paz"},{"cveun":"120110001","cvesun":"72","nombresun":"Atoyac de Álvarez"},{"cveun":"120110071","cvesun":"72","nombresun":"Atoyac de Álvarez"},{"cveun":"120290001","cvesun":"73","nombresun":"Chilpancingo de los Bravo"},{"cveun":"120290047","cvesun":"73","nombresun":"Chilpancingo de los Bravo"},{"cveun":"120500001","cvesun":"74","nombresun":"Ciudad Altamirano-Riva Palacio"},{"cveun":"160770067","cvesun":"74","nombresun":"Ciudad Altamirano-Riva Palacio"},{"cveun":"120570001","cvesun":"75","nombresun":"Técpan de Galeana"},{"cveun":"120570086","cvesun":"75","nombresun":"Técpan de Galeana"},{"cveun":"130030001","cvesun":"76","nombresun":"Actopan"},{"cveun":"130030005","cvesun":"76","nombresun":"Actopan"},{"cveun":"130030014","cvesun":"76","nombresun":"Actopan"},{"cveun":"130230012","cvesun":"76","nombresun":"Actopan"},{"cveun":"130540019","cvesun":"76","nombresun":"Actopan"},{"cveun":"130280001","cvesun":"77","nombresun":"Huejutla de Reyes"},{"cveun":"130280042","cvesun":"77","nombresun":"Huejutla de Reyes"},{"cveun":"130300001","cvesun":"78","nombresun":"Ixmiquilpan"},{"cveun":"130300035","cvesun":"78","nombresun":"Ixmiquilpan"},{"cveun":"130410001","cvesun":"79","nombresun":"Mixquiahuala-Progreso"},{"cveun":"130500001","cvesun":"79","nombresun":"Mixquiahuala-Progreso"},{"cveun":"130610001","cvesun":"80","nombresun":"Ciudad Sahagún-Tepeapulco"},{"cveun":"130610002","cvesun":"80","nombresun":"Ciudad Sahagún-Tepeapulco"},{"cveun":"130630001","cvesun":"81","nombresun":"Tepeji de Ocampo"},{"cveun":"130630020","cvesun":"81","nombresun":"Tepeji de Ocampo"},{"cveun":"130630021","cvesun":"81","nombresun":"Tepeji de Ocampo"},{"cveun":"130050001","cvesun":"82","nombresun":"Tetepango-Ajacuba"},{"cveun":"130650001","cvesun":"82","nombresun":"Tetepango-Ajacuba"},{"cveun":"130670001","cvesun":"83","nombresun":"Tezontepec de Aldama"},{"cveun":"130670005","cvesun":"83","nombresun":"Tezontepec de Aldama"},{"cveun":"130670006","cvesun":"83","nombresun":"Tezontepec de Aldama"},{"cveun":"130670008","cvesun":"83","nombresun":"Tezontepec de Aldama"},{"cveun":"130670009","cvesun":"83","nombresun":"Tezontepec de Aldama"},{"cveun":"130670020","cvesun":"83","nombresun":"Tezontepec de Aldama"},{"cveun":"140180001","cvesun":"84","nombresun":"La Barca-Briseñas"},{"cveun":"160110001","cvesun":"84","nombresun":"La Barca-Briseñas"},{"cveun":"160110004","cvesun":"84","nombresun":"La Barca-Briseñas"},{"cveun":"140300002","cvesun":"85","nombresun":"Ajijic"},{"cveun":"140300005","cvesun":"85","nombresun":"Ajijic"},{"cveun":"140500001","cvesun":"86","nombresun":"Jocotepec"},{"cveun":"140500002","cvesun":"86","nombresun":"Jocotepec"},{"cveun":"150140001","cvesun":"87","nombresun":"Atlacomulco de Fabela"},{"cveun":"150140057","cvesun":"87","nombresun":"Atlacomulco de Fabela"},{"cveun":"150420002","cvesun":"88","nombresun":"Los Baños"},{"cveun":"150420017","cvesun":"88","nombresun":"Los Baños"},{"cveun":"150420030","cvesun":"88","nombresun":"Los Baños"},{"cveun":"150420001","cvesun":"89","nombresun":"Santo Domingo de Guzmán (antes Ixtlahuaca)"},{"cveun":"150420007","cvesun":"89","nombresun":"Santo Domingo de Guzmán (antes Ixtlahuaca)"},{"cveun":"150420024","cvesun":"89","nombresun":"Santo Domingo de Guzmán (antes Ixtlahuaca)"},{"cveun":"150420029","cvesun":"89","nombresun":"Santo Domingo de Guzmán (antes Ixtlahuaca)"},{"cveun":"150420034","cvesun":"89","nombresun":"Santo Domingo de Guzmán (antes Ixtlahuaca)"},{"cveun":"150420035","cvesun":"89","nombresun":"Santo Domingo de Guzmán (antes Ixtlahuaca)"},{"cveun":"150740008","cvesun":"90","nombresun":"San Nicolás Guadalupe"},{"cveun":"150740097","cvesun":"90","nombresun":"San Nicolás Guadalupe"},{"cveun":"150740098","cvesun":"90","nombresun":"San Nicolás Guadalupe"},{"cveun":"150850001","cvesun":"91","nombresun":"Temascalcingo de José María Velasco"},{"cveun":"150850014","cvesun":"91","nombresun":"Temascalcingo de José María Velasco"},{"cveun":"150880001","cvesun":"92","nombresun":"Tenancingo de Degollado"},{"cveun":"150880017","cvesun":"92","nombresun":"Tenancingo de Degollado"},{"cveun":"150880073","cvesun":"92","nombresun":"Tenancingo de Degollado"},{"cveun":"150900001","cvesun":"93","nombresun":"Tenango de Arista"},{"cveun":"150900039","cvesun":"93","nombresun":"Tenango de Arista"},{"cveun":"160520001","cvesun":"94","nombresun":"Ciudad Lázaro Cárdenas"},{"cveun":"160520077","cvesun":"94","nombresun":"Ciudad Lázaro Cárdenas"},{"cveun":"160520137","cvesun":"94","nombresun":"Ciudad Lázaro Cárdenas"},{"cveun":"161020001","cvesun":"95","nombresun":"Uruapan"},{"cveun":"161020061","cvesun":"95","nombresun":"Uruapan"},{"cveun":"161020110","cvesun":"95","nombresun":"Uruapan"},{"cveun":"161020119","cvesun":"95","nombresun":"Uruapan"},{"cveun":"140160072","cvesun":"96","nombresun":"Yurécuaro-La Ribera"},{"cveun":"161060001","cvesun":"96","nombresun":"Yurécuaro-La Ribera"},{"cveun":"161100001","cvesun":"97","nombresun":"Zinapécuaro de Figueroa"},{"cveun":"161100006","cvesun":"97","nombresun":"Zinapécuaro de Figueroa"},{"cveun":"161120001","cvesun":"98","nombresun":"Zitácuaro"},{"cveun":"161120082","cvesun":"98","nombresun":"Zitácuaro"},{"cveun":"170120001","cvesun":"99","nombresun":"Jojutla-Tlaquiltenango"},{"cveun":"170250001","cvesun":"99","nombresun":"Jojutla-Tlaquiltenango"},{"cveun":"180100035","cvesun":"100","nombresun":"Tuxpan"},{"cveun":"180180001","cvesun":"100","nombresun":"Tuxpan"},{"cveun":"200570001","cvesun":"101","nombresun":"Matías Romero Avendaño"},{"cveun":"204270010","cvesun":"101","nombresun":"Matías Romero Avendaño"},{"cveun":"200680001","cvesun":"102","nombresun":"Ocotlán de Morelos"},{"cveun":"201030001","cvesun":"102","nombresun":"Ocotlán de Morelos"},{"cveun":"201500001","cvesun":"103","nombresun":"San Francisco Telixtlahuaca-San Pablo Huitzo"},{"cveun":"202940001","cvesun":"103","nombresun":"San Francisco Telixtlahuaca-San Pablo Huitzo"},{"cveun":"201840001","cvesun":"104","nombresun":"San Juan Bautista Tuxtepec"},{"cveun":"201840050","cvesun":"104","nombresun":"San Juan Bautista Tuxtepec"},{"cveun":"203180009","cvesun":"105","nombresun":"Puerto Escondido-Zicatela"},{"cveun":"204010050","cvesun":"105","nombresun":"Puerto Escondido-Zicatela"},{"cveun":"210040001","cvesun":"106","nombresun":"Acatzingo de Hidalgo"},{"cveun":"210040002","cvesun":"106","nombresun":"Acatzingo de Hidalgo"},{"cveun":"210380001","cvesun":"106","nombresun":"Acatzingo de Hidalgo"},{"cveun":"211180001","cvesun":"106","nombresun":"Acatzingo de Hidalgo"},{"cveun":"211180007","cvesun":"106","nombresun":"Acatzingo de Hidalgo"},{"cveun":"210100001","cvesun":"107","nombresun":"Ciudad de Ajalpan"},{"cveun":"210130001","cvesun":"107","nombresun":"Ciudad de Ajalpan"},{"cveun":"210170001","cvesun":"108","nombresun":"Atempan"},{"cveun":"211730001","cvesun":"108","nombresun":"Atempan"},{"cveun":"212040001","cvesun":"108","nombresun":"Atempan"},{"cveun":"210510001","cvesun":"109","nombresun":"Atencingo-Chietla"},{"cveun":"210510003","cvesun":"109","nombresun":"Atencingo-Chietla"},{"cveun":"210530001","cvesun":"110","nombresun":"Ciudad de Chignahuapan"},{"cveun":"210530092","cvesun":"110","nombresun":"Ciudad de Chignahuapan"},{"cveun":"210710001","cvesun":"111","nombresun":"Huauchinango"},{"cveun":"210710009","cvesun":"111","nombresun":"Huauchinango"},{"cveun":"210710008","cvesun":"112","nombresun":"Nuevo Necaxa-Tenango"},{"cveun":"210710027","cvesun":"112","nombresun":"Nuevo Necaxa-Tenango"},{"cveun":"210910001","cvesun":"112","nombresun":"Nuevo Necaxa-Tenango"},{"cveun":"211830022","cvesun":"112","nombresun":"Nuevo Necaxa-Tenango"},{"cveun":"211040001","cvesun":"113","nombresun":"Nopalucan de la Granja-Ciudad de Rafael Lara Grajales"},{"cveun":"211170001","cvesun":"113","nombresun":"Nopalucan de la Granja-Ciudad de Rafael Lara Grajales"},{"cveun":"211100011","cvesun":"114","nombresun":"Palmarito Tochapan"},{"cveun":"211100023","cvesun":"114","nombresun":"Palmarito Tochapan"},{"cveun":"211150009","cvesun":"114","nombresun":"Palmarito Tochapan"},{"cveun":"211150018","cvesun":"114","nombresun":"Palmarito Tochapan"},{"cveun":"211540001","cvesun":"115","nombresun":"Tecamachalco"},{"cveun":"211540021","cvesun":"115","nombresun":"Tecamachalco"},{"cveun":"211640001","cvesun":"116","nombresun":"Tepeaca"},{"cveun":"211640020","cvesun":"116","nombresun":"Tepeaca"},{"cveun":"212070001","cvesun":"117","nombresun":"Zacapoaxtla"},{"cveun":"212070005","cvesun":"117","nombresun":"Zacapoaxtla"},{"cveun":"212070021","cvesun":"117","nombresun":"Zacapoaxtla"},{"cveun":"212080001","cvesun":"118","nombresun":"Zacatlán"},{"cveun":"212080004","cvesun":"118","nombresun":"Zacatlán"},{"cveun":"212080015","cvesun":"118","nombresun":"Zacatlán"},{"cveun":"230040001","cvesun":"119","nombresun":"Chetumal"},{"cveun":"230040016","cvesun":"119","nombresun":"Chetumal"},{"cveun":"250010136","cvesun":"120","nombresun":"Juan José Ríos"},{"cveun":"250110138","cvesun":"120","nombresun":"Juan José Ríos"},{"cveun":"260180001","cvesun":"121","nombresun":"Ciudad Obregón"},{"cveun":"260180364","cvesun":"121","nombresun":"Ciudad Obregón"},{"cveun":"260180284","cvesun":"122","nombresun":"Esperanza"},{"cveun":"260180311","cvesun":"122","nombresun":"Esperanza"},{"cveun":"270020001","cvesun":"123","nombresun":"Cárdenas"},{"cveun":"270020051","cvesun":"123","nombresun":"Cárdenas"},{"cveun":"270050001","cvesun":"124","nombresun":"Comalcalco"},{"cveun":"270050058","cvesun":"124","nombresun":"Comalcalco"},{"cveun":"270120001","cvesun":"125","nombresun":"Macuspana"},{"cveun":"270120016","cvesun":"125","nombresun":"Macuspana"},{"cveun":"270140001","cvesun":"126","nombresun":"Paraíso"},{"cveun":"270140027","cvesun":"126","nombresun":"Paraíso"},{"cveun":"290130001","cvesun":"127","nombresun":"Huamantla"},{"cveun":"290130016","cvesun":"127","nombresun":"Huamantla"},{"cveun":"300130001","cvesun":"128","nombresun":"Naranjos"},{"cveun":"300600007","cvesun":"128","nombresun":"Naranjos"},{"cveun":"300160001","cvesun":"129","nombresun":"José Cardel"},{"cveun":"301340003","cvesun":"129","nombresun":"José Cardel"},{"cveun":"300450001","cvesun":"130","nombresun":"Cosamaloapan-Carlos A. Carrillo"},{"cveun":"302080001","cvesun":"130","nombresun":"Cosamaloapan-Carlos A. Carrillo"},{"cveun":"211990001","cvesun":"131","nombresun":"Jalacingo-San Juan Xiutetelco"},{"cveun":"211990009","cvesun":"131","nombresun":"Jalacingo-San Juan Xiutetelco"},{"cveun":"211990016","cvesun":"131","nombresun":"Jalacingo-San Juan Xiutetelco"},{"cveun":"300860001","cvesun":"131","nombresun":"Jalacingo-San Juan Xiutetelco"},{"cveun":"300230250","cvesun":"132","nombresun":"Martínez de la Torre"},{"cveun":"301020001","cvesun":"132","nombresun":"Martínez de la Torre"},{"cveun":"301020030","cvesun":"132","nombresun":"Martínez de la Torre"},{"cveun":"301600001","cvesun":"133","nombresun":"Álamo"},{"cveun":"301600041","cvesun":"133","nombresun":"Álamo"},{"cveun":"301600052","cvesun":"133","nombresun":"Álamo"},{"cveun":"301890001","cvesun":"134","nombresun":"Túxpam de Rodríguez Cano"},{"cveun":"301890005","cvesun":"134","nombresun":"Túxpam de Rodríguez Cano"},{"cveun":"301890083","cvesun":"134","nombresun":"Túxpam de Rodríguez Cano"},{"cveun":"302040001","cvesun":"135","nombresun":"Agua Dulce"},{"cveun":"302040017","cvesun":"135","nombresun":"Agua Dulce"},{"cveun":"310590001","cvesun":"136","nombresun":"Progreso"},{"cveun":"310590003","cvesun":"136","nombresun":"Progreso"},{"cveun":"310590004","cvesun":"136","nombresun":"Progreso"},{"cveun":"310590005","cvesun":"136","nombresun":"Progreso"},{"cveun":"320100001","cvesun":"137","nombresun":"Fresnillo"},{"cveun":"320100165","cvesun":"137","nombresun":"Fresnillo"},{"cveun":"","cvesun":"","nombresun":""}]

municipios.pop(); municipios.pop(); localidades.pop();


function cotejarDENUE() {
  var bulk = db.getCollection("denue").initializeUnorderedBulkOp();

  municipios.forEach(function(m) {
   bulk.find({ 'claveMun': m.cveun })
	.update({ '$set': { 'cveSUN': m.cvesun, 'nombreSUN': m.nombresun } });
  });

  localidades.forEach(function(l) {
   bulk.find({ 'claveLoc': l.cveun })
	.update({ '$set': { 'cveSUN': l.cvesun, 'nombreSUN': l.nombresun } });
  });

  bulk.execute();
};
