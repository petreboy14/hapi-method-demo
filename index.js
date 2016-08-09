const Boom = require('boom');
const Hapi = require('hapi');
const Joi = require('joi');
const Promise = require('bluebird');

const token = require('./models/token');

// Initializing hapi server with caching strategy (redis)
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

// setting server to start on port 8080
server.connection({ port: 8080 });


// server method to persist a token
server.method('tokens.create', (data, cb) => {
	return token.getModel()
		.then((model) => {
			return model.create(data);
		}).nodeify(cb);
});

// server method to get a token. if the token is found in the persisted store
// it will both return the token and cache it
server.method('tokens.get', (params, cb) => {
	console.log('i am in the method');
	return token.getModel()
		.then((model) => {
			return model.findOne({ token: params.token });
		}).nodeify(cb);
}, {
	cache: {
		expiresIn: 10000,
		staleIn: 8000,
		staleTimeout: 500,
		generateTimeout: 500
	},
	generateKey: (params) => {
		return 'tokens-' + params.token
	}
});

// "verifies" that a token exists. If it can get it from the 'tokens.get' method
// then it will return the token. If it can't then it will error.
// Note: the first time you hit this route the token is not cached but it will be
// fetched from persistent storage and then cached. Hitting this route subsequent
// times (and by extension) the 'tokens.get' method will cause the token data to
// be returned from cache. After 10 seconds the token will fall out of cache but can
// still be retrieved from persistent storage. In the real world we'd want to have the
// ability to time out the persistent storage as well. 
server.route({
	method: 'GET',
	path: '/auth/token',
	handler: (request, reply) => {
		const params = request.query;

		server.methods.tokens.get(params)
			.then((token) => {
				if (token) {
					reply(token);
				} else {
					reply(Boom.unauthorized('not a valid refresh token'));
				}
			})
			.catch((err) => {
				reply(err);
			});
	},
	config: {
		validate: {
			query: {
				token: Joi.string().required()
			}
		}
	}
});

server.route({
	method: 'POST',
	path: '/auth/token',
	handler: (request, reply) => {
		const params = request.payload;

		server.methods.tokens.create(params)
			.then((token) => {
				reply(token);
			})
			.catch((err) => {
				reply(err);
			});
	},
	config: {
		validate: {
			payload: {
				token: Joi.string().required(),
				userId: Joi.string().required()
			}
		}
	}
});

server.methods.tokens.create = Promise.promisify(server.methods.tokens.create);
server.methods.tokens.get = Promise.promisify(server.methods.tokens.get);

server.start((err) => {
	if (err) {
		console.log(err);
	} else {
		console.log('server started on port: ' + server.info.port);
	}
})
