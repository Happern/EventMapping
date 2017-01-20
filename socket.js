//internal modules
var allEvents = require("./modules/events/index");

var twitterStatusesStream = require("./apis/twitter/statuses.js");
var darkSkyForecast = require("./apis/dark-sky/forecast.js");
var darkSkyCurrent = require("./apis/dark-sky/current.js");
var appConstants = require("./modules/core/appConstants");
var allPromises = require("./modules/promise/allPromises");

var eventsCombined = require("./modules/events/index");
//external modules
var socketIO = require('socket.io');
var _ = require('lodash');

function init(server){
  var io = socketIO(server);

  function sendCurrentConditions(sendFunction) {
    var eventsPromise =  allEvents.getIstanbulEvents();
    var weatherPromise;
    var coords;
    if (coords) {
      weatherPromise = darkSkyCurrent.getCurrentForCoords(coords);
    } else {
      weatherPromise = darkSkyCurrent.getCurrentForAllIstanbulCoords();
    }

    allPromises.combinePromisesTimeout([eventsPromise, weatherPromise], function (values){
      var eventIndex = _.findIndex(values, function(value) { return value.api === 'all-events'; });
      var weatherIndex = _.findIndex(values, function (value) {
        return value.api === "dark-sky";
      });

      var currentValues = {
        events: eventIndex >= 0 ? values[eventIndex].data : [],
        weather: weatherIndex >= 0 ? values [weatherIndex].data : [],
        twitter: twitterStatusesStream.getLatestCoords().data || []
      }
      sendFunction(currentValues);
    }, function (errObj) {
      sendFunction({
        error: errObj
      })
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
      console.log("timelineSelected event received", data);
      //DD/MM/YYYY
      var eventsPromise = eventsCombined.getIstanbulEvents(data.startDate, data.endDate);

      eventsPromise.then(function (value) {
//        console.log("success", value);
        socket.emit("timelineSelectedValue", value);
      }).catch(function (error) {
        //TODO send error response here
//        console.log("error", error);
        socket.emit("timelineSelectedValue", error);
      });
    });
  }

  twitterStatusesStream.getStatuses();

  setInterval(function() {
    sendCurrentConditions(function (data) {
      io.emit("updatedConditions", data);
    });
  }, appConstants.timeValues.updateInterval);
}

module.exports = {
  init: init
}
