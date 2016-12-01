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

//Semantic right sidebar pushes the map a little to the left. Using these coordinates may fix it
var istanbulCoordinatesPushRight = {
    lat: 41.015137,
    lng: 28.779530
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
    var d = new Date();    // defaults to the current time in the current timezone
    if (d.getHours() < 20) {    //styles map 'lightly' when the local time is earlier than 20.00
        map = new google.maps.Map(document.getElementById('map'), {
            center: istanbulCoordinatesPushRight
            , zoom: 10
            , disableDefaultUI: true
            , styles:
            [{"featureType":"all","elementType":"all","stylers":[{"lightness":"29"},{"invert_lightness":true},{"saturation":"-73"},{"hue":"#008fff"}]},{"featureType":"all","elementType":"labels","stylers":[{"saturation":"-72"},{"hue":"#ff0000"}]},{"featureType":"all","elementType":"labels.text","stylers":[{"hue":"#ff0000"},{"visibility":"off"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ff77d1"}]},{"featureType":"administrative","elementType":"all","stylers":[{"lightness":"32"},{"weight":"0.42"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#ff0000"},{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"off"},{"lightness":"-53"},{"saturation":"-66"}]},{"featureType":"landscape","elementType":"all","stylers":[{"lightness":"-86"},{"gamma":"1.13"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"lightness":"4"},{"gamma":"1.44"},{"saturation":"-67"},{"color":"#dcdcdc"}]},{"featureType":"landscape","elementType":"geometry.stroke","stylers":[{"lightness":"5"}]},{"featureType":"landscape","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"saturation":"-4"},{"visibility":"simplified"},{"color":"#dcdcdc"}]},{"featureType":"landscape.natural.landcover","elementType":"geometry","stylers":[{"visibility":"off"},{"color":"#dddddd"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"visibility":"off"},{"hue":"#ff0000"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"weight":"0.84"},{"gamma":"0.5"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"weight":"0.79"},{"gamma":"0.5"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"lightness":"64"},{"gamma":"1"},{"saturation":"5"},{"visibility":"on"},{"color":"#cecccc"}]},{"featureType":"poi.park","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#a9a9a9"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"lightness":"-69"},{"color":"#ff77d1"},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"lightness":"5"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"lightness":"10"},{"gamma":"1"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"lightness":"22"},{"saturation":"-100"}]},{"featureType":"transit","elementType":"all","stylers":[{"lightness":"-35"},{"visibility":"off"}]},{"featureType":"transit","elementType":"labels","stylers":[{"hue":"#ff0000"},{"saturation":"0"},{"weight":"0.01"},{"visibility":"off"}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"saturation":"-97"},{"lightness":"-14"},{"hue":"#ff0000"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#f4f4f4"},{"visibility":"on"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"hue":"#ff0000"}]}]
        });
    } else {
        map = new google.maps.Map(document.getElementById('map'), {
            center: istanbulCoordinatesPushRight
            , zoom: 10
            , disableDefaultUI: true
            , styles:
            [{"featureType":"all","elementType":"all","stylers":[{"lightness":"29"},{"invert_lightness":true},{"saturation":"-73"},{"hue":"#008fff"}]},{"featureType":"all","elementType":"labels","stylers":[{"saturation":"-72"},{"hue":"#ff0000"}]},{"featureType":"all","elementType":"labels.text","stylers":[{"hue":"#ff0000"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ff77d1"}]},{"featureType":"administrative","elementType":"all","stylers":[{"lightness":"32"},{"weight":"0.42"}]},{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"off"},{"lightness":"-53"},{"saturation":"-66"}]},{"featureType":"landscape","elementType":"all","stylers":[{"lightness":"-86"},{"gamma":"1.13"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"lightness":"4"},{"gamma":"1.44"},{"saturation":"-67"},{"color":"#222223"},{"visibility":"on"}]},{"featureType":"landscape","elementType":"geometry.stroke","stylers":[{"lightness":"5"}]},{"featureType":"landscape","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"weight":"0.84"},{"gamma":"0.5"},{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"weight":"0.79"},{"gamma":"0.5"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#282828"}]},{"featureType":"poi.park","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"simplified"},{"lightness":"-78"},{"saturation":"-91"},{"hue":"#ff0000"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"lightness":"-69"},{"color":"#ff77d1"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"lightness":"10"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"lightness":"10"},{"gamma":"1"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"lightness":"10"},{"saturation":"-100"}]},{"featureType":"transit","elementType":"all","stylers":[{"lightness":"-35"},{"visibility":"off"},{"gamma":"0.88"}]},{"featureType":"transit","elementType":"labels","stylers":[{"hue":"#ff0000"},{"saturation":"0"},{"weight":"0.01"},{"visibility":"off"}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"saturation":"-97"},{"lightness":"-14"},{"hue":"#ff0000"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"hue":"#ff0000"}]}]        });
    };

    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
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
                , fillColor: '#000000'
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

              // Set up handle bars for Snazzy Info Window complex-styles
            var template = Handlebars.compile($('#marker-content-template').html());

            // Set up a close closeDelayed for CSS animations
            var infowindow = null;
            var closeDelayed = false;
            var closeDelayHandler = function() {
                $(infowindow.getWrapper()).removeClass('active');
                setTimeout(function() {
                    closeDelayed = true;
                    infowindow.close();
                }, 300);
            };

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
                var infowindow = new SnazzyInfoWindow({
                    marker: marker,
                    wrapperClass: 'custom-window',
                    offset: {
                        top: '-72px'
                    },
                    edgeOffset: {
                        top: 50,
                        right: 60,
                        bottom: 50
                    },
                    border: true,
                    closeButtonMarkup: '<button type="button" class="custom-close">&#215;</button>',
                    content: template({
                        title: data.name,
                        subtitle: 'Location: '+ data.venue_name,
                        bgImg: 'https://images.unsplash.com/42/U7Fc1sy5SCUDIu4tlJY3_NY_by_PhilippHenzler_philmotion.de.jpg?dpr=1&auto=format&fit=crop&w=800&h=350&q=80&cs=tinysrgb&crop=',
                   }),
                    callbacks: {
                        open: function() {
                            $(this.getWrapper()).addClass('open');
                        },
                        afterOpen: function() {
                            var wrapper = $(this.getWrapper());
                            wrapper.addClass('active');
                            wrapper.find('.custom-close').on('click', closeDelayHandler);
                        },
                        beforeClose: function() {
                            if (!closeDelayed) {
                                closeDelayHandler();
                                return false;
                            }
                            return true;
                        },
                        afterClose: function() {
                            var wrapper = $(this.getWrapper());
                            wrapper.find('.custom-close').off();
                            wrapper.removeClass('open');
                            closeDelayed = false;
                        }
                    }
                });

                //adds event listener to the  marker object for 'click event' to open the info window
                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.open();
                });
            }

            markers.push(marker);
        }
    })
    return markers;
}

// called when the webpage is 'ready', all the html elements are initialized(?)
$(document).ready(function () {

    var timezone = "Europe/istanbul";

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
        densityMarkers = initMarkers(data.twitter, getTwitterLocation, twitterImage);
        weatherMarkers = initMarkers(data.weather, getWeatherLocation, weatherImage, true, constructWeatherInfoMessage);

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

    socket.emit("timelineSelected", {
        startDate: "03/12/2016", endDate: "06/12/2016"
        //startDate and endDate should be received from the sliders
    });
    socket.on("timelineSelectedValue", function (data) {
      console.log("data");
        //give the data to the map with a dedicated function, or simple use updateInfo()
        //create google charts timeline here (once the correct marker information is shown on the map)
    });

    // the lines below were there to test some socket functionality.
    // zoom is an example of an event that can be emitted from the browser and
    // handled by the server, more such events can be created
    /*socket.emit("zoom", {coords: "41.147056,28.986053"});

    socket.on("currentWeatherForCoords", function(data) {
      console.log("weather data for coords received", data);
    });*/

    // $.getJSON("http://json-time.appspot.com/time.json?tz="+timezone+"&callback=?",
    // function(data){
    //     if (data.hour < 12) {
    //         initDayMap();
    //     } else {
    //         initNightMap();
    //   }
    // });

    initMap();

    $('.ui.sidebar')
        .sidebar('setting', 'transition', 'overlay')
        .sidebar('toggle')
    ;

    // Initiate the range slider and set min-max in the bottom sidebar 
    $('#my-range-1').range({
        min: 0,
        max: 10,
        start: 5
        // onChange: function(val){
        //     //specify what happens when a value is selected --> update timeli
        // }
    });

    $('#my-range-2').range({
        min: 0,
        max: 10,
        start: 5
        // onChange: function(val){
        //     //specify what happens when a value is selected --> update timeli
        // }
    });

});
