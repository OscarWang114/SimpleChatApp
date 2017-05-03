const express = require('express')
, fs = require('fs')
, https = require('https')
, helmet = require('helmet');
, path = require('path');

var http = require('http');

var app = express();
app.use(helmet());

var sslPath = '/etc/letsencrypt/live/simplemapchat.tk/';
var options = {
	key: fs.readFileSync(sslPath + 'privkey.pem'),
	cert: fs.readFileSync(sslPath + 'fullchain.pem')
};

var server = https.createServer(options, app);
//var server = http.createServer(app);

var io = require('socket.io').listen(server);

users = [];
connections =[];

server.listen(8000);
//server.listen( process.env.PORT || 3000);
console.log('Server has started...');

app.use(express.static(path.join(__dirname, '/public')));

app.get('/',function(req, res){
	res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/^\/&/')

io.on('connect',function(socket){
	connections.push(socket);
	console.log('Connected: %d sockets connected.', connections.length);
	
	//Disconnect
	socket.on('disconnect',function(data){
		if("undefined" !== typeof socket.username){
			users.splice(users.indexOf(socket.username), 1);
			updateUserNames();
		}
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %d sockets conneted.',connections.length);
	});

	//Send Message
	socket.on('send message',function(data){
		socket.emit('new message', {msg:data.msg});
		socket.broadcast.emit('new message from others', {usr:socket.username, msg:data.msg});
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