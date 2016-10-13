var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(9090);

state = {
	count : 0,
	sessions: {}
};

// singleton model of the stages, order of the array is 
// the order in which the stages will occur
stages = [
	{
		stageTag: 'readyStage',
		stageState: {
			player1Ready: false,
			player2Ready: false
		}		
	},
	{
		stageTag: 'pickCharStage',
		stageState: {
			player1Picked: [],
			player2Picked: [],
			playerTurn: 1
		}
	}
];

function genId() {
	return ++state.count;
}

function createDraft(formData) {
	console.log(formData);
	session = {
		matchKey : formData.matchKey,
		team1Name : formData.team1Name,
		team2Name : formData.team2Name,
		numBans : formData.numBans,
		observerId : 'obs'
	};
	
	session = nextStage(session);
	
	state.sessions[session.matchKey] = session;
	
	return session;
}

// do something like a state pattern
function nextStage(session) {
	var retStage = function(newStage) {
		session.stageTag = newStage.stageTag;
		session.stageState = newStage.stageState;
		
		return session;
	}
	
	if (!session || !session.stageTag) {
		return retStage(stages[0]);
	}
	
	for(i = 0; i < stages.length; i++) {
		if (session.stageTag === stages[i].stageTag) {
			if (i + 1 < stages.length) {
				return retStage(stages[i+1]);
			}
		} 
	}
}

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
	
	io.sockets.on('connection', function (socket) {
	 // socket.on('getState', function() { socket})
	  console.log('somebody connected, yay');
	  
	  socket.on('createDraft', function(formData) { 
	  	console.log('createDraft');
	  	socket.emit('draftCreated', createDraft(formData));
	  });
	});
});

app.get('/drafts/:matchKey/:role', function (req, res) {
	matchKey = req.params.matchKey;
	roleId = req.params.role;
	session = state.sessions[matchKey];
	
	res.sendFile(__dirname + '/draft.html');
	
	io.sockets.on('connection', function (socket) {
		socket.join(matchKey);
		socket.to(matchKey).emit('getState', session);
		socket.on('getState', function() { socket.emit('getState', session); });
		
		socket.on('playerReady', function(playerNum) {
			if (session.stageTag !== 'readyStage') {
				return;
			}
			
			console.log(session);
			if (playerNum === 1) {
				session.stageState.player1Ready = true;
			}
			if (playerNum === 2) {
				session.stageState.player2Ready = true;
			}
			
			if (session.stageState.player1Ready && session.stageState.player2Ready) {
				nextStage(session);
				console.log(session.stageTag);
				socket.emit(session.stageTag, session);
			}
		});
	});
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});

