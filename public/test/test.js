
var socket = io.connect('/');
var map;

var densityMarkers;
var eventMarkers;

var istanbulCoordinates = {
  lat: 41.015137,
  lng: 28.979530
};

var twitterImage = {
    url: "/assets/orange-circle-png-3.png",
    scaledSize: new google.maps.Size(7, 7)
  };

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: istanbulCoordinates,
    zoom: 10
  });
}

function getLatLngObj (lat, lng) {
  return new google.maps.LatLng(lat, lng);
}

function initMarkers(events, locationFunction, pinImage, addInfo) {
  //facebookEvents[index].place.location.latitude
  markers = [];

  events.forEach(function (data) {
    var eventLocation = locationFunction(data);

    if (eventLocation) {
      var markerOptions = {
        position: getLatLngObj(eventLocation.latitude, eventLocation.longitude),
        map: map
      }

      if (pinImage) {
        markerOptions.icon = pinImage
      }

      var marker = new google.maps.Marker(markerOptions);

      if(addInfo) {
        var infoMessage = "Name: " + data.name;
        if (data.place.name) {
          infoMessage += "\n Location: " + data.place.name;
        }
        var infowindow = new google.maps.InfoWindow({
          content: infoMessage
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map, marker);
        });
      }

      markers.push(marker);
    }
  })

  return markers;
}

function getFbLocation (event) {
  if (event.place && event.place.location) {
    return event.place.location;
  } else return null;
}

function updateDensityInfo (newDensities) {
  densityMarkers.forEach(function(marker) {
    marker.setMap(null);
  });

  densityMarkers = initMarkers(newDensities, getTwitterLocation, twitterImage);
}

function getTwitterLocation (coords) {
  return {
    latitude: coords[0],
    longitude: coords[1]
  };
}

$(document).ready(function () {
  socket.on('initialConditions', function(data) {
    console.log("initial conditions received");
    console.log("num events", data.fb.length);
    eventsMarkers = initMarkers(data.fb, getFbLocation, null, true);
    console.log("num tweets", data.twitter.length);
    densityMarkers = initMarkers(data.twitter, getTwitterLocation, twitterImage);
  });

  socket.on("updatedConditions", function (data) {
    console.log("updated conditions received");
    console.log(data.twitter.length);
    updateDensityInfo(data.twitter);
  });

  /*socket.emit("zoom", {coords: "41.147056,28.986053"});

  socket.on("currentWeatherForCoords", function(data) {
    console.log("weather data for coords received", data);
  });*/

  initMap();
})
