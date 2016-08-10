const Boom = require('boom');
const Promise = require('bluebird');

class CatMethod {
	getMany(params, cb) {
		return this.plugins.data.models.cat.find()
			.where(params.filters)
			.limit(params.limit)
			.skip(params.offset)
			.then((result) => {
				return result;
			}).nodeify(cb);
	}

	getOne(id, cb) {
		return this.plugins.data.models.cat.findOne(id)
			.then((result) => {
				if (!result) {
					throw Boom.notFound();
				}
				return result;
			}).nodeify(cb);
	}

	create(data, cb) {
		return this.plugins.data.models.cat.create(data)
			.then((result) => {
				return result;
			}).nodeify(cb);
	}

	remove(id, cb) {
		return this.methods.cats.getOne(id)
			.then(() => {
				return this.plugins.data.models.cat.destroy(id);
			}).nodeify(cb);
	}
}

const cat = new CatMethod();

module.exports = {
	'cats.getMany': {
		fn: cat.getMany
	},
	'cats.getOne': {
		fn: cat.getOne,
		options: {
			cache: {
				expiresIn: 10000,
				staleIn: 8000,
				staleTimout: 500,
				generateTimeout: 500
			}
		}
	},
	'cats.create': {
		fn: cat.create
	},
	'cats.remove': {
		fn: cat.remove
	}
};
