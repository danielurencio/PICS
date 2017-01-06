var conn = new Mongo();
var db = conn.getDB("test");

function AG(col,value) {
var group = 
 { "$group": {
    "_id": { "value1":"$"+value + 1, "value2":"$"+value + 2, "value3":"$"+value + 3  },
    "sun": { "$push":"$cveSUN" }
   }
 };

return db.getCollection(col).aggregate([group]).toArray();
}



function unwind(col,variable) {
  var group = [ 
    { '$unwind':'$sun' },
    { '$project': {
       "_id":'$sun'
    } }
  ];

  group[1]['$project'][variable] = 1;
  return db.getCollection(col).aggregate(group).toArray();
 }


function assign(data,values,name) {

 for(var i in data) {

  var arr = [];
  for(var j in data[i]._id) {
    arr.push( String( data[i]._id[j] ) + "," );
  }
  arr = arr.reduce(function sum(a,b) { return a + b; });
  data[i]._id = arr.substring(0,arr.length -1);

  for(var j in values) {
    if( data[i]._id == values[j]._id ) data[i][name] = values[j].value; 
  }
 }

}

function reDO(col,values,name) {
 var count = db.getCollection(col).find().count();

 if( count == 0 ) {
  var a = AG("potencial",col);
  assign(a,values,name);
  db.getCollection(col).insert(a);
  var a = unwind(col,name);
  db.getCollection(col).drop();
  db.getCollection(col).insert(a);
 }
}

function todos() {
 reDO("solar",solar,"irradiación");
 reDO("eolica",eolica,"potencia/m2");
 reDO("geotermia",geotermia,"temperatura");
 reDO("residuos",residuos,"TJ");

 var s = db.solar.find().toArray();
 var e = db.eolica.find().toArray();
 var g = db.geotermia.find().toArray();
 var r = db.residuos.find().toArray();

var b = [e,g,r];

for(var u in b) { 
 var key = Object.keys(b[u][0])[1];

 for(var i in s) {
  for(var j in b[u]) {
   if( s[i]._id == b[u][j]._id ) s[i][key] = b[u][j][key];
  }
 }

}
  db.potencial.drop();
  db.potencial.insert(s);
}

var solar = [
 { _id:"170,222,0",value:"3.5-4.0" },
 { _id:"193,232,0",value:"4.0-4.5" },
 { _id:"255,162,0",value: "7.0-7.5" },
 { _id:"255,255,255",value: "na" },
 { _id:"242,250,0",value: "5.0-5.5" },
 { _id:"255,136,0",value:"7.5-8.0" },
 { _id:"255,242,0",value:"5.5-6-0" },
 { _id:"255,187,0",value: "6.5-7.0" },
 { _id:"255,213,0",value: "6.0-6.5" },
 { _id:"216,240,0",value: "4.5-5.0" }
];


var eolica = [
 { _id:"62,134,179",value:"600-700" },
 { _id:"101,158,194",value:"500-600" },
 { _id:"255,0,0",value:"1200 o más" },
 { _id:"177,207,224",value:"300-400" },
 { _id:"148,183,209",value:"400-500" },
 { _id:"216,231,240",value:"200-300" },
 { _id:"252,252,252",value:"0-200" }
];


var geotermia = [
 { _id:"255,89,0",value:"211-220" },
 { _id:"255,221,0",value:"121-130" },
 { _id:"255,132,0",value:"181-190" },
 { _id:"255,179,0",value:"151-160" },
 { _id:"255,251,0",value:"101-110" },
 { _id:"255,255,138",value:"48-50" },
 { _id:"255,145,0",value:"171-180" },
 { _id:"255,115,0",value:"191-200" },
 { _id:"255,162,0",value:"161-170" },
 { _id:"255,208,0",value:"131-140" },
 { _id:"255,191,0",value:"141-150" },
 { _id:"255,102,0",value:"201-210" },
 { _id:"255,255,255",value:"na" },
 { _id:"255,255,107",value:"51-54" }
];


var residuos = [
 { _id:"255,255,255",value:"na" },
 { _id:"204,99,0",value:"2501-4500" },
 { _id:"250,144,57",value:"1001-2500" },
 { _id:"255,203,150",value:"101-350" },
 { _id:"255,173,102",value:"351-1000" },
 { _id:"255,235,204",value:"1-100" }
];

function arreglarBlancos() {
	var a = db.potencial.find({ '_id':144 }).toArray()[0];
	a.temperatura = "48-50";
	db.potencial.update({ _id:144 },a);

	var a = db.potencial.find({ '_id':326 }).toArray()[0];
	a.temperatura = "51-54";
	db.potencial.update({ _id:326 },a);

	var a = db.potencial.find({ '_id':145 }).toArray()[0];
	a.temperatura = "51-54";
	db.potencial.update({ _id:145 },a);

	var a = db.potencial.find({ '_id':63 }).toArray()[0];
	a.temperatura = "51-54";
	db.potencial.update({ _id:63 },a);

	var a = db.potencial.find({ '_id':303 }).toArray()[0];
	a.temperatura = "51-54";
	a.irradiación = "4.5-5.0";
	db.potencial.update({ _id:303 },a);

	var a = db.potencial.find({ '_id':2 }).toArray()[0];
	a.irradiación = "5.5-6.0";
	db.potencial.update({ _id:2 }, a);
}

todos();
