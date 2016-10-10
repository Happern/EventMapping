var twitterConstants = require("./constants.js");
var twitterUtils = require("./utils.js");
var CryptoJS = require("crypto-js");

function getAuthenticationHeader(method, baseUrl, queryParams) {
  var timestampRaw = Date.now();
  var timestamp = (timestampRaw - (timestampRaw % 1000)) / 1000;
  var authParams = {
    oauth_consumer_key: twitterConstants.consumerKey,
    oauth_version: twitterConstants.oauthVersion,
    oauth_signature_method: twitterConstants.signatureMethod,
    oauth_token: twitterConstants.accessToken,
    oauth_timestamp: timestamp,
    oauth_nonce: generateNonce(baseUrl, timestamp)
  };

  var params = Object.assign({}, authParams, queryParams);
  var signature = getSignatureForRequest(method, baseUrl, params);
  authParams["oauth_signature"] = signature;

  return buildHeaderString(authParams);
}

function generateNonce(path, timestamp) {
  hash = CryptoJS.MD5(path + timestamp);
  return hash.toString();
}

function getSignatureForRequest(method, baseUrl, params) {
  var stringifiedParams = twitterUtils.formParamString(params);
  var signatureComps = [method, baseUrl, stringifiedParams];
  var keyComps = [twitterConstants.consumerSecret,
    twitterConstants.accessTokenSecret];

    var encoded = CryptoJS.HmacSHA1(twitterUtils.encodeAndJoin(signatureComps, "&"),
    twitterUtils.encodeAndJoin(keyComps, "&"));
    return encoded.toString(CryptoJS.enc.Base64);
  }

  function buildHeaderString(authParams) {
    var stringComponents = [];

    var extraFunction = function (key, value) {
      var paramValue = twitterUtils.encodeAndJoin([key, value], "=\"");
      stringComponents.push(paramValue + "\"");
    }

    twitterUtils.formParamString(authParams, extraFunction);

    return "OAuth " + stringComponents.join(", ");
  }

  module.exports = {
    getAuthenticationHeader: getAuthenticationHeader
  }
