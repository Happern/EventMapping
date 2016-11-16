var socket = io.connect('/');
var map;
var densityMarkers = [];
var weatherMarkers = [];
var eventMarkers;
var istanbulCoordinates = {
    lat: 41.015137
    , lng: 28.979530
};
var twitterImage = {
    url: "/assets/orange-circle-png-3.png"
    , scaledSize: new google.maps.Size(7, 7)
};
var weatherImage = {
    url: "/assets/weather-icon-png-2.png"
    , scaledSize: new google.maps.Size(12, 12)
};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: istanbulCoordinates
        , zoom: 10
        , disableDefaultUI: true
        , styles: [{
            "featureType": "administrative"
            , "elementType": "labels"
            , "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "administrative.country"
            , "elementType": "geometry.stroke"
            , "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "administrative.province"
            , "elementType": "geometry.stroke"
            , "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "landscape"
            , "elementType": "geometry"
            , "stylers": [{
                "visibility": "on"
            }, {
                "color": "#e3e3e3"
            }]
        }, {
            "featureType": "landscape.natural"
            , "elementType": "labels"
            , "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "poi"
            , "elementType": "all"
            , "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "road"
            , "elementType": "all"
            , "stylers": [{
                "color": "#cccccc"
            }]
        }, {
            "featureType": "road"
            , "elementType": "geometry"
            , "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "road"
            , "elementType": "labels"
            , "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "road.local"
            , "elementType": "geometry"
            , "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "transit"
            , "elementType": "labels.icon"
            , "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "transit.line"
            , "elementType": "geometry"
            , "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "transit.line"
            , "elementType": "labels.text"
            , "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "transit.station.airport"
            , "elementType": "geometry"
            , "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "transit.station.airport"
            , "elementType": "labels"
            , "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "water"
            , "elementType": "geometry"
            , "stylers": [{
                "color": "#FFFFFF"
            }]
        }, {
            "featureType": "water"
            , "elementType": "labels"
            , "stylers": [{
                "visibility": "off"
            }]
        }]
    });
}

function constructEventInfoMessage(data) {
    var infoMessage = "Api: " + data.api + "\nName: " + data.name;
    if (data.venue_name) {
        infoMessage += "\n Location: " + data.venue_name;
    }
    return infoMessage;
}

function constructWeatherInfoMessage(data) {
    return "Feels Like: " + data.apparentTemperature + "C\n" + "Chance of Rain: " + data.precipProbability + "\n" + "Wind Speed: " + data.windSpeed;
}

function getWeatherLocation(weather) {
    return new google.maps.LatLng(weather.latitude, weather.longitude);
}

function getEventLocation(event) {
    if (event.lat && event.lng) {
        return new google.maps.LatLng(event.lat, event.lng);
    }
    else return null;
}

function getTwitterLocation(coords) {
    return new google.maps.LatLng(coords[0], coords[1]);
}

function updateInfo(newMarkers, oldMarkers, initFunction) {
    oldMarkers.forEach(function (marker) {
        marker.setMap(null);
    });
    oldMarkers = initFunction();
}

function initMarkers(pinArray, locationFunction, pinImage, addInfo, infoMessageFunction) {
    //facebookEvents[index].place.location.latitude
    markers = [];
    pinArray.forEach(function (data) {
        var position = locationFunction(data);
        if (position) {
            var markerIcon = {
                path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'
                , fillColor: '#e25a00'
                , fillOpacity: 0.95
                , scale: 2
                , strokeColor: '#fff'
                , strokeWeight: 3
                , anchor: new google.maps.Point(12, 24)
            };
            var markerOptions = {
                icon: markerIcon
                , position: position
                , map: map
            }
            if (pinImage) {
                markerOptions.icon = pinImage
            }
            var marker = new google.maps.Marker(markerOptions);
            if (addInfo && infoMessageFunction) {
                var infoMessage = infoMessageFunction(data);
                var infowindow = new google.maps.InfoWindow({
                    content: infoMessage
                });
                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.open(map, marker);
                });
            }
            markers.push(marker);
        }
    })
    return markers;
}
$(document).ready(function () {
    socket.on('initialConditions', function (data) {
        console.log("initial conditions received");
        console.log("num events", data.events.length);
        eventsMarkers = initMarkers(data.events, getEventLocation, null, true, constructEventInfoMessage);
        console.log("num tweets", data.twitter.length);
        densityMarkers = initMarkers(data.twitter, getTwitterLocation, twitterImage);
        console.log("weather info", data.weather);
        weatherMarkers = initMarkers(data.weather, getWeatherLocation, weatherImage, true, constructWeatherInfoMessage);
    });
    socket.on("updatedConditions", function (data) {
        console.log("updated conditions received");
        console.log("density data point #", data.twitter.length);
        updateInfo(data.twitter, densityMarkers, function () {
            return initMarkers(data.twitter, getTwitterLocation, twitterImage);
        });
        updateInfo(data.weather, weatherMarkers, function () {
            return initMarkers(data.weather, getWeatherLocation, weatherImage, true, constructWeatherInfoMessage);
        })
    });
    /*socket.emit("zoom", {coords: "41.147056,28.986053"});

    socket.on("currentWeatherForCoords", function(data) {
      console.log("weather data for coords received", data);
    });*/
    initMap();
})