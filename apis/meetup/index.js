var meetupConstants = require("./constants");
var makeRequest = require("../../modules/http/index").makeRequest;
var meetupUtils = require("./utils");
var param = require("jquery-param");

function makeMeetupRequest (path, queryParams, successCallback, errorCallback) {
  if (typeof(queryParams) !== "string") {
    queryParams = param(Object.assign({
      sign: true,
      key: meetupConstants.apiKey
    }, queryParams));
  } else {
    queryParams += "&key=" + meetupConstants.apiKey;
  }


  var options = {
    hostname:"api.meetup.com",
    path: path + "?" + queryParams
  };

  makeRequest({
    options: options,
    successCallback: successCallback,
    errorCallback: errorCallback,
    checkErrors: meetupUtils.checkErrors,
    expectJSON: true,
    requireHeaders: true,
    api: meetupConstants.apiName
  })
}

module.exports = {
  makeMeetupRequest: makeMeetupRequest
}
