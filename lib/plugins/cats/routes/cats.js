const Joi = require('joi');

class CatRoute {
	getMany(request, reply) {
		let options = {};
		options.limit = request.query.limit;
		options.offset = request.query.offset;

		this.methods.cats.getMany(options)
			.then((data) => {
				reply(data);
			})
			.catch((err) => {
				reply(err);
			});
	}

	getOne(request, reply) {
		this.methods.cats.getOne(request.params.id)
			.then((data) => {
				reply(data);
			})
			.catch((err) => {
				reply(err);
			});
	}

	create(request, reply) {
		this.methods.cats.create(request.payload)
			.then((data) => {
				reply(data).code(201);
			})
			.catch((err) => {
				reply(err);
			});
	}

	remove(request, reply) {
		this.methods.cats.remove(request.params.id)
			.then((data) => {
				reply(data);
			})
			.catch((err) => {
				reply(err);
			});
	}
};

const catRoute = new CatRoute();

module.exports = [
	{
		method: 'GET',
		path: '/cats',
		handler: catRoute.getMany,
		config: {
			description: 'get many cats',
			tags: ['api'],
			validate: {
				query: {
					limit: Joi.number().integer().default(25),
					offset: Joi.number().integer().default(0)
				}
			}
		}
	},
	{
		method: 'GET',
		path: '/cats/{id}',
		handler: catRoute.getOne,
		config: {
			description: 'get a cat by id',
			tags: ['api'],
			validate: {
				params: {
					id: Joi.number().integer().required()
				}
			}
		}
	},
	{
		method: 'POST',
		path: '/cats',
		handler: catRoute.create,
		config: {
			description: 'create a cat',
			tags: ['api'],
			validate: {
				payload: {
					breed: Joi.string().required(),
					color: Joi.string().allow(['white', 'black', 'colorful']),
					depawed: Joi.boolean().default(true)
				}
			}
		}
	},
	{
		method: 'DELETE',
		path: '/cats/{id}',
		handler: catRoute.remove,
		config: {
			description: 'deletes a cat',
			tags: ['api'],
			validate: {
				params: {
					id: Joi.number().integer().required()
				}
			}
		}
	}
];
