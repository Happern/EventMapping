var makeRequest = require("../../modules/http/index.js").makeRequest;
var twitterAuth = require("./auth.js");
var param = require('jquery-param');

function makeTwitterRequest(path, queryParams, extraOptions, successCallback, errorCallback) {
  var hostName = "stream.twitter.com";
  var apiVersion = "/1.1";
  var requestMethod = "GET";

  var baseUrl = "https://" + hostName + apiVersion + path;
  var data = param(queryParams);

  var options = {
    method: requestMethod,
    hostname: hostName,
    path: apiVersion + path + "?" + param(queryParams),
    headers: {
      'Authorization': twitterAuth.getAuthenticationHeader(requestMethod,baseUrl, queryParams)
    }
  };

  var configBase = {
    options: options,
    successCallback: successCallback,
    errorCallback: errorCallback,
    //postData: data
  }

  var config = Object.assign({}, configBase, extraOptions);
  makeRequest(config);
}


module.exports = {
  makeTwitterRequest: makeTwitterRequest
}
