var fbEvents = require("./apis/facebook/events.js");
var twitterStatusesStream = require("./apis/twitter/statuses.js");
var darkSkyForecast = require("./apis/dark-sky/forecast.js");
var darkSkyCurrent = require("./apis/dark-sky/current.js");
var appConstants = require("./modules/core/appConstants");

var allEvents = require("./apis/allevents/events")
var meetupEvents = require("./apis/meetup/events");
var eventfulEvents = require("./apis/eventful/events");
var eventsCombined = require("./modules/events/index");
/* post endpoints, potentially for older browser support */

var moment = require("moment");
var defaultDateFormat = appConstants.date.defaultFormat;

function getMoment (date) {
  var momm;
  if(date) {
    momm = moment(date, defaultDateFormat);
  }
  return momm;
}

function processDateParams (body) {
  var since = getMoment(body.since) || moment();
  var until = getMoment(body.until) || moment().add(1, "w");

  return {
    since: since,
    until: until
  }
}
function init(app) {

  app.post("/eventful", function (request, response) {
    var dateParams = processDateParams(request.body);

    var eventsPromise = eventfulEvents.getEventsInIstanbul(dateParams.since, dateParams.until);

    eventsPromise.then(function (value) {
      response.send(value);
    });
  });

  app.post("/meetup", function (request, response) {
    var dateParams = processDateParams(request.body);

    var eventsPromise = meetupEvents.getEventsInIstanbul(dateParams.since, dateParams.until);

    eventsPromise.then(function (value) {
      response.send(value);
    });
  });

  app.post("/density", function (request, response) {
    response.send(twitterStatusesStream.getLatestCoords());
  });

  app.post("/facebook", function (request, response) {
    var dateParams = processDateParams(request.body);

    var eventsPromise = fbEvents.getEventsInIstanbul(dateParams.since, dateParams.until);

    eventsPromise.then(function (value) {
      response.send(value);
    }).catch(function (err) {
      console.log("error ror ror", err);
    });
  });

  app.post("/allevents", function (request, response) {
    var dateParams = processDateParams(request.body);

    var eventsPromise = allEvents.getEventsInIstanbul(dateParams.since, dateParams.until);

    eventsPromise.then(function (value) {
      response.send(value);
    }).catch(function (err) {
      console.log("error ror ror", err);
    });
  });

  app.post("/events", function (request, response) {
    var since, until;

    if (request.body) {
      since = request.body.since;
      until = request.body.until;
    }
    var eventsPromise = eventsCombined.getIstanbulEvents(since, until);

    eventsPromise.then(function (value) {
      response.send(value);
    }).catch(function (error) {
      //TODO send error response here
      console.log(error);
    });
  });

  app.post("/weather/current", function (request, response) {
    var weatherPromise;
    if (request.body.coords) {
      weatherPromise = darkSkyCurrent.getCurrentForCoords(request.body.coords);
    } else {
      weatherPromise = darkSkyCurrent.getCurrentForAllIstanbulCoords();
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
      forecastPromise = darkSkyForecast.getIstanbulForecast();
    }

    forecastPromise.then(function (value) {
      response.send(value);
    });
  });
}

module.exports = {
  init: init
}
