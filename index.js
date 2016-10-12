function makeUrl(uri) {
  var baseUrl = "http://app.nicksprivatevm.org/";
  
  return baseUrl + uri;
}
  
var socket = io();


socket.on('draftJoin', function() {
  console.log('draft join');
});

socket.on('createDraft', function(session) {
  var makeRoomUrl = function(roleId) { return makeUrl("drafts/" + session.draftId + "/" +  roleId); },
	  team1Url = makeRoomUrl(session.teamId1),
  	  team2Url = makeRoomUrl(session.teamId2),
  	  observerUrl = makeRoomUrl(session.observerId);
  	
  $('#team1 input').prop('value', team1Url);
  $('#team2 input').prop('value', team2Url);
  $('#observer input').prop('value', observerUrl);
  
  $('#team1 a').prop('href', team1Url);
  $('#team2 a').prop('href', team2Url);
  $('#observer a').prop('href', observerUrl);
});

$('form').submit(function(){
	socket.emit('createDraft', $('#m').val());
	$('#m').val('');
	return false;
});