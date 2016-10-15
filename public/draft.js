var session = {},
  	matchKey = window.location.pathname.split('/')[2],
  	teamId = window.location.pathname.split('/')[3],
  	socket = io('/'+matchKey),
  	teamNum = 0,
  	otherTeamNum = function () { return (teamNum%2) + 1 },
  	champs = [
	  { id: 0 },
	  { id: 1 },
	  { id: 2 },
	  { id: 3 },
	  { id: 4 },
	  { id: 5 },
	  { id: 6 },
	  { id: 7 },
	  { id: 9 }
	];

//socket.emit('joinDraft', matchKey);
  	
// wraps the socket.on bindings to avoid updating state for each thing
// stateName - Name of the socket event
// f - handler for the socket event
var onState = function(stateName, f) {
  socket.on(stateName, function() {
  	var args = Array.prototype.slice.call(arguments);
  	// session state will always be the first argument 
  	session=args.shift();
  	if (ractive) {
  		ractive.set('session', session);
  	}
  	console.log('Logging session: ');
  	console.log(session);
  	f.call(this, args);
  });
}


var submitHandler = function(event, team) {
	// only allow the this team to ready itself
	console.log('submitReady');
	if (team === teamNum) {
		socket.emit('teamReady', team);	 
	}	
	else {
		console.log('team: ' + team + ' teamNum: ' + teamNum);
	}
}



var submitCharHandler = function(event, charId) {
	// used a stupid hack to keep DRY'ness on the buttons
	// would like to figure out a better way
	// uses keypath to identify which team is picking
	var banned = [],
		teams = session.stageState.teams,
		isBan = session.stageTag.indexOf('ban') !== -1,
		isPick = session.stageTag.indexOf('pick') !== -1;
		
	if (session.stageState.teamTurn !== teamNum) {
		alert('It is not your turn. Better luck next time.');
		return;
	}
	
	var unavailable = [];
	
	if (isBan) {
		unavailable = teams[otherTeamNum()].picked.concat(teams[otherTeamNum()].banned);
	}
	if (isPick) {
		console.log('isPick');
		unavailable = teams[teamNum].picked.concat(teams[teamNum].banned);
	}
	
	for (i = 0; i < unavailable.length; i++) {
		if (unavailable[i] === charId) {
			alert('Character ' + charId + ' has already been picked or is banned, try again');
			return;
		}
	}
	
	if (isBan) {
		socket.emit('banChar', charId, teamNum === 1 ? 2 : 1);
	}
	if (isPick) {
		socket.emit('pickChar', charId, teamNum);
	}
}

onState('teamReady', function(team) {
  // change the ready button to show it's been clicked
});

onState('pickCharStage', function(data) {
	ractive.resetPartial('stage')
	console.log(data);
});

loaded = false;
var ractive;

onState('getState', function() { 
	console.log('getState');
	
	if (!loaded && session !== undefined) {
		if (teamId === session.team1Name) {
			teamNum = 1;
		}
		if (teamId === session.team2Name) {
			teamNum = 2;
		}
		
		ractive = new Ractive({
			// The `el` option can be a node, an ID, or a CSS selector.
			el: '#ractiveRoot',
			template: '#draftTemplate',
			// Here, we're passing in some initial data
			data: {
			  'session': session,
			  team1: {
			  	'champs': champs
			  },
			  team2: {
			  	'champs': champs
			  }
			}
		});
		
		ractive.on('submitChar', submitCharHandler);
		ractive.on('submitReady', submitHandler);
		// ractive.on('submitPick', submitPickHandler);
		// ractive.on('submitBan', submitBanHandler);
	}
	
	return; 
});

socket.emit('getState');
