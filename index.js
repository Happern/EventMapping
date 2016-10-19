var bodyParser = require('body-parser');
var express = require('express');
var app = express();

var socket = require("./socket");
var post = require("./post")

app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/test', function(req, res) {
  res.sendFile(__dirname + 'public/test/index.html');
});

var server = app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});

socket.init(server);
post.init(app);
