var appConstants = require("../../modules/core/appConstants");
var makeDarkSkyRequest = require("./index").makeDarkSkyRequest;

function getIstanbulForecast () {
  var istanbulCenter = appConstants.geo.istanbul.center;
  return getForecastForCoords(istanbulCenter.lat + "," + istanbulCenter.lng);
}

function getForecastForCoords (coords) {
  var path = "/forecast";

  var queryParams = {
    units: "si",
    extend: "hourly",
    exclude: "minutely,daily"
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
  getForecastForCoords: getForecastForCoords,
  getIstanbulForecast: getIstanbulForecast
}
