var express = require('express')
,   http = require('http');

var app = express();
var server = http.createServer(app);
//Original http.creatServer(function(req, res){});
/*
express() returns a function. That function takes the req and res connection
argument that the http request event passes in.
Express also adds numerous properties and methods to the function 
(remember that JavaScript functions are also objects!), and those are 
the Express API.
*/

var io = require('socket.io').listen(server);

users = [];
connections =[];

server.listen(process.env.PORT || 80);
console.log('Server has started...');
/*
In many envirnonments (e.g. Heroku), and as a convention, you can set
the environment variable PORT to tell your webs server what port to 
listen to.

process.env.PORT means: whatever is in the environment variable PORT, 
or 3000 if there's nothing there.
*/

app.get('/',function(req, res){
	res.sendFile(__dirname+'/index.html');
});

app.use(express.static(__dirname+'/public'));

io.on('connect',function(socket){
	connections.push(socket);
	console.log('Connected: %d sockets connected.', connections.length);
	
	//Disconnect
	socket.on('disconnect',function(data){
		users.splice(users.indexOf(socket.username), 1);
		updateUserNames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %d sockets conneted.',connections.length);
	});

	//Send Message
	socket.on('send message',function(data){
		//responds to the send message event.
		socket.emit('new message', {msg:data.msg});
		socket.broadcast.emit('new message from others', {usr:socket.username, msg:data.msg});
		//emits the new message event and sends an anonymous object.
	});

	//New User
	socket.on('new user',function(data, callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUserNames();
	});

	function updateUserNames(){
		io.emit('get users', users);
	}
});


/*
We call the default namespace '/' and it's the one Socket.IO clients
connect to by default, and the one the server listens to by default.
The namespace is identified by io.sockets or simply io.

Each namespace emits a connection event that receives each Socket
instance as a parameter.

The string 'connection' is the event name. You can use your 
own event names

array.splice(index, howMany, [element1][,...,elementN]);
You can add new elements while removing old elements.
https://www.tutorialspoint.com/javascript/array_splice.htm
*/ 