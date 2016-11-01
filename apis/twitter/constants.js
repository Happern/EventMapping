var apiKeys = require("../../apiKeys");

var authParams = {
  signatureMethod: "HMAC-SHA1",
  oauthVersion: "1.0"
}

module.exports = Object.assign(authParams, apiKeys.twitter);
