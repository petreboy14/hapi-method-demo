const fs = require('fs');
const pack = require('../package');

function registerRoutes(server) {
	var apis = [];
	var routes = fs.readdirSync(`${__dirname}/../routes/`);

	routes.forEach(function (route) {
    	var routeItems = require(`${__dirname}/../routes/${route}`);
		for (route of routeItems) {
			const config = route.config;
			config.bind = server;
			route.config = config;
		}
    	apis = apis.concat(routeItems);
	});

	server.route(apis);
}

exports.registerRoutes = registerRoutes;
