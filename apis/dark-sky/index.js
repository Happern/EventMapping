var darkSkyConstants = require("./constants");
var makeRequest = require("../../modules/http/index").makeRequest;
var param = require("jquery-param");

function makeDarkSkyRequest (path, coords, queryParams, successCallback, errorCallback) {
  var baseUrl = "api.darksky.net";
  var path = path + "/" + darkSkyConstants.secretKey + "/" + coords;
  if (queryParams) {
    path += "?" + param(queryParams);
  }

  var options = {
    hostname: baseUrl,
    path: path
  }

  makeRequest({
    options: options,
    successCallback: successCallback,
    errorCallback: errorCallback,
    expectJSON: true
  })
}

module.exports = {
  makeDarkSkyRequest: makeDarkSkyRequest
}
