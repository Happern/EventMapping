var moment = require("moment");

var tweets = [];

function getTweets(interval) {
  var currTime = moment();
  var searchedFor = [];

  var currTweets = Object.assign([], tweets);
  var numTweets = currTweets.length;

  for (var tweetIndex = numTweets - 1; tweetIndex > -1; tweetIndex--) {
      var tweet = currTweets[tweetIndex];

      if (currTime.diff(tweet.time, "minutes") <= interval) {
        searchedFor.push(tweet.coord);
      } else {
        break;
      }
  }

  return searchedFor;
}

function clearTweets() {
  tweets = [];
}

function addToTweets(tweet) {
  if (tweet.coord !== undefined) {
    tweets.push(tweet);
  }
}

module.exports =  {
  getTweets: getTweets,
  clearTweets: clearTweets,
  addToTweets: addToTweets
}
