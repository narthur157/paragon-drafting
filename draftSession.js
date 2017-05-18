var drafting = require('./drafting.js');
console.log('drafting');
console.log(drafting);
var defaults = require('./defaults.js');

module.exports = {
	'teamReady' : teamReady,
	'banChar' : banChar,
	'pickChar' : pickChar,
	'getState' : getState,
	'setIo': setIo,
	'nextStage': nextStage
};

var io;

function setIo(i) { io = i; }

// Set the session stageTag and stageState
// Emit the appropriate event
function nextStage(session) {
	var defaultStageState = defaults.pickStageState();
	
	
	// if (session._timing) {
	// 	clearTimeout(session._timing);
	// }
	
	// // // automatically go to next 
	// session._timing = setTimeout(function() {
	// 	nextStage(session);
	// }, session.stageState.timeLeft);
	
	if (session.stageQueue.length === 0) {
		return false;
	}
	if (session.stageTag == 'readyStage') {
		session.stageState = defaultStageState;
	}
	
	tag = session.stageQueue.shift();
	session.stageTag = tag;
	// get this num from defaults.js
	session.stageState.timeLeft = 40;
	
	if (tag.indexOf('1') !== -1) {
		session.stageState.teamTurn = 1;
	}
	if (tag.indexOf('2') !== -1) {
		session.stageState.teamTurn = 2;
	}
	
	io.of(session.matchKey).emit('getState', session);
}

function charNotUsed(team, key, charId) {
	for (i = 0; i < team[key].length; i++) {
		if (team[key][i] === charId) {
			console.log('tried to ' + key + ' char twice');
			return false;
		}
	}
	
	return true;
}

function getState(session) {
	console.log('getState');
	console.log(session);
	room.emit('getState', session); 
}

function teamReady(session, teamNum) {
	if (session.stageTag !== 'readyStage') {
		return;
	}
	
	console.log('team ' + teamNum + ' ready');
	
	if (teamNum === 1) {
		session.stageState.team1Ready = true;
	}
	if (teamNum === 2) {
		session.stageState.team2Ready = true;
	}
	
	
	if (session.stageState.team1Ready && session.stageState.team2Ready) {
		nextStage(session);
	}
	else {
		io.of(session.matchKey).emit('getState', session);
	}
	
	console.log(session);
}

function banChar(session, charId, teamNum) {
	if (!session) {
		console.log('session not in closure');
	}
	console.log(session.stageTag);
	if (session.stageTag.indexOf('ban') === -1) {
		console.log('Client submitted char ban during wrong stage');
		return;
	}
	
	var team = session.stageState.teams[teamNum];
	
	if (!charNotUsed(team, 'banned', charId)) {
		return;
	}
	
	console.log('banning char ' + charId + ' on team ' + teamNum);
	
	team.banned.push(charId);
	nextStage(session);
}

// requires session to be in closure
function pickChar(session, charId, teamNum) {
	if (!session) {
		console.log('session not in closure');
	}
	if (session.stageTag.indexOf('pick') === -1) {
		console.log('Client submitted char pick during wrong stage');
		return;
	}	
	
	var team = session.stageState.teams[teamNum];
	
	if (!charNotUsed(team, 'picked', charId)) {
		return;
	}
	
	console.log('picking char ' + charId + ' from team ' + teamNum);
	
	team.picked.push(charId);
	nextStage(session);
}