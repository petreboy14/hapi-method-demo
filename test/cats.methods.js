const assert = require('chai').assert;
const Hapi = require('hapi');
const server = new Hapi.Server();

server.connection({ port: 9999 });


describe('cat method tests', () => {
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

	describe('#getMany tests', () => {
		it('should be able to make a call to get many', (done) => {
			server.methods.cats.getMany({})
				.then((data) => {
					done();
				})
				.catch(done);
		});
	});

	describe('#getOne tests', () => {
		let catId;

		before((done) => {
			server.methods.cats.create({ breed: 'tabby', color: 'colorful', depawed: true })
				.then((data) => {
					catId = data.id;
					done();
				})
				.catch(done);
		});

		it('should be able to make a call to get one which will break when id does not exist', (done) => {
			server.methods.cats.getOne(9999)
				.then((data) => {
					done(new Error('should have broken'));
				})
				.catch((err) => {
					assert.equal(err.output.statusCode, 404);
					done();
				});
		});

		it('should be able to make a call which does get one cat', (done) => {
			server.methods.cats.getOne(catId)
				.then((data) => {
					assert.equal(data.id, catId);
					done();
				})
				.catch(done);
		});
	});

	describe('#create tests', () => {
		it('should be able to make a call to create a cat', (done) => {
			server.methods.cats.create({ breed: 'tabby', color: 'colorful', depawed: true })
				.then((data) => {
					assert.equal(data.breed, 'tabby');
					assert.equal(data.color, 'colorful');
					assert.equal(data.depawed, true);
					done();
				})
				.catch(done);
		})
	})



	describe('#delete tests', () => {
		let catId;

		before((done) => {
			server.methods.cats.create({ breed: 'tabby', color: 'colorful', depawed: true })
				.then((data) => {
					catId = data.id;
					done();
				})
				.catch(done);
		});

		it('should be to remove a cat', (done) => {
			server.methods.cats.remove(catId)
				.then((data) => {
					server.methods.cats.getOne(catId)
						.then(() => {
							done(new Error('shouldnt have been found'));
						})
						.catch(() => {
							done();
						});
				});
		});
	});
});
