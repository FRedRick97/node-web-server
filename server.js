const 
	http = require('http'),
	url = require('url'),
	path = require('path'),
	fs = require('fs');

var mimeTypes = {
	"html": "text/html",
	"jpeg": "image/jpeg",
	"jpg": "image/jpg",
	"png": "image/png",
	"js": "text/javascript",
	"css": "text/css"
};

http.createServer(function(req, res) {
	var uri = url.parse(req.url).pathname;
	var filename = path.join(__dirname, uri);
	console.log(`loading ${uri}`);
	var stats;
	try {
		stats = fs.statSync(filename);
	} catch(e) {
		res.writeHead(404, {'Content-Type': 'text/plain'});
		res.write('404 not found');
		res.end();
		return;
	}
	if(stats.isFile()) {
		var mimeType = mimeTypes[path.extname(filename).split(".").reverse()[0]];
		res.writeHead(200, {'Content-Type': mimeType});

		var fileStream = fs.createReadStream(filename).pipe(res);
	} else if(stats.isDirectory()) {
		res.writeHead(302, { // redirecting
			'Location': 'index.html'
		});
		res.end();
	} else {
		res.writeHead(500, { 'Content-Type': 'text/plain'});
		res.write('500 internal error');
		res.end();
	}
}).listen(3000,'127.0.0.1', function() {
	console.log('Server is up on port 3000');
});


// http.createServer(function(req, res) {
// 	res.writeHead(200, {'Content-Type': 'text/html'});
// 	res.end('<h1>Hello world</h1>');
// }).listen(3000,'127.0.0.1', function() {
// 	console.log('Server is up on port 3000');
// });
