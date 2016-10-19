//internal modules
var fbEvents = require("./apis/facebook/events.js");
var twitterStatusesStream = require("./apis/twitter/statuses.js");
var darkSkyForecast = require("./apis/dark-sky/forecast.js");
var darkSkyCurrent = require("./apis/dark-sky/current.js");
var appConstants = require("./modules/core/appConstants");

//external modules
var socketIO = require('socket.io');

function init(server){
  var io = socketIO(server);

  function sendCurrentConditions(sendFunction) {
    var fbPromise =  fbEvents.getEventsInIstanbul();
    var weatherPromise;
    var coords;
    if (coords) {
      weatherPromise = darkSkyCurrent.getCurrentForCoords(coords);
    } else {
      weatherPromise = darkSkyCurrent.getIstanbulCurrent();
    }

    var allPromises = Promise.all([fbPromise, weatherPromise]);
    allPromises.then(function(values) {
      var currentValues = {
        fb: values[0],
        weather: values[1],
        twitter: twitterStatusesStream.getLatestCoords()
      }
      sendFunction (currentValues);
    });
  }

  io.on("connection", function(socket) {
    sendCurrentConditions(function (data) {
      socket.emit("initialConditions", data);
    });

    initializeEventsToBeListened(socket);
  });

  function initializeEventsToBeListened(socket){
    //TODO differentiate btw socket and io when emitting stuff
    socket.on("zoom", function (data) {
      var weatherPromise = darkSkyCurrent.getCurrentForCoords(data.coords);

      weatherPromise.then(function (data){
          socket.emit("currentWeatherForCoords", data);
      });
    });

    socket.on("timelineSelected", function (data){
      /* TODO return events for the selected timeline
      and weather forecast if available */
      var fbPromise = fbEvents.getEventsInIstanbul(data.startDate, data.endDate);
    });
  }

  twitterStatusesStream.getStatuses();

  setInterval(function() {
    sendCurrentConditions(function (data) {
      io.emit("updatedConditions", data);
    });
  }, appConstants.update.interval);
}

module.exports = {
  init: init
}
