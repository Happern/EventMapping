var appConstants = require("../../modules/core/appConstants");
var makeDarkSkyRequest = require("./index").makeDarkSkyRequest;
var darkSkyConstants = require("./constants");
var darkSkyUtils = require("./utils");
var allPromises = require("../../modules/core/promise/allPromises");

function getIstanbulCurrent () {
  var istanbulCenter = appConstants.geo.istanbul.center;
  return getCurrentForCoords(istanbulCenter.lat + "," + istanbulCenter.lng);
}

function getCurrentForAllIstanbulCoords () {
  var istanbulCoords = darkSkyConstants.istanbulCoords;
  var promises = [];

  return new Promise(function (resolve, reject) {
    istanbulCoords.forEach(function (coords) {
      promises.push(getCurrentForCoords(coords));
    });

    allPromises.combinePromisesTimeout(promises, function (values) {
      var result = [];
      values.forEach(function (value) {
        result.push(value.data);
      });

      resolve({
        api: "dark-sky",
        data: result
      })
    }, function (err) {
      reject(err)
    });
  });
}

function getCurrentForCoords (coords) {
  var path = "/forecast";

  var queryParams = {
    units: "si",
    exclude: "minutely,daily,hourly,alerts,flags"
  }

  return new Promise(function (resolve, reject) {
    makeDarkSkyRequest(path, coords, queryParams, function (resp) {
      var generalData = darkSkyUtils.processData(resp, darkSkyConstants.generalFields);
      var weatherData = darkSkyUtils.processData(resp.currently, darkSkyConstants.weatherFields);
      //TODO implement a processing function to send only the required info
      resolve({
        api: "dark-sky",
        data: Object.assign(generalData, weatherData)
      });
    }, function (resp) {
      reject(resp);
    })
  });

}

module.exports = {
  getCurrentForCoords: getCurrentForCoords,
  getIstanbulCurrent: getIstanbulCurrent,
  getCurrentForAllIstanbulCoords: getCurrentForAllIstanbulCoords
}
