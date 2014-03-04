var cr = require("./configReader");

var config;
try{
	config = cr.getConfiguration("config.json");
}catch(e){
	console.log( e )
	process.exit(1);
}

var restify = require("restify"),
	server = restify.createServer(),
	routes = require("./api-routes"),
	colors = require("colors");


function _listen(){
	/*
		because :
		/pets/
		wouldn't match
		/pets
	*/
	server.pre(restify.pre.sanitizePath());


	server.use(restify.gzipResponse());
	server.use(restify.queryParser());
	server.use(restify.bodyParser());


	server.get('/pets', routes.pets);
	server.get('/pets/:id', routes.pet);

	server.post('/pets', routes.petCreate);

	server.listen(config.api.port, function() {
		console.log('API server listening at %s'.green.bold, server.url);
	});
}



module.exports = {
	listen: _listen
};

