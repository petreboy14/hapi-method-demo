const routeHelper = require('./helpers/routes');
const methodHelper = require('./helpers/methods');

exports.register = function (server, options, next) {
	routeHelper.registerRoutes(server);
	methodHelper.registerMethods(server);

	next();
};

exports.register.attributes = require('./package');
