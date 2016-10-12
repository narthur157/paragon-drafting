var socket = io(),
  state = {},
  playerId = parseInt(window.location.pathname.split('/')[1]);

socket.on('getState', function(session) {
  state = session;
});

// wraps the socket.on bindings to avoid updating state for each thing
// stateName - Name of the socket event
// f - handler for the socket event
var onState = function(stateName, f) {
  socket.on(stateName, function() {
  	var args = Array.prototype.slice.call(arguments);
  	// session state will always be the first argument 
  	state=args.shift();
  	f.call(this, args);
  });
}

$('#team1Ready').click(function() {
  socket.emit('team1Ready');	 
});

onState('playerReady', function(player) {
  // change the ready button to show it's been clicked
});

onState('startMapPick', function(teamPicking) {
  if (teamPicking === playerId) {
  	// enable map pick button
  }
});

onState('player1Ready', function() {
  // change the ready button 
});

onState('player1BanMap', function() {
  
});

onState('player2BanMap', function() {
  
});

onState('player1PickChar', function() {
  
});

onState('player2PickChar', function() {
  
});