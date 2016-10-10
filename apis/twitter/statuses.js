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
    + "," + neCorner.lng + "," + neCorner.lat
  };

  extraOptions = {
    expectJSON: true,
    isChunked: true
  }

  var parsed = {};
  var data = "";

  makeTwitterRequest(path, queryParams, extraOptions, function (chunk) {
    data += chunk;

    try {
      parsed = JSON.parse(data);
      twitterStore.addToTweets(tweetUtils.processTweet(parsed));
      data = "";
    } catch (e){
      //TODO do sth here?
    }
  }, function (resp){
    console.log("errr", resp);
  });
}

function getLatestCoords () {
  return twitterStore.getTweets(15);
}

module.exports = {
  getStatuses: getStatuses,
  getLatestCoords: getLatestCoords
};
