var conn = new Mongo();
var db = conn.getDB("test");

function ag(col) {
return db.getCollection(col).aggregate([
  { '$group': {
    '_id': { 'r':'$r','g':'$g','b':'$b' },
    'sun': { '$push':'$cveSUN' }
  } }
 ]).toArray();;
}


function unwind(col,variable) {
 return db.getCollection(col).aggregate([
  { '$unwind':'$sun' },
  { '$project': {
     _id:'$sun',
     potencial:1
  } }
 ]).toArray();
}
