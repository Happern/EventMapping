var appConstants = require("../../modules/core/appConstants");
var values = require("./values");
var makeFbRequest = require("./index").makeFbRequest;
var fbUtils = require("./utils");

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
      eventsPromise = searchEventsWithPlaceData(places, dates);
      eventsPromise.then(function (values) {
        resolve(fbUtils.processValues(values));
      }).catch(function (err) {
        reject(err);
      })
    } else {
      getPlacesInIstanbul(function (resp) {
        placesRecentlyUpdated = true;
        places = resp.data;

        var eventsPromise = searchEventsWithPlaceData(resp.data, dates);

        eventsPromise.then(function (values) {
          resolve(fbUtils.processValues(values));
        }).catch(function (err) {
          reject(err);
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

  return Promise.all(promises);
}

module.exports = {
  getEventsInIstanbul: getEventsInIstanbul
};
