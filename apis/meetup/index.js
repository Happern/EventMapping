var meetupConstants = require("./constants");
var makeRequest = require("../../modules/core/http/index.js").makeRequest;
var param = require("jquery-param");

function makeMeetupRequest (path, queryParams, successCallback, errorCallback) {
  queryParams = Object.assign({
    sign: true,
    key: meetupConstants.apiKey
  }, queryParams);

  var options = {
    hostname:"api.meetup.com",
    path: path + "?" + param(queryParams)
  };

  makeRequest({
    options: options,
    successCallback: successCallback,
    errorCallback: errorCallback,
    expectJSON: true
  })
}

module.exports = {
  makeMeetupRequest: makeMeetupRequest
}
