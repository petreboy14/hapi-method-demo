const assert = require('chai').assert;
const Hapi = require('hapi');
const sinon = require('sinon');

const server = new Hapi.Server();
let sanbox;

server.connection({ port: 9999 });


describe('dog route tests', () => {

	before((done) => {
		server.register([require('../lib/plugins/data/register'), require('../lib/plugins/dogs/register')], done);
	});

	after((done) => {
		server.methods.data.teardown({})
			.then(() => {
				done();
			})
			.catch(done)
	});

	describe('GET /dogs tests', () => {
		describe('error tests', () => {
			let sandbox;
			before((done) => {
				sandbox = sinon.sandbox.create();
				sandbox.stub(server.plugins.data.models.dog, 'find', (cb) => {
					cb(new Error('died'));
				});
				done();
			});

			after((done) => {
				sandbox.restore();
				done();
			});

			it('should 500 on a bad call', (done) => {
				let req = {
					method: 'GET',
					url: '/dogs?limit=5'
				};

				server.inject(req)
					.then((res) => {
						assert.equal(res.statusCode, 500);
						done();
					})
					.catch(done);
			});
		});

		describe('success tests', () => {
			it('should be able to get a list of dogs', (done) => {
				let req = {
					method: 'GET',
					url: '/dogs?limit=5'
				};

				server.inject(req)
					.then((res) => {
						assert.equal(res.statusCode, 200);
						done();
					})
					.catch(done);

			});
		});
	});
});
