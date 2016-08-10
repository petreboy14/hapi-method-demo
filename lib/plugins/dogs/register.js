const Promise = require('bluebird');

exports.register = function (server, options, next) {
	server.route({
		method: 'GET',
		path: '/dogs',
		handler: (request, reply) => {
			server.methods.dogs.getMany(request.query)
				.then((data) => {
					reply(data);
				})
				.catch((err) => {
					reply(err);
				});
		},
		config: {
			tags: ['api'],
			description: 'Get a bunch of dogs'
		}
	});

	server.method('dogs.getMany', (filters, cb) => {
		return server.plugins.data.models.dog.find(filters)
			.then((data) => {
				return data;
			}).nodeify(cb);
	});

	server.method('dogs.create', (data, cb) => {
		return server.plugins.data.models.dog.create(data)
			.then((data) => {
				return data;
			}).nodeify(cb);
	});

	server.methods.dogs.getMany = Promise.promisify(server.methods.dogs.getMany);
	server.methods.dogs.create = Promise.promisify(server.methods.dogs.create);

	next();
};

exports.register.attributes = require('./package');
