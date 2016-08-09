const Promise = require('bluebird');
const sailsMemoryAdapter = require('sails-memory');
const Waterline = require('waterline');

const waterline = new Waterline();

const token = Waterline.Collection.extend({
	identity: 'token',
	connection: 'default',
	attributes: {
		userId: 'string',
		token: 'string',
		enabled: 'boolean'
	}
});

let tokenModel = false;

waterline.loadCollection(token);

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

function getModel() {
	if (!tokenModel) {
		return new Promise((resolve, reject) => {
			waterline.initialize(config, (err, ontology) => {
				if (err) {
					return reject(err);
				}

				tokenModel = ontology.collections.token;
				resolve(tokenModel);
			});
		});

	} else {
		return Promise.resolve(tokenModel);
	}
}

exports.getModel = getModel;
