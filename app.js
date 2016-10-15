var express = require('express');
var app = express();
var http = require('http').Server(app);
var drafting = require('./drafting.js');

// Express URL Routing
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/drafts/:matchKey/:role', function (req, res) {
	res.sendFile(__dirname + '/public/draft.html');
});

drafting.start();

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});

