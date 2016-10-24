var eventfulConstants = require("./constants");
var makeRequest = require("../../modules/core/http/index.js").makeRequest;
var param = require("jquery-param");

function makeEventfulRequest(path, queryParams, successCallback, errorCallback) {
  queryParams = Object.assign({
    app_key: eventfulConstants.applicationKey
  }, queryParams);

  var options = {
    hostname:"api.eventful.com",
    path: "/rest" + path + "?" + param(queryParams)
  };

  makeRequest({
    options: options,
    successCallback: successCallback,
    errorCallback: errorCallback,
    expectJSON: false
  })
}

module.exports = {
  makeEventfulRequest: makeEventfulRequest
};
