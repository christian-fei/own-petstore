var fs = require("fs");
function getConfiguration( file ){
	try{
		var content = fs.readFileSync( file );
		return JSON.parse( content );
	}catch( e ){
		console.log( "failed loading " + file );
		throw new Error("failed loading " + file);
	}
}
module.exports = {
	getConfiguration: getConfiguration
};