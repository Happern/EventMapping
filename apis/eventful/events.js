var makeEventfulRequest = require("./index").makeEventfulRequest;
var appConstants = require("../../modules/core/appConstants");
var formatEvents = require("../../modules/events/utils").formatEvents;
var eventfulConstants = require("./constants");

var eventfulDateFormat = appConstants.date.eventfulFormat;
var allPromises = require("../../modules/promise/allPromises");

function getEventsInIstanbul (startMoment, endMoment) {
  var istanbulCenter = appConstants.geo.istanbul.center;

  var queryParams = {
    where: istanbulCenter.lat + "," + istanbulCenter.lng,
    within: 25, //TODO experiment with the radius
    date: startMoment.format(eventfulDateFormat) + "-" +
    endMoment.format(eventfulDateFormat)
  };

  var path = "/events/search";

  return new Promise(function (resolve, reject){
    makeEventfulRequest(path, queryParams, function (resp) {
      var pageCount = resp.page_count;
      var eventsAPI = getEventsFromResponse(resp);
      var events = formatEvents(eventsAPI, eventfulConstants.eventFormatMapping);

      if (pageCount > 1) {
        getOtherPages(pageCount, path, queryParams, events, resolve, reject);
      } else {
        resolve(events);
      }
    }, function (err) {
      errorCallback(reject, err);
    });
  });
}

function errorCallback(reject, err) {
  reject(err);
}

function getOtherPages (pageCount, path, queryParams, events, originalResolve, originalReject) {
    var promises = [];

    for (var pageNum = 2; pageNum <= pageCount; pageNum++) {
      queryParams.page_number = pageNum;

      promises.push(new Promise(function (resolve, reject) {
        makeEventfulRequest(path, queryParams, function (resp, headers) {
          var events = getEventsFromResponse(resp);
          resolve(formatEvents(events, eventfulConstants.eventFormatMapping, "eventful"));
        }, function (err) {
          errorCallback(reject, err);
        })
      }));
    }

    allPromises.combinePromisesTimeout(promises, function (values) {
      originalResolve(events.concat.apply([], values));
    }, function(err) {
      originalReject({
        tpye: "Internal",
        message: err}
      );
    });
}

function getEventsFromResponse (response) {
  if (response.events && response.events.event) {
    var e = response.events.event;

    if(typeof e === "object" && e.constructor.name !== "Array") {
      e = [e];
    }

    return e;
  } else return null;
}

module.exports = {
  getEventsInIstanbul: getEventsInIstanbul
}
