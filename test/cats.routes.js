const assert = require('chai').assert;
const Hapi = require('hapi');
const sinon = require('sinon');

const server = new Hapi.Server();
let sanbox;

server.connection({ port: 9999 });


describe('cat route tests', () => {

	before((done) => {
		server.register([require('../lib/plugins/data/register'), require('../lib/plugins/cats/register')], done);
	});

	after((done) => {
		server.methods.data.teardown({})
			.then(() => {
				done();
			})
			.catch(done)
	});

	describe('GET /cats tests', () => {
		describe('error tests', () => {
			let sandbox;
			before((done) => {
				sandbox = sinon.sandbox.create();
				sandbox.stub(server.plugins.data.models.cat, 'find', (cb) => {
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
					url: '/cats?limit=5'
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
			it('should be able to get a list of cats', (done) => {
				let req = {
					method: 'GET',
					url: '/cats?limit=5'
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

	describe('GET /cats/id tests', () => {
		let catId;

		before((done) => {
			server.methods.cats.create({ breed: 'tabby', color: 'colorful', depawed: true })
				.then((data) => {
					catId = data.id;
					done();
				})
				.catch(done);
		});

		it('should be able to get a cat by id', (done) => {
			let req = {
				method: 'GET',
				url: '/cats/' + catId
			};

			server.inject(req)
				.then((res) => {
					assert.equal(res.statusCode, 200);
					done();
				})
				.catch(done);

		});

		it('should respond with a 404 on trying to get a cat that doesnt exist', (done) => {
			let req = {
				method: 'GET',
				url: '/cats/4434'
			};

			server.inject(req)
				.then((res) => {
					assert.equal(res.statusCode, 404);
					done();
				})
				.catch(done);

		});
	});

	describe('POST /cats tests', () => {
		describe('success tests', () => {
			it('should be able to create a cat', (done) => {
				let req = {
					method: 'POST',
					url: '/cats',
					payload: {
						breed: 'tabby',
						color: 'white'
					}
				};

				server.inject(req)
					.then((res) => {
						assert.equal(res.statusCode, 201);
						done();
					})
					.catch(done);

			});
		});

		describe('error tests', () => {
			let sandbox;
			before((done) => {
				sandbox = sinon.sandbox.create();
				sandbox.stub(server.plugins.data.models.cat, 'create', (cb) => {
					cb(new Error('died'));
				});
				done();
			});

			after((done) => {
				sandbox.restore();
				done();
			});

			it('should fail on creating a cat', (done) => {
				let req = {
					method: 'POST',
					url: '/cats',
					payload: {
						breed: 'tabby',
						color: 'white'
					}
				};

				server.inject(req)
					.then((res) => {
						assert.equal(res.statusCode, 500);
						done();
					})
					.catch(done);

			});
		});
	});

	describe('DELETE /cats/id tests', () => {
		let catId;

		before((done) => {
			server.methods.cats.create({ breed: 'tabby', color: 'colorful', depawed: true })
				.then((data) => {
					catId = data.id;
					done();
				})
				.catch(done);
		});

		it('should be able to remove a cat', (done) => {
			let req = {
				method: 'DELETE',
				url: '/cats/' + catId
			};

			server.inject(req)
				.then((res) => {
					assert.equal(res.statusCode, 200);
					done();
				})
				.catch(done);

		});

		it('should respond with a 404 on trying to delete a cat that doesnt exist', (done) => {
			let req = {
				method: 'DELETE',
				url: '/cats/4434'
			};

			server.inject(req)
				.then((res) => {
					assert.equal(res.statusCode, 404);
					done();
				})
				.catch(done);

		});
	});
});
