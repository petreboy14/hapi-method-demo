const assert = require('chai').assert;
const Hapi = require('hapi');
const server = new Hapi.Server();

server.connection({ port: 9999 });


describe('dog method tests', () => {
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

	describe('#getMany tests', () => {
		it('should be able to make a call to get many', (done) => {
			server.methods.dogs.getMany({})
				.then((data) => {
					done();
				})
				.catch(done);
		});
	});

	describe('#create tests', () => {
		it('should be able to make a call to create a cat', (done) => {
			server.methods.dogs.create({ breed: 'husky', color: 'white', barkAsLoudAsBite: false })
				.then((data) => {
					assert.equal(data.breed, 'husky');
					assert.equal(data.color, 'white');
					assert.equal(data.barkAsLoudAsBite, false);
					done();
				})
				.catch(done);
		})
	})
});
