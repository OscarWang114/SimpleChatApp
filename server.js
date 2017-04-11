var express = require('express')
, fs = require('fs')
, https = require('https')
, helmet = require('helmet');

var app = express();
app.use(helmet());

var sslPath = '/etc/letsencrypt/live/simplegooglemapchat.tk/';
var options = {
	key: fs.readFileSync(sslPath + 'privkey.pem'),
	cert: fs.readFileSync(sslPath + 'fullchain.pem')
};

var server = https.createServer(options, app);

var io = require('socket.io').listen(server);

users = [];
connections =[];

server.listen(8080);
console.log('Server has started...');

app.get('/',function(req, res){
	res.sendFile(__dirname+'/index.html');
});

app.use(express.static(__dirname+'/public'));

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