var bodyParser = require('body-parser');
var express = require('express');
var app = express();

var socket = require("./socket");
var post = require("./post")

var argv = require('minimist')(process.argv.slice(2));

/*
var cors = require('cors');

// use it before all route definitions
app.use(cors({origin: 'http://localhost:8080'}));*/

app.use(bodyParser.json());

app.set('port', (process.env.PORT || process.env.EM_PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/test/v4.html');
});

app.get('/v0', function(req, res) {
  res.sendFile(__dirname + '/public/test/index.html');
});

app.get('/grid', function(req, res) {
  res.sendFile(__dirname + '/public/test/grid.html');
});

app.get('/pin', function(req, res) {
  res.sendFile(__dirname + '/public/test/pin.html');
});

app.get('/v3pin', function(req, res) {
  res.sendFile(__dirname + '/public/test/v3pin.html');
});

app.get('/v3circle', function(req, res) {
  res.sendFile(__dirname + '/public/test/v3circle.html');
});

app.get('/swagger/event_mapping.json', function (req, res) {
  var json = require("./modules/core/apiStructure");
  res.send(json);
})

app.get('/changebasemap', function (req, res) {
  res.sendFile(__dirname + '/public/test/changebasemap.html');
})

var server = app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});

socket.init(server);
post.init(app);
