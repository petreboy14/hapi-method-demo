const Promise = require('bluebird');
const fs = require('fs');

function registerMethods(server) {
	let methods = {};
	let methodFiles = fs.readdirSync(`${__dirname}/../methods/`);

	methodFiles.forEach(function (methodFile) {
	  var method = require(`${__dirname}/../methods/${methodFile}`);
	  for (var item in method) {
	    methods[item] = method[item];
	  }
	});

	for (var method in methods) {
		var options = methods[method].config || {};
		options.bind = server;

		server.method(method, methods[method].fn, options);
		const path = method.split('.');
	    let ref = server.methods;
	    for (let i = 0, il = path.length; i < il; ++i) {
	    	if (ref[path[i]] instanceof Function) {
	            ref[path[i]] = Promise.promisify(ref[path[i]]);
	          }
			  ref = ref[path[i]];
	    }
	}
}

exports.registerMethods = registerMethods;
