var allEventsConstants = require("./constants");
var makeRequest = require("../../modules/http/index").makeRequest;
var param = require("jquery-param");
var allEventsUtils = require("./utils");

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
    expectJSON: true,
    checkErrors: allEventsUtils.checkErrors,
    api: allEventsConstants.apiName
  })
}

module.exports = {
  makeAllEventsRequest: makeAllEventsRequest
}
