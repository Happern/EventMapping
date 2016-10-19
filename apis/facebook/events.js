var appConstants = require("../../modules/core/appConstants");
var values = require("./values");
var makeFbRequest = require("./index").makeFbRequest;
var fbUtils = require("./utils");
var moment = require("moment");

var placesRecentlyUpdated = false;
var places;

function getEventsInIstanbul(startDate, endDate) {
  /*TODO it is not neccessary to get the places again and again
  store places somehere and add new one's if there is any in the response
  or periodically get events*/
  var dates = {};

  if (startDate) {
    dates.since = moment(startDate, appConstants.date.defaultFormat).format("X");
  }

  if(endDate) {
    dates.until = moment(endDate, appConstants.date.defaultFormat).format("X");
  }

  return new Promise (function (resolve, reject) {
    var eventsPromise;
    if (placesRecentlyUpdated) {
      eventsPromise = searchEventsWithPlaceData(places, dates);
      eventsPromise.then(function (values) {
        resolve(fbUtils.processValues(values));
      })
    } else {
      getPlacesInIstanbul(function (resp) {
        placesRecentlyUpdated = true;
        places = resp.data;
        var eventsPromise = searchEventsWithPlaceData(resp.data, dates);
        eventsPromise.then(function (values) {
          resolve(fbUtils.processValues(values));
        })
      });
    }
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

  return searchForEvents(idsArray, dates);
}

function searchForEvents (idsArray, dates) {
  var fields = values.getFieldsForEventSearch().join(",");

  if (dates.since) {
    fields += ".since(" + dates.since + ")";
  }

  if (dates.until) {
    fields += ".until(" + dates.until + ")";
  }

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
      }, function (resp) {
        console.log("error", resp);
      });
    }));
  }

  return Promise.all(promises);
}

module.exports = {
  getEventsInIstanbul: getEventsInIstanbul
};