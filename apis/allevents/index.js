var allEventsConstants = require("./constants");
var makeRequest = require("../../modules/core/http/index.js").makeRequest;
var param = require("jquery-param");

function makeAllEventsRequest (path, queryParams, successCallback, errorCallback) {
  var baseUrl = "api.allevents.in";

  if (queryParams) {
    path += "?" + param(queryParams);
  }

  var options = {
    method: "POST",
    hostname: baseUrl,
    path: path,
    headers: {
      'Ocp-Apim-Subscription-Key': allEventsConstants.primaryKey
    }
  }

  makeRequest({
    options: options,
    successCallback: successCallback,
    errorCallback: errorCallback,
    expectJSON: true
  })
}

module.exports = {
  makeAllEventsRequest: makeAllEventsRequest
}
