var appConstants = require("../../modules/core/appConstants");
var values = require("./values");
var makeFbRequest = require("./index").makeFbRequest;
var fbUtils = require("./utils");

var allPromises = require("../../modules/promise/allPromises");

var placesRecentlyUpdated = false;
var places;

//TODO check for pagination
function getEventsInIstanbul(startMoment, endMoment) {
  /*TODO it is not neccessary to get the places again and again
  store places somehere and add new one's if there is any in the response
  or periodically get events*/
  var dates = {
    since: startMoment.format("X"),
    until:  endMoment.format("X")
  };

  return new Promise (function (resolve, reject) {
    var eventsPromise;
    if (placesRecentlyUpdated) {
      handlePlacesData(places, dates, resolve, reject);
    } else {
      getPlacesInIstanbul(function (resp) {
        placesRecentlyUpdated = true;
        places = resp.data;

        handlePlacesData(places, dates, resolve, reject);
      }, function (errorObj) {
        reject(errorObj);
      });
    }
  });
}

function handlePlacesData(places, dates, resolve, reject) {
  var eventsPromises = searchEventsWithPlaceData(places, dates);

  allPromises.combinePromisesTimeout(eventsPromises, function (values) {
    resolve(fbUtils.processValues(values));
  }, function (err) {
    reject({
      type: "Internal",
      message: err
    });
  });
}

function getPlacesInIstanbul (successCallback, errorCallback) {
  var istanbulCenter = appConstants.geo.istanbul.center;

  var path = "/search";

  var queryParams =  {
    type: "place",
    limit: 1000,
    center: istanbulCenter.lat + ","+ istanbulCenter.lng,
    fields: "id",
    access_token: values.fbApp.accessToken
  }

  makeFbRequest(path, queryParams, true, successCallback, errorCallback);
}

function searchEventsWithPlaceData (places, dates) {
  var placeIds = [];
  var idsArray = [];
  var idCount = 0;
  var idLimit = 50;
  var numPlaces = places.length;

  for (var placeIndex = 0; placeIndex < numPlaces; placeIndex++) {
    if (idCount < idLimit) {
      idCount++;
    } else {
      idsArray.push(placeIds);
      placeIds = [];
      idCount = 1;
    }

    placeIds.push(places[placeIndex].id);
  }

  return getSearchForEventsPromises(idsArray, dates);
}

function getSearchForEventsPromises (idsArray, dates) {
  var fields = values.getFieldsForEventSearch().join(",");
  fields += ".since(" + dates.since + ")";
  fields += ".until(" + dates.until + ")";

  var promises = [];
  var numBatches = idsArray.length;
  for (var batchIndex = 0; batchIndex < numBatches; batchIndex++) {
    var currBatch = idsArray[batchIndex];

    promises.push(new Promise( function (resolve, reject) {
      var path = "/";

      var queryParams = {
        ids: currBatch.join(","),
        access_token: values.fbApp.accessToken,
        fields: fields
      }

      makeFbRequest(path, queryParams, true, function (resp) {
        resolve(resp);
      }, function (err) {
        reject(err);
      });
    }));
  }

  return promises;
}

module.exports = {
  getEventsInIstanbul: getEventsInIstanbul
};
