var param = require('jquery-param');
var twitterConstants = require("./constants.js");
var moment = require("moment");

function encodeAndJoin (components, delimiter) {
  var encoded = components.map(function (currValue){
    return encodeURIComponent(currValue);
  });

  return encoded.join(delimiter);
}

function formParamString(params, extraFunction) {
  var paramKeys = Object.keys(params);
  paramKeysSorted = paramKeys.sort();
  var numParams = paramKeys.length;
  var sorted = {};
  var currKey;

  for (var paramIndex = 0; paramIndex < numParams; paramIndex++) {
    currKey = paramKeysSorted[paramIndex];
    var value = params[currKey];
    sorted[currKey] = value;
    if (extraFunction) {
      extraFunction (currKey, value);
    }
  }

  return param(sorted);
}

function processTweet(tweet) {
  var coordinates;
  var time = tweet.timestamp_ms || "";

  if (tweet.geo && tweet.geo.coordinates) {
    coordinates = tweet.geo.coordinates;
  } else if (tweet.coordinates) {
    coordinates = [tweet.coordinates[1], tweet.coordinates[0]];
  }

  return {
    coord: coordinates,
    time: moment(time, "x")
  }
}

module.exports = {
  formParamString: formParamString,
  encodeAndJoin: encodeAndJoin,
  processTweet: processTweet
}
