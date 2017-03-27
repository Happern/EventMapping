// initialize the socket connection with the server
var socket = io.connect('/');
var map;
var densityMarkers = [];
var weatherMarkers = [];
var eventsMarkers;
var trafficLayer;
var densityLayer;
var initialConditionsReceived = false;
var badAirMarkers;
var preferredEvents; 
var allEvents;
var preferredEventsOverwritingSequence = [];

var capacityStart = 0;
var capacityEnd = 1;
var densityStart = 0;
var densityEnd = 1; 
var soundStart = 0;
var soundEnd = 1;
var activityStart = 0;
var activityEnd = 1;
var priceStart = 0;
var priceEnd = 1;
var language_tr = true;
var language_eng = true;
var event_type = "all";

var allInfoWindows = [];


//approximately central coordinates for istanbul, should be verified & updated
var istanbulCoordinates = {
    lat: 41.015137,
    lng: 28.979530
};

//Semantic right sidebar pushes the map a little to the left. Using these coordinates may fix it
var istanbulCoordinatesPushRight = {
    lat: 41.014093,
    lng: 28.984893

    //41°01'47.4"N 28°56'06
};

var badAirQualityCoordinates = [
    {lat: 40.997040, lng: 29.171562}, //Ümraniye - nova ticaret 
    {lat: 41.062849, lng: 28.992759}, // Cevahir AVM 
    {lat: 41.002408, lng: 28.974237}, // Çatladıkapı 
    {lat: 41.003982, lng: 29.023916}, // Siyami Ersek Hastanesi 
    {lat: 41.090526, lng: 28.985135}, // Kağıthane Merkez 
    {lat: 40.991960, lng: 29.036442}, // Söğütlüçeşme  
    {lat: 41.009925, lng: 29.154930}// Yukarıdudullu 
    ];

//an orange dot to represent tweet coordinates
var twitterImage = {
    url: "/assets/black-circle-png-3.png",
    scaledSize: new google.maps.Size(3, 3)
};

// a black dot to represent event coordinates
var eventImage = {
    url: "/assets/blackcircle_100x100-01.png",
    scaledSize: new google.maps.Size(20,20)
};

//change -- to do 
var eventImage_medium = {
    url: "/assets/black circle_more transparent.png",
    size: new google.maps.Size(42, 68)
}

//a weather icon for weather data coordinates, arbitrary
var weatherImage = {
    url: "/assets/weather-icon-png-2.png",
    scaledSize: new google.maps.Size(50, 50)
};

var weatherImage_rain = {
    url: "/assets/weather_rain.png",
    scaledSize: new google.maps.Size(100, 100),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(50,50)
};

var weatherImage_snow = {
    url: "/assets/weather_snow.png",
    scaledSize: new google.maps.Size(100, 100),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(50,50)
};

var weatherImage_bad_quality = {
    url: "/assets/weather_bad_quality.png",
    scaledSize: new google.maps.Size(100, 100),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(50,50)
};

var weatherImage_very_hot = {
    url: "/assets/weather_very_hot.png",
    scaledSize: new google.maps.Size(100, 100),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(50,50)   
};

var eventImage_o_s = {
    url: "/assets/event_o_s.png",
    scaledSize: new google.maps.Size(25, 25)
}

var eventImage_o_m = {
    url: "/assets/event_o_m.png",
    scaledSize: new google.maps.Size(50, 50)
}

var eventImage_o_b = {
    url: "/assets/event_o_b.png",
    scaledSize: new google.maps.Size(100, 100)
}

var eventImage_y_s = {
    url: "/assets/event_y_s.png",
    scaledSize: new google.maps.Size(25, 25)
}

var eventImage_y_m = {
    url: "/assets/event_y_m.png",
    scaledSize: new google.maps.Size(50, 50)
}

var eventImage_y_b = {
    url: "/assets/event_y_b.png",
    scaledSize: new google.maps.Size(100, 100)
}

var eventImage_g_s = {
    url: "/assets/event_g_s.png",
    scaledSize: new google.maps.Size(25, 25)
}

var eventImage_g_m = {
    url: "/assets/event_g_m.png",
    scaledSize: new google.maps.Size(50, 50)
}

var eventImage_g_b = {
    url: "/assets/event_g_b.png",
    scaledSize: new google.maps.Size(100, 100)
}

var eventImage_b_s = {
    url: "/assets/event_b_s.png",
    scaledSize: new google.maps.Size(25, 25)
}

var eventImage_b_m = {
    url: "/assets/event_b_m.png",
    scaledSize: new google.maps.Size(50, 50)
}

var eventImage_b_b = {
    url: "/assets/event_b_b.png",
    scaledSize: new google.maps.Size(100, 100)
}

//converts Date() to DD/MM/YYYY
function convertDate(inputFormat) {
  function pad(s) {
    return (s < 10) ? '0' + s : s;
}
var d = new Date(inputFormat);
return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
};

//initializes map in the div with id 'map'
function initMap() {
    var d = new Date();    // defaults to the current time in the current timezone
    trafficLayer = new google.maps.TrafficLayer()
    if (d.getHours() < 17) {    //styles map 'lightly' when the local time is earlier than 20.00
        initiateDayMap();
    } else {
        initiateNightMap();
        eventImage.url = "/assets/eventmarker-white-medium.png",
        eventImage.scaledSize = new google.maps.Size(20,20)
    }

    map.addListener('zoom_changed', function() {
        console.log("zoom changed, current level is " + map.getZoom());
        //if zoom 14,15,16 show second circles to depict people density -- initDensityMarkers()
        //means: if the it is a crowded event, the second circle will be about the same size of the capacity-depicting circle
        //... if it is a deserted event, the second circle will be much bigger than the capacity-depicting circle

        //again, if zoom level is bigger than 14, show sound and activity markers -- initSoundMarkers() & initActivityMarkers()
    });
}

