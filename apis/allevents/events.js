var makeAllEventsRequest = require("./index").makeAllEventsRequest;
var appConstants = require("../../modules/core/appConstants");
var formatEvents = require("../../modules/events/utils").formatEvents;
var allEventsConstants = require("./constants");

var allEventsDateFormat = appConstants.date.allEventsFormat;
var allPromises = require("../../modules/promise/allPromises");

function getEventsInIstanbul (startMoment, endMoment) {
  var queryParams = {
    city: "istanbul",
    state: "istanbul",
    country: "turkey",
    sdate: startMoment.format(allEventsDateFormat),
    edate: endMoment.format(allEventsDateFormat)
  };

  var path = "/events/list";

  return new Promise(function (resolve, reject){
    makeAllEventsRequest(path, queryParams, function (resp) {
      resolve(formatEvents(resp.data, allEventsConstants.eventFormatMapping));
    }, function (err) {
      errorCallback(reject, err);
    });
  });
}

//TODO implement pagination later
function getEventsByPage (queryParams, page) {
  queryParams.page = page;

  return new Promise(function (resolve, reject){
    makeAllEventsRequest(path, queryParams, function (resp) {
      console.log(resp.data);
    }, function (errObj) {
      errorCallback(reject, errObj);
    });
  });
}

function errorCallback(reject, err) {
  reject(err);
}

module.exports = {
  getEventsInIstanbul: getEventsInIstanbul
}
