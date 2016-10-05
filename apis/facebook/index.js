var valuess = require("./values.js");
var makeRequest = require("../../modules/core/http/index.js").makeRequest;

function getFbAccessToken (callbackFnc) {
  var path = "/oauth/access_token?client_id=" + values.fbApp.appId + "&" +
  "client_secret=" + values.fbApp.appSecret + "&" +
  "grant_type=client_credentials";

  makeFbRequest(path, false, function (resp) {
    respAsArray = resp.split("=");
    values.setAccessToken(respAsArray[1]);
    callbackFnc();
  })
}

function makeFbRequest(path, expectJSON, successCallback, errorCallback) {
  var options = {
    hostname: "graph.facebook.com",
    path: path
  }

  var config = {
    options: options,
    expectJSON: expectJSON,
    successCallback: successCallback,
    errorCodes: [400],
    errorCallback: errorCallback
  }

  if (expectJSON) {
    config.errorMessageField = "error.message"
    config.errorCallback = function (resp) {
      if (resp.error.type == "OAuthException") {
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
