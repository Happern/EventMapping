var appConstants = require("../../modules/core/appConstants");
var values = require("./values");
var makeFbRequest = require("./index").makeFbRequest;
var fbUtils = require("./utils");

var placesRecentlyUpdated = false;
var places;

function getEventsInIstanbul(startDate, endDate) {
  //TODO it is not neccessary to get the places again and again
  //store places somehere and add new one's if there is any in the response
  //or periodically get events
  var eventsPromise;
  if (placesRecentlyUpdated) {
    eventsPromise = searchEventsWithPlaceData(places);
    eventsPromise.then(function (values) {
      console.log(fbUtils.processValues(values).length);
    })
  } else {
    getPlacesInIstanbul(function (resp) {
      placesRecentlyUpdated = true;
      places = resp.data;
      var eventsPromise = searchEventsWithPlaceData(resp.data);
      eventsPromise.then(function (values) {
        console.log(fbUtils.processValues(values).length);
      })
    });
  }
}

function getPlacesInIstanbul (successCallback, errorCallback) {
  urlParams = "type=place&limit=1000&center=" + appConstants.geo.istanbulLat + ","
  + appConstants.geo.istanbulLng + "&fields=id" +
   "&access_token=" + values.fbApp.accessToken;

  makeFbRequest("/search?" + urlParams, true, successCallback, errorCallback);
}

function searchEventsWithPlaceData (places) {
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

  return searchForEvents(idsArray, []);
}

function searchForEvents (idsArray, events) {
    var fields = values.getFieldsForEventSearch();

    var promises = [];
    var numBatches = idsArray.length;
    for (var batchIndex = 0; batchIndex < numBatches; batchIndex++) {
      var currBatch = idsArray[batchIndex];

      promises.push(new Promise( function (resolve, reject) {
        urlParams = "/?ids=" + currBatch.join(",") + "&access_token=" +
        values.fbApp.accessToken + "&fields=" + fields.join(",");

        makeFbRequest(urlParams, true, function (resp) {
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
