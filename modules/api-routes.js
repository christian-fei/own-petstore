var url = require("url"),
	mongoData = require("./mongo-data");

/*
    __         __                    
   / /_  ___  / /___  ___  __________
  / __ \/ _ \/ / __ \/ _ \/ ___/ ___/
 / / / /  __/ / /_/ /  __/ /  (__  ) 
/_/ /_/\___/_/ .___/\___/_/  /____/  
            /_/                      
*/
function isValidStatus(status){
	if( !status )return false;
	return status == "available" || status == "sold" || status == "dead";
}
function _pets(req,res){
	var query = url.parse(req.url,true).query;

	if( query.status ){
		_petsByStatus( req, res , query );
		return;
	}
	if( query.tags ){
		_petsByTags( req, res , query );
		return;
	}
	console.log( "=log= ".red.bold +"serving a list of all pets" );

	mongoData.pets( function(data){
		console.log(data);
		res.send( data );
		res.end();
	});
}
function _petsByStatus(req,res,filter){
	var _filter = {};
	if( filter &&  isValidStatus(filter.status) ){
		console.log( "=log= ".red.bold +"serving a list of pets by specific status ("+ filter.status.green + ")" );
		_filter = filter;
	}else{
		console.log( "=log= ".red.bold +"invalid status: " + filter.status );
	}
	mongoData.pets( _filter, function(data){
		console.log(data);
		res.send( data );
		res.end();
	});
}

function _petsByTags(req,res,filter){
	var _filter = {};
	if( filter && filter.tags ){
		var tags = filter.tags.split(",");
		_filter.tags = tags;
		console.log( "=log= ".red.bold +"serving a list of pets by specific tags ("+ filter.tags.green + ")" );
		_filter = filter;
	}else{
		console.log( "=log= ".red.bold +"invalid status: " + filter.tags );
	}
	console.log("filtering", _filter );
	mongoData.pets( _filter, function(data){
		console.log(data);
		res.send( data );
		res.end();
	});
}

function _pet(req,res){
		var id = req.params.id;
		console.log( "=log= ".red.bold +"serving a specific pet #"+ id );
		mongoData.pet( id, function(data){
			console.log(data);
			res.send( data );
			res.end();
		});
}

function isValidPet(pet){
	return pet && pet.name && pet.status && pet.category && pet.tags && pet.tags instanceof Array;
}
function _petCreate(req,res){
	console.log( typeof req.body );
	try{
		var pet = JSON.parse( req.body );
		console.log( typeof pet );
		if( isValidPet(pet) ){
			console.log( "vliad pet" );
			mongoData.create( pet, function(data){
				console.log(data);
				res.send( data );
				res.end();
			});
		}else{
			console.log( "invliad pet" );
			res.send('{"error": "1","message": "json of the pet is invalid"}');
			res.end();
		}
	}catch( e ){
		console.log( e );
		console.log( "JSON parse error, invliad pet" );
		res.send('{"error": "1","message": "json of the pet is invalid"}');
		res.end();
	}
}
module.exports = {
	pets: _pets,
	petCreate: _petCreate,
	pet: _pet
};