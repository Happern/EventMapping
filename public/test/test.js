// initialize the socket connection with the server
var socket = io.connect('/');
var map;
var densityMarkers = [];
var weatherMarkers = [];
var eventMarkers;

//approximately central coordinates for istanbul, should be verified & updated
var istanbulCoordinates = {
    lat: 41.015137,
    lng: 28.979530
};

//an orange dot to represent tweet coordinates, arbitrary
var twitterImage = {
    url: "/assets/orange-circle-png-3.png",
    scaledSize: new google.maps.Size(7, 7)
};

//a weather icon for weather data coordinates, arbitrary
var weatherImage = {
    url: "/assets/weather-icon-png-2.png",
    scaledSize: new google.maps.Size(12, 12)
};

//initializes map in the div with id 'map'
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

//constructs info message from event data, just for test purposes
function constructEventInfoMessage(data) {
    var infoMessage = "Api: " + data.api + "\nName: " + data.name;
    if (data.venue_name) {
        infoMessage += "\n Location: " + data.venue_name;
    }
    return infoMessage;
}

//similar to above
function constructWeatherInfoMessage(data) {
    return "Feels Like: " + data.apparentTemperature + "C\n" + "Chance of Rain: " + data.precipProbability + "\n" + "Wind Speed: " + data.windSpeed;
}

//extracts weather locations from weather data and creates google location obj
function getWeatherLocation(weather) {
    return new google.maps.LatLng(weather.latitude, weather.longitude);
}

//similar to above, for event data
function getEventLocation(event) {
    if (event.lat && event.lng) {
        return new google.maps.LatLng(event.lat, event.lng);
    }
    else return null;
}

//similar to above, for twitter data
function getTwitterLocation(coords) {
    return new google.maps.LatLng(coords[0], coords[1]);
}

//updates markers on the map by un-assigning the map to old markers and
//calls the function passed as initFunction to initialize new markers
//oldMarkers is an array holding marker objects
//new markers is the data array returned from the server
//initFunction is initMarkers function called with different parameters
// depending on the context.
function updateInfo(newMarkers, oldMarkers, initFunction) {
    oldMarkers.forEach(function (marker) {
        marker.setMap(null);
    });
    oldMarkers = initFunction();
}

//initialized markers on the 'map'
//pinArray is the data array returned from the server
//locationFunction is a function that extracts location from given data and
// returns google's LatLng object for that location. It is a different function
// for each data type.
// pinImage is a config object for pinImage  it is optional
// infoMessageFunction is a function that forms an info message from the given data it is optional
function initMarkers(pinArray, locationFunction, pinImage, addInfo, infoMessageFunction) {
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
                icon: markerIcon,
                position: position
                , map: map
            }

            // if the pinImage parameter is passed, adds that image for the markers
            // constructed with the given data / instead of the default pins.
            // Currently can either be twitterImage or weatherImage
            if (pinImage) {
                markerOptions.icon = pinImage
            }
            var marker = new google.maps.Marker(markerOptions);

            //checks if infoMessageFunction parameter is passed and proceeds,
            // since in the absence of this function it is not possible to
            // create an information message - thus an info window here.
            if (addInfo && infoMessageFunction) {
                //constructs the info message with the given function
                // currently can either be constructEventInfoMessage or
                // constructWeatherInfoMessage
                var infoMessage = infoMessageFunction(data);

                //uses google map's default info window to create infoWindow
                //object with the constructed message
                var infowindow = new google.maps.InfoWindow({
                    content: infoMessage
                });

                //adds event listener to the  marker object for 'click event' to open the info window
                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.open(map, marker);
                });
            }

            markers.push(marker);
        }
    })
    return markers;
}

// called when the webpage is 'ready', all the html elements are initialized(?)
$(document).ready(function () {

    // upon socket connection, the server emits an event called initialConditions.
    // here we listen to that event and initialize the markers with the given data.
    // post requests can be sent and processed instead of this.
    // socket initialization is at the top
    socket.on('initialConditions', function (data) {
        // markers are initialized with the returned data
        // the marker arrays returned from initMarkers fucnction are stored
        // since they are needed to be cleared when updated data arrives.
        // these variables are initialized at the top this file
        eventsMarkers = initMarkers(data.events, getEventLocation, null, true, constructEventInfoMessage);
        densityMarkers = initMarkers(data.twitter, getTwitterLocation, null, true, twitterImage);
        weatherMarkers = initMarkers(data.weather, getWeatherLocation, null, true, weatherImage, constructWeatherInfoMessage);

        // logs some info to console for debugging purposes, can be deleted
        console.log("initial conditions received");
        console.log("num events", data.events.length);
        console.log("num tweets", data.twitter.length);
        console.log("weather info", data.weather);

    });

    // the server emits 'updatedConditions' event in specific intervals while
    // sending updated info about weather and density conditions
    socket.on("updatedConditions", function (data) {

        // updates density info (old markers are cleared and new ones are created)
        updateInfo(data.twitter, densityMarkers, function () {
            return initMarkers(data.twitter, getTwitterLocation, twitterImage);
        });

        // updates weather info (old markers are cleared and new ones are created)
        updateInfo(data.weather, weatherMarkers, function () {
            return initMarkers(data.weather, getWeatherLocation, weatherImage, true, constructWeatherInfoMessage);
        })

        //logs for debugging purposes
        console.log("updated conditions received");
        console.log("density data point #", data.twitter.length);
    });

    // the lines below were there to test some socket functionality.
    // zoom is an example of an event that can be emitted from the browser and
    // handled by the server, more such events can be created
    /*socket.emit("zoom", {coords: "41.147056,28.986053"});

    socket.on("currentWeatherForCoords", function(data) {
      console.log("weather data for coords received", data);
    });*/

    initMap();
})
