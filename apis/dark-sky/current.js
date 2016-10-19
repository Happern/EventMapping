var appConstants = require("../../modules/core/appConstants");
var makeDarkSkyRequest = require("./index").makeDarkSkyRequest;

function getIstanbulCurrent () {
  var istanbulCenter = appConstants.geo.istanbul.center;
  return getCurrentForCoords(istanbulCenter.lat + "," + istanbulCenter.lng);
}

function getCurrentForCoords (coords) {
  var path = "/forecast";

  var queryParams = {
    units: "si",
    exclude: "minutely,daily,hourly"
  }

  return new Promise(function (resolve, reject) {
    makeDarkSkyRequest(path, coords, queryParams, function (resp) {
      //TODO implement a processing function to send only the required info
      resolve(resp);
    }, function (resp) {
      reject(resp);
    })
  });

}

module.exports = {
  getCurrentForCoords: getCurrentForCoords,
  getIstanbulCurrent: getIstanbulCurrent
}
