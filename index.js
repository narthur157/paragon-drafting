function makeUrl(uri) {
  var baseUrl = "http://app.nicksprivatevm.org/";
  
  return baseUrl + uri;
}

// Returns the form data as an array
// of objects with name and value properties
function getFormData() {
	return $('form').serializeArray();
}
  
var socket = io();


socket.on('draftJoin', function() {
  console.log('draft join');
});

socket.on('createDraft', function(session) {
  console.log('createDraft');
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



$('button').click(function(){
	socket.emit('createDraft', getFormData());
	$('#m').val('');
	return false;
});