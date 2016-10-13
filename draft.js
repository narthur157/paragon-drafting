var socket = io(),
  	session = {},
  	playerId = window.location.pathname.split('/')[3],
  	playerNum = 0;

// wraps the socket.on bindings to avoid updating state for each thing
// stateName - Name of the socket event
// f - handler for the socket event
var onState = function(stateName, f) {
  socket.on(stateName, function() {
  	var args = Array.prototype.slice.call(arguments);
  	// session state will always be the first argument 
  	session=args.shift();
  	if (ractive) {
  		ractive.set(session);
  	}
  	console.log('Logging session: ');
  	console.log(session);
  	f.call(this, args);
  });
}

$('#team1Ready').click(function() {
  if (session.team1Name === playerId) {
  	socket.emit('playerReady', 1);	 
  }
  if (session.team2Name === playerId) {
  	socket.emit('playerReady', 2);
  }
});

onState('playerReady', function(player) {
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
		if (playerId === session.team1Name) {
			playerNum = 1;
		}
		if (playerId === session.team2Name) {
			playerNum = 2;
		}
		
		ractive = new Ractive({
		  // The `el` option can be a node, an ID, or a CSS selector.
		  el: '#ractiveRoot',
		  template: '#draftTemplate',
		  // Here, we're passing in some initial data
		  data: session
		});
		
		ractive.on('submitReady', function(event, player) {
			// only allow the this team to ready itself
			console.log('submitReady');
			if (player === playerNum) {
				socket.emit('playerReady', player);	 
			}	
			else {
				console.log('player: ' + player + ' playerNum: ' + playerNum);
			}
		});
	}
	
	return; 
});

socket.emit('getState');
