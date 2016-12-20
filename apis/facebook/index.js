var values = require("./values.js");
var makeRequest = require("../../modules/http/index").makeRequest;
var fbUtils = require("./utils");
var param = require("jquery-param");

function getFbAccessToken (callbackFnc) {
  var queryParams = {
    client_id: values.fbApp.appId,
    client_secret: values.fbApp.appSecret,
    grand_type: "client_credentials"
  };

  var path = "/oauth/access_token"

  makeFbRequest(path, queryParams, false, function (resp) {
    respAsArray = resp.split("=");
    values.setAccessToken(respAsArray[1]);
    callbackFnc();
  })
}

function makeFbRequest(path, queryParams, expectJSON, successCallback, errorCallback) {
  if (queryParams) {
    path += "?" + param(queryParams);
  }

  var options = {
    hostname: "graph.facebook.com",
    path: path
  }

  var config = {
    options: options,
    expectJSON: expectJSON,
    successCallback: successCallback,
    errorCallback: errorCallback,
    checkErrors: fbUtils.checkErrors,
    api: values.apiName
  }

  if (expectJSON) {
    config.errorCallback = function (resp) {
      //might remove this oauthexpception part
      if (resp.error && resp.error.type == "OAuthException" && resp.error.sub_code === 467) {
        var oldAccessTokenValue = values.fbApp.accessToken;

        getFbAccessToken(function () {
          path = path.replace(oldAccessTokenValue, values.fbApp.accessToken);
          makeFbRequest(path, expectJSON, successCallback, errorCallback);
        });
      } else {
        errorCallback(resp);
      }
    };
  }
  makeRequest(config);
}

module.exports = {
  makeFbRequest: makeFbRequest
}
