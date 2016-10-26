var makeEventfulRequest = require("./index").makeEventfulRequest;
var appConstants = require("../../modules/core/appConstants");
var formatEvents = require("../../modules/events/utils").formatEvents;
var eventfulConstants = require("./constants");

var eventfulDateFormat = appConstants.date.eventfulFormat;
var allPromises = require("../../modules/core/promise/allPromises");

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
      var events = formatEvents(resp.events.event, eventfulConstants.eventFormatMapping);

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
          resolve(formatEvents(resp.events.event, eventfulConstants.eventFormatMapping));
        }, function (err) {
          errorCallback(reject, err);
        })
      }));
    }

    allPromises.combinePromisesTimeout(promises, function (values) {
      originalResolve(events.concat.apply([], values));
    }, function(err) {
      errorCallback(originalReject, err);
    });
}

module.exports = {
  getEventsInIstanbul: getEventsInIstanbul
}