// To do: with submitSnazzyCode(), style should be changed and saved. When there's no submission, the default style (the current ones)
// should be applied
function initiateDayMap () {
    map = new google.maps.Map(document.getElementById('map'), {
        center: istanbulCoordinatesPushRight
        , zoom: 12
        , disableDefaultUI: true
        , styles:
        [{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]},{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f7f7f7"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"lightness":21},{"visibility":"off"},{"color":"#e3e3e3"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#cecccc"},{"lightness":21},{"visibility":"off"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"weight":"0.70"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#b2b2b2"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2},{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#b2b2b2"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#cbcbcb"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#9a2323"},{"lightness":19},{"visibility":"off"}]},{"featureType":"transit","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e3e3e3"},{"lightness":17}]}]
    });
}

function initiateNightMap () {
    map = new google.maps.Map(document.getElementById('map'), {
        center: istanbulCoordinatesPushRight
        , zoom: 12
        , disableDefaultUI: true
        , styles:
        [{"featureType":"all","elementType":"all","stylers":[{"lightness":"29"},{"invert_lightness":!0},{"saturation":"-73"},{"hue":"#008fff"}]},{"featureType":"all","elementType":"labels","stylers":[{"saturation":"-72"},{"hue":"#ff0000"}]},{"featureType":"all","elementType":"labels.text","stylers":[{"hue":"#ff0000"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ff77d1"}]},{"featureType":"administrative","elementType":"all","stylers":[{"lightness":"32"},{"weight":"0.42"}]},{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"off"},{"lightness":"-53"},{"saturation":"-66"}]},{"featureType":"landscape","elementType":"all","stylers":[{"lightness":"-86"},{"gamma":"1.13"},{"visibility":"on"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"lightness":"4"},{"gamma":"1.44"},{"saturation":"-67"},{"color":"#333333"},{"visibility":"on"}]},{"featureType":"landscape","elementType":"geometry.stroke","stylers":[{"lightness":"5"}]},{"featureType":"landscape","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"weight":"0.84"},{"gamma":"0.5"},{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"weight":"0.79"},{"gamma":"0.5"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"visibility":"off"},{"color":"#282828"}]},{"featureType":"poi.park","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"simplified"},{"lightness":"30"},{"saturation":"-100"},{"hue":"#1000ff"},{"gamma":"0.71"},{"weight":"0.7"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"lightness":"-69"},{"color":"#ff77d1"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"lightness":"10"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"lightness":"10"},{"gamma":"1"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"lightness":"10"},{"saturation":"-100"},{"weight":"0.70"}]},{"featureType":"transit","elementType":"all","stylers":[{"lightness":"-35"},{"visibility":"off"},{"gamma":"0.88"}]},{"featureType":"transit","elementType":"labels","stylers":[{"hue":"#ff0000"},{"saturation":"0"},{"weight":"0.01"},{"visibility":"off"}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"saturation":"-97"},{"lightness":"-14"},{"hue":"#ff0000"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"hue":"#ff0000"}]}]
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
    console.log("Feels Like: " + data.apparentTemperature + "C\n" + "Chance of Rain: " + data.precipProbability + "\n" + "Wind Speed: " + data.windSpeed) 
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
    return new google.maps.LatLng(coords.lat, coords.lng);
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
    initFunction();
}

//initialized markers on the 'map'
//pinArray is the data array returned from the server
//locationFunction is a function that extracts location from given data and
// returns google's LatLng object for that location. It is a different function
// for each data type.
// pinImage is a config object for pinImage  it is optional
// infoMessageFunction is a function that forms an info message from the given data it is optional
function initMarkers(pinArray, locationFunction, pinImage, addInfo, infoMessageFunction) { //for zoom level 1 and 2
    markers = [];
    pinArray.forEach(function (data) {
        var position = locationFunction(data);
        if (position) {

            //Default icon
            var markerIcon = {
                path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'
                , fillColor: '#000000'
                , fillOpacity: 0.95
                , scale: 2
                , strokeColor: '#fff'
                , strokeWeight: 3
                , anchor: new google.maps.Point(12, 24)
            };

            // if the pinImage parameter is passed, adds that image for the markers
            // constructed with the given data / instead of the default pins.
            // Currently can either be twitterImage or weatherImage

            markerIcon = pinImage

            //Change markerIcon for weather
            if (data.precipProbability > 0.4) {
                markerIcon = weatherImage_rain
                console.log('weather marker initiated with rain')                                
            } 
            if (data.precipProbability > 0.4 && data.apparentTemperature < -3) {
                markerIcon = weatherImage_snow
                console.log('weather marker initiated with snow')                                
            }
            if (data.apparentTemperature >= 40) {
                markerIcon = weatherImage_very_hot
                console.log('weather marker initiated with very hot')
            }

            if (data.event_type == "Meetup" || data.event_type == "Celebration" || data.event_type == "Festival" ||
                data.event_type == "Party" || data.event_type == "Concert" || data.event_type == "Sports event") {
                if (data.capacity <= 0.33) {
                    markerIcon = eventImage_o_s
                } else if (data.capacity <= 0.66) {
                    markerIcon = eventImage_o_m
                } else if (data.capacity <= 1) {
                    markerIcon = eventImage_o_b
                }
            } else if (data.event_type == "Cinema" || data.event_type == "Theater" || data.event_type == "Show" ||
                data.event_type == "Exhibition") {
                if (data.capacity <= 0.33) {
                    markerIcon = eventImage_y_s
                } else if (data.capacity <= 0.66) {
                    markerIcon = eventImage_y_m
                } else if (data.capacity <= 1) {
                    markerIcon = eventImage_y_b
                }
            } else if (data.event_type == "Conference" || data.event_type == "Meeting" || data.event_type == "Talk" ||
                data.event_type == "Workshop") {
                if (data.capacity <= 0.33) {
                    markerIcon = eventImage_g_s
                } else if (data.capacity <= 0.66) {
                    markerIcon = eventImage_g_m
                } else if (data.capacity <= 1) {
                    markerIcon = eventImage_g_b
                }
            } else if (data.capacity <= 0.33) {
                markerIcon = eventImage_b_s
            } else if (data.capacity <= 0.66) {
                markerIcon = eventImage_b_m
            } else if (data.capacity <= 1) {
                markerIcon = eventImage_b_b
            }
            var markerOptions = {
                icon: markerIcon,
                position: position,
                map: map
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
            if (addInfo) {
                //constructs the info message with the given function
                // currently can either be constructEventInfoMessage or
                // constructWeatherInfoMessage
                //var infoMessage = infoMessageFunction(data);

                //uses SnazzyInfoWindow to create infoWindow
                //object with the constructed message
                var infowindow = new SnazzyInfoWindow({
                    title: data.name,
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
                        subtitle: 'Location: '+ data.venue_name + ' //// Time: ' + data.start_time + '///// Capacity: ' 
                        + data.capacity + '///// Density ' + data.people_density,
                        bgImg: 'https://i.imgsafe.org/cc6abaf3bf.jpg',
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

                allInfoWindows.push(infowindow);

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

function onReady(callback) {
    var intervalID = window.setInterval(checkReady, 1000);

    function checkReady() {
        if (initialConditionsReceived == true) {
            callback.call(this);
        } else {
            console.log('initialConditionsReceived == false')
        }
    }
}

function show(id, value) {
    document.getElementById(id).style.display = value ? 'block' : 'none';
}

onReady(function () {
    show('map', true);
    show('overlay', true);
    show('loading', false);
});

function submitSnazzyCode() {
    var newStyle = document.getElementById('snazzyStyleCode').value;
    var isDayMap = document.getElementById('isDayMap').checked;
    console.log('New base map style submitted; day map is ' + isDayMap);
};

function overwritePreferredEvents(newlyFilteredEvents, calledBy) {
    preferredEvents = newlyFilteredEvents;
    preferredEventsOverwritingSequence.push(calledBy);
    console.log("preferred Events is now " + preferredEvents.length + " long");
    return preferredEvents;
};

// function filterMarkers(
//     event_type, 
//     capacityStart, capacityEnd, 
//     densityStart, densityEnd, 
//     soundStart, soundEnd, 
//     activityStart, activityEnd, 
//     priceStart, priceEnd, 
//     language_tr, language_eng) 
// {
//     if (event_type == "Other") {

//     }
// };

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

        preferredEvents = data.events;
        allEvents = data.events;
        eventsMarkers = initMarkers(preferredEvents, getEventLocation, eventImage, true, constructEventInfoMessage);
        
        // for (var i = 0; i < data.events.length; i ++) {
        //     eventsCapacityMarkers[i] = data.events[i].capacity;
        // }

        $('#events_allCB').prop('checked', true);
        $( "#language_tr" ).prop( "checked", true );
        $( "#language_eng" ).prop( "checked", true );

        $( "#entertainment_all" ).prop( "checked", true );        
        $( "#Meetup" ).prop( "checked", true );
        $( "#Celebration" ).prop( "checked", true );        
        $( "#Festival" ).prop( "checked", true );
        $( "#Party" ).prop( "checked", true );
        $( "#Concert" ).prop( "checked", true );
        $( "#Sports_event" ).prop( "checked", true );

        $( "#cultural_all" ).prop( "checked", true );
        $( "#Cinema" ).prop( "checked", true );
        $( "#Theater" ).prop( "checked", true );
        $( "#Show" ).prop( "checked", true );
        $( "#Exhibition" ).prop( "checked", true );

        $( "#educative_all" ).prop( "checked", true );
        $( "#Conference" ).prop( "checked", true );
        $( "#Meeting" ).prop( "checked", true );
        $( "#Talk" ).prop( "checked", true );
        $( "#Workshop" ).prop( "checked", true );

        $( "#other_all" ).prop( "checked", true );
        $( "#Protest" ).prop( "checked", true );
        $( "#Ceremony" ).prop( "checked", true );
        $( "#Other" ).prop( "checked", true );


        $('#events_allCB').bind('change', function(){
            if($(this).is(':checked')){
                eventsMarkers = initMarkers(data.events, getEventLocation, eventImage, true, constructEventInfoMessage);
            }
        })
        ;

        $('#crowdCB').bind('change', function(){
            if($(this).is(':checked')){
                densityMarkers = initMarkers(data.twitter, getTwitterLocation, twitterImage);
            }
        })
        ;

        $('#weather_airCB').bind('change', function(){
            if($(this).is(':checked')){
                weatherMarkers = initMarkers(data.weather, getWeatherLocation, weatherImage, false, constructWeatherInfoMessage);

                badAirMarkers = [];
                for (var i = 0; i < badAirQualityCoordinates.length; i++){

                    var marker = new google.maps.Marker({
                        icon: weatherImage_bad_quality,
                        position: badAirQualityCoordinates[i]                        
                    }); 

                    marker.setMap(map);
                    badAirMarkers.push(marker);
                }
            }
        })
        ;

        // logs some info to console for debugging purposes, can be deleted
        console.log("initial conditions received");
        console.log("num events", data.events.length);
        console.log("num tweets", data.twitter.length);
        console.log("weather info", data.weather);
        initialConditionsReceived = true;
    });

    // the server emits 'updatedConditions' event in specific intervals while
    // sending updated info about weather and density conditions
    socket.on("updatedConditions", function (data) {

        if ($('#crowdCB').is(':checked')){
            for (var i = 0; i < densityMarkers.length; i++) {
                densityMarkers[i].setMap(null);
            }            
            densityMarkers =  initMarkers(data.twitter, getTwitterLocation, twitterImage);
        }

        if (!$('#crowdCB').is(':checked')){
            densityMarkers =  initMarkers(data.twitter, getTwitterLocation, twitterImage);
            for (var i = 0; i < densityMarkers.length; i++) {
                densityMarkers[i].setMap(null);
            }
            // console.log('after update, density markers not shown although there are new ' + data.twitter.length + ' data points')
        }

        $('#crowdCB').bind('change', function(){
            if($(this).is(':checked')){
                densityMarkers = initMarkers(data.twitter, getTwitterLocation, twitterImage);
            }
        })
        ;        

        $('#crowdCB').bind('change', function(){
            if(!$(this).is(':checked')){
                for (var i = 0; i < densityMarkers.length; i++) {
                    densityMarkers[i].setMap(null);
                }
            }
        })
        ;        

        // updates density info (old markers are cleared and new ones are created)
        // updateInfo(data.twitter, densityMarkers, function () {
        //     densityMarkers =  initMarkers(data.twitter, getTwitterLocation, twitterImage);
        // });

        // updates weather info (old markers are cleared and new ones are created)

        if ($('#weather_airCB').is(':checked')){
            updateInfo(data.weather, weatherMarkers, function () {
                weatherMarkers = initMarkers(data.weather, getWeatherLocation, weatherImage, false, constructWeatherInfoMessage);
            });
        }

        if (!$('#weather_airCB').is(':checked')){
            weatherMarkers =  initMarkers(data.weather, getWeatherLocation, weatherImage, false, constructWeatherInfoMessage);
            for (var i = 0; i < weatherMarkers.length; i++) {
                weatherMarkers[i].setMap(null);
            }
            // console.log('after update, density markers not shown although there are new ' + weatherMarkers.length + ' weather points')
        }        

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

    //Initiate 'flat slider' used in time interval selection
    $('#flat-slider').slider({
        orientation: 'horizontal',
        values: [0,1],
        range: true,
        min: 0,
        max: 4,
        step: 1,
        change: function (event, ui) {}
    })
    .each(function() {

        //Gets the options (values, range etc.) for this slider
        var opt = $(this).data().uiSlider.options;

        // Get the number of possible values
        var vals = opt.max - opt.min;

        // Space out values and format dates into M d, yy
        for (var i = 0; i<= vals; i += 1){
            if (i == 0) {
                var label = $('<label-today> Today </label-today>').css('left', (i/vals*100) + '%');
            } else if (i == 1) {
                var label = $('<label> Next week </label>').css('left', (i/vals*100) + '%');
            } else {
                var label = $('<label>' + (i) + ' weeks from now </label>').css('left', (i/vals*100) + '%');
            }
            $("#flat-slider").append(label);
        }

    });

    $('#flat-slider').on("slidechange", function (event, ui) {
        var values = $('#flat-slider').slider("option", "values"); //returns range selected by user
        var startDate = new Date();
        var endDate = new Date();

        switch(values[0]){
            case 0:
            break;
            case 1:
            startDate.setDate(startDate.getDate() + 7);
            break;
            case 2:
            startDate.setDate(startDate.getDate() + 14);
            break;
            case 3:
            startDate.setDate(startDate.getDate() + 21);
            break;
            case 4:
            startDate.setDate(startDate.getDate() + 28);
            break;
        }

        switch(values[1]){
            case 0:
            break;
            case 1:
            endDate.setDate(endDate.getDate() + 7);
            break;
            case 2:
            endDate.setDate(endDate.getDate() + 14);
            break;
            case 3:
            endDate.setDate(endDate.getDate() + 21);
            break;
            case 4:
            endDate.setDate(endDate.getDate() + 28);
            break;
        }

        startDate = convertDate(startDate);
        endDate = convertDate(endDate);

        console.log(values);
        console.log(startDate);
        console.log(endDate);

        socket.emit("timelineSelected", {
            startDate: startDate,
            endDate: endDate        //startDate and endDate should be received from the sliders
        });
    });

    socket.on("timelineSelectedValue", function (response) {
        console.log("timelineSelectedValue " + response.data.length);
        updateInfo(response.data, eventsMarkers, function () {
            eventsMarkers =  initMarkers(response.data, getEventLocation, eventImage, true, constructEventInfoMessage);
        });
    });

    $('#trafficCB').bind('change', function(){
        if($(this).is(':checked')){
            trafficLayer.setMap(map);
        }
        if(!$(this).is(':checked')){
            trafficLayer.setMap(null); 
        }
    })
    ;

    $('#events_allCB').bind('change', function(){
        if(!$(this).is(':checked')){
            for (var i = 0; i < eventsMarkers.length; i++) {
              eventsMarkers[i].setMap(null);
          }
      }
    })
    ;

     $('#entertainment_all').bind('change', function(){
        if(!$(this).is(':checked')){

            $( "#Meetup" ).prop( "checked", false );
            $( "#Celebration" ).prop( "checked", false );        
            $( "#Festival" ).prop( "checked", false );
            $( "#Party" ).prop( "checked", false );
            $( "#Concert" ).prop( "checked", false );
            $( "#Sports_event" ).prop( "checked", false );

            for (var i = 0; i < eventsMarkers.length; i++) {
                if (eventsMarkers[i].icon.url == "/assets/event_o_b.png" || 
                    eventsMarkers[i].icon.url == "/assets/event_o_s.png"||
                    eventsMarkers[i].icon.url == "/assets/event_o_m.png") {
                    eventsMarkers[i].setMap(null);
                }
            }
        }

        if($(this).is(':checked')){

            $( "#Meetup" ).prop( "checked", true );
            $( "#Celebration" ).prop( "checked", true );        
            $( "#Festival" ).prop( "checked", true );
            $( "#Party" ).prop( "checked", true );
            $( "#Concert" ).prop( "checked", true );
            $( "#Sports_event" ).prop( "checked", true );

            for (var i = 0; i < eventsMarkers.length; i++) {
                if (eventsMarkers[i].icon.url == "/assets/event_o_b.png" || 
                    eventsMarkers[i].icon.url == "/assets/event_o_s.png"||
                    eventsMarkers[i].icon.url == "/assets/event_o_m.png") {
                    eventsMarkers[i].setMap(map);
                }
            }
        }        
    })
    ;   

    $('#Meetup').bind('change', function () {
        if(!$(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Meetup") {
                            eventsMarkers[i].setMap(null);
                        }
                    }
                }
            }

        }

        if($(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Meetup") {
                            eventsMarkers[i].setMap(map);
                        }
                    }
                }
            }
        }
    });

    $('#Celebration').bind('change', function () {
        if(!$(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Celebration") {

                            console.log('delete name: ' + preferredEvents[e].name + " and type: " + preferredEvents[e].event_type);

                            eventsMarkers[i].setMap(null);
                        }
                    }
                }
            }

        }

        if($(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Celebration") {
                            eventsMarkers[i].setMap(map);
                        }
                    }
                }
            }
        }
    });


    $('#Festival').bind('change', function () {
        if(!$(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Festival") {

                            console.log('delete name: ' + preferredEvents[e].name + " and type: " + preferredEvents[e].event_type);

                            eventsMarkers[i].setMap(null);
                        }
                    }
                }
            }

        }

        if($(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Festival") {
                            eventsMarkers[i].setMap(map);
                        }
                    }
                }
            }
        }
    });  

    $('#Party').bind('change', function () {
        if(!$(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Party") {

                            console.log('delete name: ' + preferredEvents[e].name + " and type: " + preferredEvents[e].event_type);

                            eventsMarkers[i].setMap(null);
                        }
                    }
                }
            }

        }

        if($(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Party") {
                            eventsMarkers[i].setMap(map);
                        }
                    }
                }
            }
        }
    });

    $('#Concert').bind('change', function () {
        if(!$(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Concert") {

                            console.log('delete name: ' + preferredEvents[e].name + " and type: " + preferredEvents[e].event_type);

                            eventsMarkers[i].setMap(null);
                        }
                    }
                }
            }

        }

        if($(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Concert") {
                            eventsMarkers[i].setMap(map);
                        }
                    }
                }
            }
        }
    }); 

    $('#Sports_event').bind('change', function () {
        if(!$(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Sports_event") {

                            console.log('delete name: ' + preferredEvents[e].name + " and type: " + preferredEvents[e].event_type);

                            eventsMarkers[i].setMap(null);
                        }
                    }
                }
            }

        }

        if($(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Sports_event") {
                            eventsMarkers[i].setMap(map);
                        }
                    }
                }
            }
        }
    });    

    $('#Cinema').bind('change', function () {
        if(!$(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Cinema") {

                            console.log('delete name: ' + preferredEvents[e].name + " and type: " + preferredEvents[e].event_type);

                            eventsMarkers[i].setMap(null);
                        }
                    }
                }
            }

        }

        if($(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Cinema") {
                            eventsMarkers[i].setMap(map);
                        }
                    }
                }
            }
        }
    }); 

    $('#Theater').bind('change', function () {
        if(!$(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Theater") {

                            console.log('delete name: ' + preferredEvents[e].name + " and type: " + preferredEvents[e].event_type);

                            eventsMarkers[i].setMap(null);
                        }
                    }
                }
            }
        }

        if($(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Theater") {
                            eventsMarkers[i].setMap(map);
                        }
                    }
                }
            }
        }
    }); 

    $('#Show').bind('change', function () {
        if(!$(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Show") {

                            console.log('delete name: ' + preferredEvents[e].name + " and type: " + preferredEvents[e].event_type);

                            eventsMarkers[i].setMap(null);
                        }
                    }
                }
            }
        }

        if($(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Show") {
                            eventsMarkers[i].setMap(map);
                        }
                    }
                }
            }
        }
    });

    $('#Exhibition').bind('change', function () {
        if(!$(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Exhibition") {

                            console.log('delete name: ' + preferredEvents[e].name + " and type: " + preferredEvents[e].event_type);

                            eventsMarkers[i].setMap(null);
                        }
                    }
                }
            }
        }

        if($(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Exhibition") {
                            eventsMarkers[i].setMap(map);
                        }
                    }
                }
            }
        }
    });

    $('#Conference').bind('change', function () {
        if(!$(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Conference") {

                            console.log('delete name: ' + preferredEvents[e].name + " and type: " + preferredEvents[e].event_type);

                            eventsMarkers[i].setMap(null);
                        }
                    }
                }
            }
        }

        if($(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Conference") {
                            eventsMarkers[i].setMap(map);
                        }
                    }
                }
            }
        }
    });

    $('#Meeting').bind('change', function () {
        if(!$(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Meeting") {

                            console.log('delete name: ' + preferredEvents[e].name + " and type: " + preferredEvents[e].event_type);

                            eventsMarkers[i].setMap(null);
                        }
                    }
                }
            }
        }

        if($(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Meeting") {
                            eventsMarkers[i].setMap(map);
                        }
                    }
                }
            }
        }
    });

    $('#Talk').bind('change', function () {
        if(!$(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Talk") {

                            console.log('delete name: ' + preferredEvents[e].name + " and type: " + preferredEvents[e].event_type);

                            eventsMarkers[i].setMap(null);
                        }
                    }
                }
            }
        }

        if($(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Talk") {
                            eventsMarkers[i].setMap(map);
                        }
                    }
                }
            }
        }
    });

    $('#Workshop').bind('change', function () {
        if(!$(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Workshop") {

                            console.log('delete name: ' + preferredEvents[e].name + " and type: " + preferredEvents[e].event_type);

                            eventsMarkers[i].setMap(null);
                        }
                    }
                }
            }
        }

        if($(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Workshop") {
                            eventsMarkers[i].setMap(map);
                        }
                    }
                }
            }
        }
    });

    $('#Protest').bind('change', function () {
        if(!$(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Protest") {

                            console.log('delete name: ' + preferredEvents[e].name + " and type: " + preferredEvents[e].event_type);

                            eventsMarkers[i].setMap(null);
                        }
                    }
                }
            }
        }

        if($(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Protest") {
                            eventsMarkers[i].setMap(map);
                        }
                    }
                }
            }
        }
    });

    $('#Ceremony').bind('change', function () {
        if(!$(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Ceremony") {

                            console.log('delete name: ' + preferredEvents[e].name + " and type: " + preferredEvents[e].event_type);

                            eventsMarkers[i].setMap(null);
                        }
                    }
                }
            }
        }

        if($(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Ceremony") {
                            eventsMarkers[i].setMap(map);
                        }
                    }
                }
            }
        }
    });

    $('#Other').bind('change', function () {
        if(!$(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Other") {

                            console.log('delete name: ' + preferredEvents[e].name + " and type: " + preferredEvents[e].event_type);

                            eventsMarkers[i].setMap(null);
                        }
                    }
                }
            }
        }

        if($(this).is(':checked')) {
            for (var e = 0; e < preferredEvents.length; e ++) {
                for (var i = 0; i < allInfoWindows.length; i++) {
                    if (preferredEvents[e].name == allInfoWindows[i]._opts.title) {
                        if (preferredEvents[e].event_type == "Other") {
                            eventsMarkers[i].setMap(map);
                        }
                    }
                }
            }
        }
    });


     $('#cultural_all').bind('change', function(){
        if(!$(this).is(':checked')){

            $( "#Cinema" ).prop( "checked", false );
            $( "#Theater" ).prop( "checked", false );
            $( "#Show" ).prop( "checked", false );
            $( "#Exhibition" ).prop( "checked", false );

            for (var i = 0; i < eventsMarkers.length; i++) {
                if (eventsMarkers[i].icon.url == "/assets/event_y_b.png" || 
                    eventsMarkers[i].icon.url == "/assets/event_y_s.png"||
                    eventsMarkers[i].icon.url == "/assets/event_y_m.png") {
                    eventsMarkers[i].setMap(null);
                }
            }
        }

        if($(this).is(':checked')){

            $( "#Cinema" ).prop( "checked", true );
            $( "#Theater" ).prop( "checked", true );
            $( "#Show" ).prop( "checked", true );
            $( "#Exhibition" ).prop( "checked", true );

            for (var i = 0; i < eventsMarkers.length; i++) {
                if (eventsMarkers[i].icon.url == "/assets/event_y_b.png" || 
                    eventsMarkers[i].icon.url == "/assets/event_y_s.png"||
                    eventsMarkers[i].icon.url == "/assets/event_y_m.png") {
                    eventsMarkers[i].setMap(map);
                }
            }
        }        
    })
    ;     

    $('#educative_all').bind('change', function(){
        if(!$(this).is(':checked')){

            $( "#Conference" ).prop( "checked", false );
            $( "#Meeting" ).prop( "checked", false );
            $( "#Talk" ).prop( "checked", false );
            $( "#Workshop" ).prop( "checked", false );  

            for (var i = 0; i < eventsMarkers.length; i++) {
                if (eventsMarkers[i].icon.url == "/assets/event_g_b.png" || 
                    eventsMarkers[i].icon.url == "/assets/event_g_s.png"||
                    eventsMarkers[i].icon.url == "/assets/event_g_m.png") {
                    eventsMarkers[i].setMap(null);
                }
            }
        }

        if($(this).is(':checked')){

            $( "#Conference" ).prop( "checked", true );
            $( "#Meeting" ).prop( "checked", true );
            $( "#Talk" ).prop( "checked", true );
            $( "#Workshop" ).prop( "checked", true );            

            for (var i = 0; i < eventsMarkers.length; i++) {
                if (eventsMarkers[i].icon.url == "/assets/event_g_b.png" || 
                    eventsMarkers[i].icon.url == "/assets/event_g_s.png"||
                    eventsMarkers[i].icon.url == "/assets/event_g_m.png") {
                    eventsMarkers[i].setMap(map);
                }
            }
        }        
    })
    ; 

    $('#other_all').bind('change', function(){
        if(!$(this).is(':checked')){

            $( "#Protest" ).prop( "checked", false );
            $( "#Ceremony" ).prop( "checked", false );
            $( "#Other" ).prop( "checked", false );   

            for (var i = 0; i < eventsMarkers.length; i++) {
                if (eventsMarkers[i].icon.url != "/assets/event_o_b.png" && 
                    eventsMarkers[i].icon.url != "/assets/event_o_s.png" &&
                    eventsMarkers[i].icon.url != "/assets/event_o_s.png" &&
                    eventsMarkers[i].icon.url != "/assets/event_y_b.png" && 
                    eventsMarkers[i].icon.url != "/assets/event_y_s.png" &&
                    eventsMarkers[i].icon.url != "/assets/event_y_s.png" &&
                    eventsMarkers[i].icon.url != "/assets/event_g_b.png" && 
                    eventsMarkers[i].icon.url != "/assets/event_g_s.png" &&
                    eventsMarkers[i].icon.url != "/assets/event_g_s.png") {
                    eventsMarkers[i].setMap(null);
                }
            }
        }

        if($(this).is(':checked')){    

            $( "#Protest" ).prop( "checked", true );
            $( "#Ceremony" ).prop( "checked", true );
            $( "#Other" ).prop( "checked", true );                   

            for (var i = 0; i < eventsMarkers.length; i++) {
                if (eventsMarkers[i].icon.url != "/assets/event_o_b.png" && 
                    eventsMarkers[i].icon.url != "/assets/event_o_s.png" &&
                    eventsMarkers[i].icon.url != "/assets/event_o_s.png" &&
                    eventsMarkers[i].icon.url != "/assets/event_y_b.png" && 
                    eventsMarkers[i].icon.url != "/assets/event_y_s.png" &&
                    eventsMarkers[i].icon.url != "/assets/event_y_s.png" &&
                    eventsMarkers[i].icon.url != "/assets/event_g_b.png" && 
                    eventsMarkers[i].icon.url != "/assets/event_g_s.png" &&
                    eventsMarkers[i].icon.url != "/assets/event_g_s.png") {
                    eventsMarkers[i].setMap(map);
                }
            }
        }        
    })
    ; 

    $('#crowdCB').bind('change', function(){
        if(!$(this).is(':checked')){
            for (var i = 0; i < densityMarkers.length; i++) {
                densityMarkers[i].setMap(null);
            }
        }
    })
    ;

    $('#weather_airCB').bind('change', function(){
        if(!$(this).is(':checked')){
            for (var i = 0; i < weatherMarkers.length; i++) {
                weatherMarkers[i].setMap(null);
            }

            for (var i = 0; i < badAirMarkers.length; i++) {
                badAirMarkers[i].setMap(null);
            }
        }
    })
    ;

    $('.button').button() 
    .popup({
        on: 'click',
        position: 'right center'
    })
    ;

    $('.ui.accordion')
    .accordion({
        heightStyle: "content"
    })
    ;   

    $('.accordion')
    .accordion({
        heightStyle: "content",
        collapsible: true,
        active: false,
        autoHeight:true,
        animate: 400
    })
    ; 

    $('.ui-button.ui-widget.ui-corner-all').click(function(){
        var redirectWindow = window.open('http://happern.ku.edu.tr/projects-2/eventmap/', '_blank');
        redirectWindow.location;
    })
    ;

    $( "#slider-capacity" ).slider({
      range: true,
      min: 0,
      max: 1,
      step: 0.01,
      values: [ 0, 1 ],
      change: function (event, ui) {}
    });

    $('#slider-capacity').on("slidechange", function (event, ui){
        var capacityStart;
        var capacityEnd; 
        var values = $('#slider-capacity').slider("option", "values");
        var filteredEvents = [];
        var arrayCount = 0; 

        currentEvents = preferredEvents;

        for (var i = 0; i < preferredEventsOverwritingSequence.length; i ++) {
            if (preferredEventsOverwritingSequence[i] == "capacity") {
                arrayCount ++;
            }
        } 

        if (arrayCount == preferredEventsOverwritingSequence.length) {
            currentEvents = allEvents;
            console.log("preferredEventsOverwritingSequence is all capacity");
        }

        capacityStart = values [0];
        capacityEnd = values [1];

        filteredEvents = currentEvents.filter(isBigger).filter(isSmaller);

        function isBigger(value) {
            return capacityStart <= value.capacity;
        }

        function isSmaller(value) {
            return value.capacity <= capacityEnd;
        }

        // console.log ("new filteredEvents created with " + filteredEvents.length + " elements"); 

        updateInfo(filteredEvents, eventsMarkers, function () {
            eventsMarkers =  initMarkers(filteredEvents, getEventLocation, eventImage, true, constructEventInfoMessage);
        }); 
        overwritePreferredEvents(filteredEvents, "capacity");
    });

    $("#slider-density").slider({
      range: true,
      min: 0,
      max: 1,
      step: 0.01,
      values: [ 0, 1 ],
      change: function (event, ui) {}
    });

    $("#slider-density").on("slidechange", function (event, ui) {
        var densityStart;
        var densityEnd;
        var values = $("#slider-density").slider("option", "values");
        var filteredEvents = [];
        var arrayCount = 0;

        currentEvents = preferredEvents;

        for (var i = 0; i < preferredEventsOverwritingSequence.length; i ++) {
            if (preferredEventsOverwritingSequence[i] == "density") {
                arrayCount ++;
            }
        } 

        if (arrayCount == preferredEventsOverwritingSequence.length) {
            currentEvents = allEvents;
            console.log("preferredEventsOverwritingSequence is all density");
        } 

        densityStart = values[0];
        densityEnd = values[1];


        filteredEvents = currentEvents.filter(isBigger).filter(isSmaller);

        function isBigger(value) {
            return densityStart <= value.people_density;
        }

        function isSmaller(value){
            return value.people_density <= densityEnd; 
        }

        // console.log ("new filteredEvents created with " + filteredEvents.length + " elements");

        updateInfo(filteredEvents, eventsMarkers, function () {
            eventsMarkers = initMarkers(filteredEvents, getEventLocation, eventImage, true, constructEventInfoMessage);
        });
        overwritePreferredEvents(filteredEvents, "density");
    });

    $( "#slider-sound" ).slider({
      range: true,
      min: 0,
      max: 1,
      step: 0.01,
      values: [ 0, 1 ],
      change: function (event, ui) {}
    });

    $("#slider-sound").on("slidechange", function (event, ui) {
        var soundStart;
        var soundEnd;
        var values = $("#slider-sound").slider("option", "values");
        var filteredEvents = [];
        var arrayCount = 0; 

        currentEvents = preferredEvents;

        for (var i = 0; i < preferredEventsOverwritingSequence.length; i ++) {
            if (preferredEventsOverwritingSequence[i] == "sound") {
                arrayCount ++;
            }
        } 

        if (arrayCount == preferredEventsOverwritingSequence.length) {
            currentEvents = allEvents;
            console.log("preferredEventsOverwritingSequence is all sound");
        }

        soundStart = values [0];
        soundEnd = values [1];

        filteredEvents = currentEvents.filter(isBigger).filter(isSmaller);

        function isBigger(value) {
            return soundStart <= value.sound;
        }

        function isSmaller(value) {
            return value.sound <= soundEnd;
        }

        // console.log ("new filteredEvents created with " + filteredEvents.length + " elements"); 

        updateInfo(filteredEvents, eventsMarkers, function () {
            eventsMarkers =  initMarkers(filteredEvents, getEventLocation, eventImage, true, constructEventInfoMessage);
        }); 
        overwritePreferredEvents(filteredEvents, "sound");
    });

    $( "#slider-activity" ).slider({
      range: true,
      min: 0,
      max: 1,
      step: 0.01,
      values: [ 0, 1 ],
      change: function (event, ui) {}
    });

    $("#slider-activity").on("slidechange", function (event, ui) {
        var activityStart;
        var activityEnd;
        var values = $("#slider-activity").slider("option", "values");

        var filteredEvents = [];
        var arrayCount = 0; 

        currentEvents = preferredEvents;

        for (var i = 0; i < preferredEventsOverwritingSequence.length; i ++) {
            if (preferredEventsOverwritingSequence[i] == "activity") {
                arrayCount ++;
            }
        } 

        if (arrayCount == preferredEventsOverwritingSequence.length) {
            currentEvents = allEvents;
            console.log("preferredEventsOverwritingSequence is all activity");
        }

        activityStart = values [0];
        activityEnd = values [1];

        filteredEvents = currentEvents.filter(isBigger).filter(isSmaller);

        function isBigger(value) {
            return activityStart <= value.activity;
        }

        function isSmaller(value) {
            return value.activity <= activityEnd;
        }

        // console.log ("new filteredEvents created with " + filteredEvents.length + " elements"); 

        updateInfo(filteredEvents, eventsMarkers, function () {
            eventsMarkers =  initMarkers(filteredEvents, getEventLocation, eventImage, true, constructEventInfoMessage);
        }); 
        overwritePreferredEvents(filteredEvents, "activity");        
    });    

    $( "#slider-price" ).slider({
        range: true,
      min: 0,
      max: 1,
      step: 0.3,
      values: [ 0, 1 ],
      change: function (event, ui) {}
    });

    $("#slider-price").on("slidechange", function (event, ui) {
        var priceStart;
        var priceEnd;
        var values = $("#slider-price").slider("option", "values");

        var filteredEvents = [];
        var arrayCount = 0; 

        currentEvents = preferredEvents;

        for (var i = 0; i < preferredEventsOverwritingSequence.length; i ++) {
            if (preferredEventsOverwritingSequence[i] == "price") {
                arrayCount ++;
            }
        }   

        if (arrayCount == preferredEventsOverwritingSequence.length) {
            currentEvents = allEvents;
            console.log("preferredEventsOverwritingSequence is all price");
        }

        priceStart = values [0];
        priceEnd = values [1];

        filteredEvents = currentEvents.filter(isBigger).filter(isSmaller);

        function isBigger(value) {
            return priceStart <= value.price;
        }

        function isSmaller(value) {
            return value.price <= priceEnd;
        }

        // console.log ("new filteredEvents created with " + filteredEvents.length + " elements"); 

        updateInfo(filteredEvents, eventsMarkers, function () {
            eventsMarkers =  initMarkers(filteredEvents, getEventLocation, eventImage, true, constructEventInfoMessage);
        }); 
        overwritePreferredEvents(filteredEvents, "price");
    });

    $( "#language_tr").checkboxradio({
        icon: false
    });

    $( "#language_eng").checkboxradio({
        icon: false
    });

    $("#overlay #title_events").tooltip({
      items: "div",
      position: { my: "left+15 center", at: "right center" },
      content: function() {
       var element = $(this);
       if (element.attr('id') === 'title_events') {
           return "<img width = '150' height = '100' src='/assets/event_lejand.png'>";
       }
   }
});

    $("#overlay #title_crowd").tooltip({
      items: "div",
      position: { my: "left+15 center", at: "right center" },
      content: function() {
       var element = $(this);
       if (element.attr('id') === 'title_crowd') {
           return "<img width = '150' height = '100' src='/assets/crowd_lejand.png'>";
       }
   }
});

    $("#overlay #title_weather_air").tooltip({
      items: "div",
      position: { my: "left+15 center", at: "right center" },
      content: function() {
       var element = $(this);
       if (element.attr('id') === 'title_weather_air') {
           return "<img width = '170' height = '170' src='/assets/weather_air_lejand.png'>";
       }
   }
});    

});
