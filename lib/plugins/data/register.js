const Hoek = require('hoek');
const Promise = require('bluebird');
const sailsMemoryAdapter = require('sails-memory');
const Waterline = require('waterline');

const waterline = new Waterline();

const cat = Waterline.Collection.extend({
	identity: 'cat',
	connection: 'default',
	attributes: {
		breed: 'string',
		color: 'string',
		depawed: 'boolean'
	}
});

const dog = Waterline.Collection.extend({
	identity: 'dog',
	connection: 'default',
	attributes: {
		breed: 'string',
		color: 'string',
		barkAsLoudAsBite: 'boolean'
	}
});

waterline.loadCollection(cat);
waterline.loadCollection(dog);

const config = {
	adapters: {
		memory: sailsMemoryAdapter
	},

	connections: {
		default: {
			adapter: 'memory'
		}
	}
};


exports.register = function (server, options, next) {
	let waterlineConfig = Hoek.clone(config);

	for (const key in options) {
		waterlineConfig[key] = options[key];
	}

	try {
		waterline.initialize(waterlineConfig, (err, ontology) => {
			server.method('data.teardown', (opts, cb) => {
				return Promise.resolve(waterline.teardown()).nodeify(cb);
			});

			server.methods.data.teardown = Promise.promisify(server.methods.data.teardown);

			server.expose('models', ontology.collections);
			return next();
		});
	} catch(err) {
		waterline.teardown(() => {
			next(err);
		});
	}

};

exports.register.attributes = require('./package');
