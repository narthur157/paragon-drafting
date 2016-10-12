var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(9090);

state = {
	count : 0,
	sessions: {}
};

function genId() {
	return ++state.count;
}

function createDraft(socket, name) {
	session = {
		draftId : genId(),
		teamId1 : 1,
		teamId2 : 2,
		observerId : 3,
		stageTag: 'not-ready',
		stageState: {
			player1Ready: false,
			player2Ready: false
		}
	};
	
	state.sessions[session.draftId] = session;
	
	return session;
}

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
	
	io.sockets.on('connection', function (socket) {
	 // socket.on('getState', function() { socket})
	  console.log('somebody connected, yay');
	  
	  socket.on('createDraft', function(name) { 
	  	console.log('createDraft');
	  	socket.emit('createDraft', createDraft(socket, name));
	  });
	});
});

app.get('/drafts/:room([0-9]+)/:role', function (req, res) {
	draftId = req.params.room;
	roleId = req.params.role;
	session = state.sessions[draftId];
	
	res.sendFile(__dirname + '/draft.html');
	
	io.sockets.on('connection', function (socket) {
		socket.join(draftId);
		socket.to(draftId).emit('getState', session);
	});
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});

