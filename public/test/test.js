
var socket = io.connect('/');
var map;

var densityMarkers = [];
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

function getEventLocation (event) {
  if (event.lat && event.lng) {
    return new google.maps.LatLng(event.lat, event.lng);
  } else return null;
}

function getTwitterLocation (coords) {
  return new google.maps.LatLng(coords[0], coords[1]);
}

function updateDensityInfo (newDensities) {
  densityMarkers.forEach(function(marker) {
    marker.setMap(null);
  });

  densityMarkers = initMarkers(newDensities, getTwitterLocation, twitterImage);
}

function initMarkers(pinArray, locationFunction, pinImage, addInfo) {
  //facebookEvents[index].place.location.latitude
  markers = [];

  pinArray.forEach(function (data) {
    var position = locationFunction(data);

    if (position) {
      var markerOptions = {
        position: position,
        map: map
      }

      if (pinImage) {
        markerOptions.icon = pinImage
      }

      var marker = new google.maps.Marker(markerOptions);

      if(addInfo) {
        var infoMessage = "Api: " + data.api + "\nName: " + data.name;
        if (data.venue_name) {
          infoMessage += "\n Location: " + data.venue_name;
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

$(document).ready(function () {
  socket.on('initialConditions', function(data) {
    console.log("initial conditions received");
    console.log("num events", data.events.length);
    eventsMarkers = initMarkers(data.events, getEventLocation, null, true);
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
