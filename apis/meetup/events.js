var makeMeetupRequest = require("./index").makeMeetupRequest;
var appConstants = require("../../modules/core/appConstants");
var meetupConstants = require("./constants");
var formatEvents = require("../../modules/events/utils").formatEvents;
var meetupUtils = require("./utils");

function getEventsInIstanbul (startMoment, endMoment) {
  var path = "/find/events";
  var istanbulCenter = appConstants.geo.istanbul.center;
  var queryParams = {
    lat: istanbulCenter.lat,
    lon: istanbulCenter.lng
  };

  var events = [];
  return new Promise(function (resolve, reject) {
    makeMeetupRequest(path, queryParams,
    function (resp, headers) {
      successCallback(resp, headers, events, path, resolve, reject, startMoment, endMoment);
    }, function (error) {
        errorCallback(error, reject);
    });
  });
}

function errorCallback (err, reject) {
    reject(err);
}

function successCallback(resp, headers, events, path, resolve, reject, startMoment, endMoment) {
  resp = meetupUtils.filterResultsByDate(resp, startMoment, endMoment);

meetupUtils.correctTimeFormat(resp);

    events = events.concat(formatEvents(resp, meetupConstants.eventFormatMapping, "meetup"));

    if(headers.link) {
      queryParamsString = meetupUtils.extractQueryParamsFromLink(headers.link);

      if (meetupUtils.checkDate(queryParamsString, endMoment)) {
        makeMeetupRequest(path, queryParamsString,
        function (resp, headers) {
          successCallback(resp, headers, events, path, resolve, reject, startMoment, endMoment);
        },
        function(err) {
          errorCallback(err, reject);
        });
      } else {
        resolve(events);
      }

    } else {
      resolve(events);
    }

}

module.exports = {
  getEventsInIstanbul: getEventsInIstanbul
};
