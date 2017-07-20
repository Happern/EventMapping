var makeTwitterRequest = require("./index.js").makeTwitterRequest;
var appConstants = require("../../modules/core/appConstants");
var tweetUtils = require("./utils.js");
var twitterStore = require("./store.js");
var _ = require("lodash");

function getStatuses () {
  var path = "/statuses/filter.json"
  var swCorner = appConstants.geo.istanbul.boundingBoxSW;
  var neCorner = appConstants.geo.istanbul.boundinBoxNE;
  var queryParams = {
    locations: swCorner.lng + "," + swCorner.lat
    + "," + neCorner.lng + "," + neCorner.lat,
    stall_warnings: true
  };

  extraOptions = {
    expectJSON: true,
    isChunked: true
  }

  var parsed = {};
  var data = "";

  makeTwitterRequest(path, queryParams, extraOptions, function (chunk) {
    data += chunk;

    /*TODO handle this some other way - some data gets lost.
    (if chunk itself is not a complete JSON)
    Adding the chunks together might result in a combination of multiple tweets
    which doesn't get counted as a valid JSON object
    */

    try {
      parsed = JSON.parse(chunk);
      if (parsed.warning) {
        console.log("warning", parsed);
      }
      twitterStore.addToTweets(tweetUtils.processTweet(parsed));
    } catch (e) {

    }
}, function (resp){
  console.log("error", resp);
});
}

function getLatestCoords () {
  return {
    "api": "twitter",
    "data": twitterStore.getTweets(60)
  };
}

module.exports = {
  getStatuses: getStatuses,
  getLatestCoords: getLatestCoords
};
