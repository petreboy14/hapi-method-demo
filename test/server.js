const server = require('../lib/server');

describe('server tests', () => {
	it('should be able to start a server', (done) => {
		server.start()
			.then(() => {
				done();
			})
			.catch(done);
	});

	it('should be able to stop the server', (done) => {
		server.stop()
			.then(() => {
				done();
			})
			.catch(done);
	});
});
