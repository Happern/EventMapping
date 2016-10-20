var makeMeetupRequest = require("./index").makeMeetupRequest;
var appConstants = require("../../modules/core/appConstants");

function getEventsInIstanbul () {
  var path = "/find/events";
  var istanbulCenter = appConstants.geo.istanbul.center;
  var queryParams = {
    lat: istanbulCenter.lat,
    lon: istanbulCenter.lng
  };

  return new Promise(function (resolve, reject) {
    makeMeetupRequest(path, queryParams, function (resp) {
      resolve(resp);
    }, function (err) {
      reject(err);
    });
  });
}

module.exports = {
  getEventsInIstanbul: getEventsInIstanbul
}
