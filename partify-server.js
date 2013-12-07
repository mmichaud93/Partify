var restify = require('restify');
var queue = [];


function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  
}

function sendQueue(req,res,next) {
	res.send(queue);
}

var server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.get(/assets\/.*/, restify.serveStatic({
	  directory: './public'
	}));

server.get('/',function(req,res,next){
	var body = require('fs').readFileSync(__dirname+"/public/index.html").toString();
	res.writeHead(200, {
	  'Content-Length': Buffer.byteLength(body),
	  'Content-Type': 'text/html'
	});
	res.write(body);
	res.end();
});
server.get('/queue', sendQueue);
server.post('/queue', function(req,res,next) {
	console.log(""+req.params.item);
	if (req.params.item != null) {
		queue.push(req.params.item);
		console.log("adding "+req.params.item+" to the queue.");
	}
	res.send(200);
});

server.listen(4000, function() {
  console.log('%s listening at %s', server.name, server.url);
});