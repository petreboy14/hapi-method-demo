const Hapi = require('hapi');
const manifest = require('../manifest');

const server = new Hapi.Server({
	cache: [{
		name: 'redisCache',
		engine: require('catbox-redis'),
		host: '127.0.0.1'
	}],
	debug: {
		request: ['error', 'log']
	}
});

server.connection({ port: 8080 });

const plugins = []
for (plugin of manifest.plugins) {
	plugins.push(require('./plugins/' + plugin + '/register'));
}

function start(cb) {
	return server.register(plugins)
		.then(() => {
			return server.start();
		});
}

function stop() {
	return server.stop();
}

exports.start = start;
exports.stop = stop;
