var restify = require('restify');
var queue = [];

function sendQueue(req,res,next) {
	res.send(queue);
}

function clearQueue() {
	queue = [];
}

function removeFromQueue(val) {
	var i = queue.indexOf(val);
	console.log("i = "+i+", val = "+val);
	if(i >= 0)
		queue.splice(i,1);
}

function handleQueueNumber(req, res, next) {
	if(req.params != null) {
		console.log("q number = "+req.params.queueNumber);
		if(req.params.remove != null && req.params.remove=="true") {
			removeFromQueue(req.params.queueNumber);
		}
		res.send(200);
	} else {
		console.log("no queue number?");
		res.send(500);
	}
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
server.post('/queue/:queueNumber', handleQueueNumber);
server.del('/queue/:queueNumber', handleQueueNumber);

server.listen(4000, function() {
  console.log('%s listening at %s', server.name, server.url);
});