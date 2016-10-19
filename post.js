var fbEvents = require("./apis/facebook/events.js");
var twitterStatusesStream = require("./apis/twitter/statuses.js");
var darkSkyForecast = require("./apis/dark-sky/forecast.js");
var darkSkyCurrent = require("./apis/dark-sky/current.js");
var appConstants = require("./modules/core/appConstants");

/* post endpoints, potentially for older browser support */
function init(app) {
  app.post("/density", function (request, response) {
    response.send(twitterStatusesStream.getLatestCoords());
  });

  app.post("/events", function (request, response) {
    var since, until;

    if (request.body) {
      since = request.body.since;
      until = request.body.until;
    }
    var eventsPromise = fbEvents.getEventsInIstanbul(since, until);

    eventsPromise.then(function (value) {
      response.send(value);
    });
  });

  app.post("/weather/current", function (request, response) {
    var weatherPromise;
    if (request.body.coords) {
      weatherPromise = darkSkyCurrent.getCurrentForCoords(request.body.coords);
    } else {
      weatherPromise = darkSkyCurrent.getIstanbulCurrent();
    }

    weatherPromise.then(function (value) {
      response.send(value);
    });
  });

  app.post("/weather/forecast", function (request, response) {
    var forecastPromise;
    if (request.body.coords) {
      forecastPromise = darkSkyForecast.getForecastForCoords(request.body.coords);
    } else {
      forecastPromise = darkSkyCurrent.getIstanbulForecast();
    }

    forecastPromise.then(function (value) {
      response.send(value);
    });
  });
}

module.exports = {
  init: init
}
