function makeUrl(uri) {
  var baseUrl = "http://app.nicksprivatevm.org/";
  
  return baseUrl + uri;
}

// Returns the form data as an array
// of objects with name and value properties
function getFormData() {
	var arr = $('form').serializeArray();
	var ret = {};
	
	for (i = 0; i < arr.length; i++) {
		ret[arr[i].name] = arr[i].value;
	}
	
	return ret;
}
  
var socket = io('/create');

socket.on('draftCreated', function(session) {
  console.log('draftCreated');
  var makeRoomUrl = function(roleId) { return makeUrl("drafts/" + session.matchKey + "/" +  roleId); },
	  team1Url = makeRoomUrl(session.team1Name),
  	  team2Url = makeRoomUrl(session.team2Name),
  	  observerUrl = makeRoomUrl(session.observerId);
  	
  $('#team1 input').prop('value', team1Url);
  $('#team2 input').prop('value', team2Url);
  $('#observer input').prop('value', observerUrl);
  
  $('#team1 a').prop('href', team1Url);
  $('#team2 a').prop('href', team2Url);
  $('#observer a').prop('href', observerUrl);
});



$('#startDraftButton').click(function(){
	console.log(socket.id);
	socket.emit('createDraft', getFormData());
	return false;
});