var meetupConstants = require("./constants");
var makeRequest = require("../../modules/core/http/index.js").makeRequest;
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
    expectJSON: true,
    requireHeaders: true
  })
}

module.exports = {
  makeMeetupRequest: makeMeetupRequest
}
