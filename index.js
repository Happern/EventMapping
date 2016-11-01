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

app.set('port', (process.env.EM_PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/test', function(req, res) {
  res.sendFile(__dirname + 'public/test/index.html');
});

app.get('/swagger', function (req, res) {
  res.sendFile(__dirname + 'public/swagger/index.html');
});

app.get('/swagger/event_mapping.json', function (req, res) {
  var json = require("./public/swagger/event_mapping");
  res.send(json);
})

var server = app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});

//socket.init(server);
post.init(app);
