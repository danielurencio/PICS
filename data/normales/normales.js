var conn = new Mongo();
var db = conn.getDB("PICS");

var tempMax = db.normales.aggregate([
 { '$match': { 'medición':'temperatura máxima'} },
 { "$group": {
    "_id":"$cveMun",
    "temperatura máxima": { '$avg':"$valor medio" }
 } }
]).toArray();

var tempMin = db.normales.aggregate([
 { '$match': { 'medición':'temperatura mínima'} },
 { "$group": {
    "_id":"$cveMun",
    "temperatura mínima": { '$avg':"$valor medio" }
 } }
]).toArray();

var precip = db.normales.aggregate([
 { '$match': { 'medición':'precipitación'} },
 { "$group": {
    "_id":"$cveMun",
    "precipitación": { '$avg':"$valor medio" }
 } }
]).toArray();

var array = [];


for(var i in tempMax) {
 for(var j in tempMin) {
//  for(var k in precip) {

    if( tempMax[i]._id == tempMin[j]._id /*&& tempMin._id == precip[k]._id */) {
	var obj = {};
	obj.cveMun = tempMin[j]._id;
	obj.tempMax = tempMax[i]['temperatura máxima'];
	obj.tempMin = tempMin[j]['temperatura mínima'];
//	obj.precip = precip[j]['precipitación'];

	array.push(obj);
    }

//  }
 }
}

for(var i in array) {
 for(var j in precip) {
  if( array[i].cveMun == precip[j]._id ) array[i].precip = precip[j]['precipitación'];
 }
}

array.forEach(function(d) {
 db.clima.insert(d);
});
