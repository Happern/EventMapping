var appConstants = require("../../modules/core/appConstants");
var makeDarkSkyRequest = require("./index").makeDarkSkyRequest;

function getIstanbulForecast () {
  var istanbulCenter = appConstants.geo.istanbul.center;
  getForecastForCoords(istanbulCenter.lat + "," + istanbulCenter.lng);
}

function getForecastForCoords (coords) {
  var path = "/forecast";

  var queryParams = {
    units: "si",
    extend: "hourly",
    exclude: "minutely,daily"
  }

  makeDarkSkyRequest(path, coords, queryParams, function (resp) {
    console.log("success", resp);
  }, function (resp) {
    console.log("error", resp);
  })
}

module.exports = {
  getIstanbulForecast: getIstanbulForecast
}
