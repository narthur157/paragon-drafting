var defaults = require('./defaults.js');
var draftSession = require('./draftSession.js')
var sessions = {};
var io = require('socket.io').listen(9090);

module.exports = {
	start: function() {
		draftSession.setIo(io);
		io.of('create').on('connection', function (socket) {
		 	socket.on('createDraft', function(formData) { 
				console.log('createDraft');
				var resp = createDraft(formData) || sessions[formData.matchKey];
				
			 	socket.emit('draftCreated', resp);
			});
		});
	}
};

/*
team 1 bans
team 2 bans
team 1 picks one hero
team 2 picks two heroes
team 1 picks two heroes
team 2 picks two heroes
team 1 pick two heroes
team 2 picks one hero
*/
function createDraft(formData) {
	console.log(formData);
	
	if (sessions[formData.matchKey]) {
		console.log(sessions[formData.matchKey]);
		console.log('tried to create duplicate session');
		return;
	}
	
	var session = defaults.draftSession(formData.matchKey, formData.numBans, formData.team1Name, formData.team2Name);
	
	sessions[session.matchKey] = session;
	room = io.of(session.matchKey);
	
	// session._timing = setTimeout(function() {
	// 	draftSession.nextStage(session);
	// }, session.stageState.timeLeft);
	
	room.on('connection', bindDraftSocket.bind(this, session));
	
	return session;
}

function bindDraftSocket(session, socket) {
	console.log('match connect');
	socket.emit('getState', session); 
	
	socket.on('getState', draftSession.getState.bind(this, session));
	
	socket.on('teamReady', draftSession.teamReady.bind(this, session));
	// ban the character for team teamNum on behalf of 
	// the other team
	socket.on('banChar', draftSession.banChar.bind(this, session));
	
	socket.on('pickChar', draftSession.pickChar.bind(this, session));
}

