var mongo = require("mongodb");

var db, petsCollection;

mongo.connect("mongodb://localhost:27017/petstore", function(err,_db){
	if( err ){
		console.log( "error connceting to mongo".red.bold );
		throw err;
	};
	console.log( "connected to mongo".green.bold );
	db = _db;
	petsCollection = db.collection("pets");
});

function _pets(filter, callback){
	if( typeof filter == "function" ){
		callback = filter;
		filter = {};
	}
	if( filter.tags ){
		var tagsObj = filter,
			tagsArr = [];

		for( var index in tagsObj ){
			var tag = tagsObj[index];
			tagsArr.push( tag );
		}

		petsCollection.find({tags: {$all: tagsArr}}).toArray(function(err, data){
			callback( data );
		});
	}else{
		petsCollection.find(filter).toArray(function(err, data){
			callback( data );
		});
	}
}
function _pet(id, callback){
	try {
		var realId = mongo.ObjectID(id);
		petsCollection.find({_id: realId}).toArray(function(err, data){
			callback( data );
		});
	}catch( e ){
		callback( {} );
	}
}
function _create(pet, callback){
	console.log( pet );
	petsCollection.insert(pet, function(err, data){
		console.log(err,data);
		callback( data );
	});
}

module.exports = {
	pets: _pets,
	pet: _pet,
	create: _create
};