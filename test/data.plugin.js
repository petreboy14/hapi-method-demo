const assert = require('chai').assert;
const Hapi = require('hapi');

const dataPlugin = require('../lib/plugins/data/register');

describe('data plugin tests', () => {
	describe('success tests', () => {
		let server;

		before((done) => {
			server = new Hapi.Server();
			server.connection({ port: 9999 });
			done();
		});

		after((done) => {
			server.methods.data.teardown({})
				.then(() => {
					done();
				})
				.catch(done);
		});

		it('should be able to load in data model', (done) => {
			server.register(dataPlugin)
				.then(() => {
					done();
				})
				.catch(done);
		});
	});

	describe('failure tests', () => {
		let server;

		before((done) => {
			server = new Hapi.Server();
			server.connection({ port: 9999 });

			done();
		});

		it('should return error if initializing of waterline does not work for some reason', (done) => {
			server.register({ register: dataPlugin, options: { adapters: 'foo', connections: 'bar' }})
				.then(() => {
					done(new Error('shoudlnt have worked'));
				})
				.catch((err) => {
					console.log(err);
					done();
				});
		});
	});
});
