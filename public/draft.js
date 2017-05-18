var session = {},
  	matchKey = window.location.pathname.split('/')[2],
  	teamId = window.location.pathname.split('/')[3],
  	socket = io('/'+matchKey),
  	teamNum = 0,
  	otherTeamNum = function () { return (teamNum%2) + 1 },
  	champs = [
	  { id: 0, url: '/assets/heroes/Hero_Portrait_Dekker.jpg', available: true},
	  { id: 1, url: '/assets/heroes/Hero_Portrait_Feng_Mao.jpg', available: true },
	  { id: 2, url: '/assets/heroes/Hero_Portrait_Gadget.jpg', available: true},
	  { id: 3, url: '/assets/heroes/Hero_Portrait_Gideon.jpg', available: true },
	  { id: 4, url: '/assets/heroes/Hero_Portrait_Greystone.png', available: true },
	  { id: 5, url: '/assets/heroes/Hero_Portrait_Grim.exe.jpg', available: true },
	  { id: 6, url: '/assets/heroes/Hero_Portrait_Grux.jpg.webp', available: true },
	  { id: 7, url: '/assets/heroes/Hero_Portrait_Howitzer.jpg.webp', available: true },
	  { id: 8, url: '/assets/heroes/Hero_Portrait_Iggy_and_Scorch.jpg.webp', available: true },
	  { id: 10, url: '/assets/heroes/Hero_Portrait_Kallari.jpg.webp', available: true },
	  { id: 11, url: '/assets/heroes/Hero_Portrait_Khaimera.png.webp', available: true },
	  { id: 12, url: '/assets/heroes/Hero_Portrait_Kwang.png.webp', available: true },
	  { id: 13, url: '/assets/heroes/Hero_Portrait_Lt._Belica.png.webp', available: true },
	  { id: 14, url: '/assets/heroes/Hero_Portrait_Murdock.jpg.webp', available: true },
	  { id: 15, url: '/assets/heroes/Hero_Portrait_Muriel.jpg.webp', available: true },
	  { id: 16, url: '/assets/heroes/Hero_Portrait_Narbash.png.webp', available: true },
	  { id: 17, url: '/assets/heroes/Hero_Portrait_Rampage.jpg.webp', available: true },
	  { id: 18, url: '/assets/heroes/Hero_Portrait_Riktor.jpg.webp', available: true },
	  { id: 19, url: '/assets/heroes/Hero_Portrait_Sevarog.jpg.webp', available: true },
	  { id: 20, url: '/assets/heroes/Hero_Portrait_Sparrow.jpg.webp', available: true },
	  { id: 21, url: '/assets/heroes/Hero_Portrait_Steel.jpg.webp', available: true },
	  { id: 22, url: '/assets/heroes/Hero_Portrait_The_Fey.png.webp', available: true },
	  { id: 23, url: '/assets/heroes/Hero_Portrait_TwinBlast.png.webp', available: true }
	];

//socket.emit('joinDraft', matchKey);
  	
// wraps the socket.on bindings to avoid updating state for each thing
// stateName - Name of the socket event
// f - handler for the socket event
var onState = function(stateName, f) {
  socket.on(stateName, function() {
  	var args = Array.prototype.slice.call(arguments);
  	// session state will always be the first argument 
  	var s=args.shift();
  	if (ractive) {
  		ractive.set('session', s);
  	}
  	session = s;
  	console.log('received state update: ');
  	console.log(s);
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

function isBan() {
	return session.stageTag.indexOf('ban') !== -1;
}

function isPick() {
	return session.stageTag.indexOf('pick') !== -1;
}

function unavailableChars() {
	var teams = session.stageState.teams;
	var myTeam = teams[teamNum];
	var theirTeam = teams[otherTeamNum()];
	
	var unavailable = myTeam.picked.concat(myTeam.banned).concat(theirTeam.picked).concat(theirTeam.banned);
	
	// if (isBan()) {
	// 	unavailable = teams[otherTeamNum()].picked.concat(teams[otherTeamNum()].banned);
	// }
	// if (isPick()) {
	// 	unavailable = teams[teamNum].picked.concat(teams[teamNum].banned);
	// }
	
	return unavailable;
}

var submitCharHandler = function(event, charId) {
	if (session.stageState.teamTurn !== teamNum) {
		alert('It is not your turn. Better luck next time.');
		return;
	}
	
	var unavailable = unavailableChars();
	
	for (i = 0; i < unavailable.length; i++) {
		if (unavailable[i] === charId) {
			alert('Character ' + charId + ' has already been picked or is banned, try again');
			return;
		}
	}
	
	if (isBan()) {
		socket.emit('banChar', charId, teamNum === 1 ? 2 : 1);
	}
	if (isPick()) {
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
		loaded = true;
		
		if (teamId === session.team1Name) {
			teamNum = 1;
		}
		if (teamId === session.team2Name) {
			teamNum = 2;
		}
		
		ractive = new Ractive({ 
			el: '#ractiveRoot',
			template: '#draftTemplate',
			data: {
			  'session': session,
			  'champs': champs,
			  charMap: function(id) {
			  	console.log(id);
			  	return champs[id];
			  }
			}
		});
		
		ractive.on('submitChar', submitCharHandler);
		ractive.on('submitReady', submitHandler);
		
		setInterval( function () {
  			ractive.set( 'session.stageState.timeLeft', session.stageState.timeLeft - 1);
		}, 1000 );
	}
	
	if (session.stageTag !== 'readyStage') {
		var unavailable = unavailableChars();
		for (i = 0; i < champs.length; i++) {
			var champ = champs[i];
			available = true;
			
			if (session.stageState.teamTurn !== teamNum) {
				available = false;
			}
			else {
				for (j = 0; j < unavailable.length; j++) {
					if (champ.id === unavailable[j]) available = false;
				}	
			}
			
			var availableStr = available ? "available" : "unavailable";
			
			ractive.set('champs.' + i + '.available', availableStr);
		}
	}

	return; 
});

socket.emit('getState');
