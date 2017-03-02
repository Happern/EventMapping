// initialize the socket connection with the server
var socket = io.connect('/');
var map;
var densityMarkers = [];
var weatherMarkers = [];
var eventMarkers;
var trafficLayer;
var densityLayer;
var initialConditionsReceived = false;

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

//an orange dot to represent tweet coordinates
var twitterImage = {
    url: "/assets/orange-circle-png-3.png",
    scaledSize: new google.maps.Size(7, 7)
};

//a black dot to represent event coordinates
var eventImage = {
    url: "/assets/blackcircle_100x100-01.png",
    scaledSize: new google.maps.Size(20,20)
};

//a weather icon for weather data coordinates, arbitrary
var weatherImage = {
    url: "/assets/weather-icon-png-2.png",
    scaledSize: new google.maps.Size(12, 12)
};

var weatherImage_rain = {
    url: "/assets/weather_rain.png",
    scaledSize: new google.maps.Size(20,20)
};

var weatherImage_snow = {
    url: "/assets/weather_snow.png",
    scaledSize: new google.maps.Size(20,20)
};

var weatherImage_bad_quality = {
    url: "/assets/weather_bad_quality.png",
    scaledSize: new google.maps.Size(20,20)
};

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
    trafficLayer = new google.maps.TrafficLayer();

    if (d.getHours() < 20) {    //styles map 'lightly' when the local time is earlier than 20.00
        map = new google.maps.Map(document.getElementById('map'), {
            center: istanbulCoordinatesPushRight
            , zoom: 12
            , disableDefaultUI: true
            , styles:
            [{"featureType":"all","elementType":"all","stylers":[{"lightness":"29"},{"invert_lightness":true},{"saturation":"-73"},{"hue":"#008fff"}]},{"featureType":"all","elementType":"labels","stylers":[{"saturation":"-72"},{"hue":"#ff0000"}]},{"featureType":"all","elementType":"labels.text","stylers":[{"hue":"#ff0000"},{"visibility":"off"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ff77d1"}]},{"featureType":"administrative","elementType":"all","stylers":[{"lightness":"32"},{"weight":"0.42"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#ff0000"},{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"off"},{"lightness":"-53"},{"saturation":"-66"}]},{"featureType":"landscape","elementType":"all","stylers":[{"lightness":"-86"},{"gamma":"1.13"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"lightness":"4"},{"gamma":"1.44"},{"saturation":"-67"},{"color":"#dcdcdc"}]},{"featureType":"landscape","elementType":"geometry.stroke","stylers":[{"lightness":"5"}]},{"featureType":"landscape","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"saturation":"-4"},{"visibility":"simplified"},{"color":"#dcdcdc"}]},{"featureType":"landscape.natural.landcover","elementType":"geometry","stylers":[{"visibility":"off"},{"color":"#dddddd"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"visibility":"off"},{"hue":"#ff0000"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"weight":"0.84"},{"gamma":"0.5"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"weight":"0.79"},{"gamma":"0.5"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"lightness":"64"},{"gamma":"1"},{"saturation":"5"},{"visibility":"on"},{"color":"#cecccc"}]},{"featureType":"poi.park","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#a9a9a9"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"lightness":"-69"},{"color":"#ff77d1"},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"lightness":"5"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"lightness":"10"},{"gamma":"1"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"lightness":"22"},{"saturation":"-100"}]},{"featureType":"transit","elementType":"all","stylers":[{"lightness":"-35"},{"visibility":"off"}]},{"featureType":"transit","elementType":"labels","stylers":[{"hue":"#ff0000"},{"saturation":"0"},{"weight":"0.01"},{"visibility":"off"}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"saturation":"-97"},{"lightness":"-14"},{"hue":"#ff0000"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#f4f4f4"},{"visibility":"on"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"hue":"#ff0000"}]}]
        });
} else {
    map = new google.maps.Map(document.getElementById('map'), {
        center: istanbulCoordinatesPushRight
        , zoom: 12
        , disableDefaultUI: true
        , styles:
        [{"featureType":"all","elementType":"all","stylers":[{"lightness":"29"},{"invert_lightness":true},{"saturation":"-73"},{"hue":"#008fff"}]},{"featureType":"all","elementType":"labels","stylers":[{"saturation":"-72"},{"hue":"#ff0000"}]},{"featureType":"all","elementType":"labels.text","stylers":[{"hue":"#ff0000"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ff77d1"}]},{"featureType":"administrative","elementType":"all","stylers":[{"lightness":"32"},{"weight":"0.42"}]},{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"off"},{"lightness":"-53"},{"saturation":"-66"}]},{"featureType":"landscape","elementType":"all","stylers":[{"lightness":"-86"},{"gamma":"1.13"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"lightness":"4"},{"gamma":"1.44"},{"saturation":"-67"},{"color":"#222223"},{"visibility":"on"}]},{"featureType":"landscape","elementType":"geometry.stroke","stylers":[{"lightness":"5"}]},{"featureType":"landscape","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"weight":"0.84"},{"gamma":"0.5"},{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"weight":"0.79"},{"gamma":"0.5"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#282828"}]},{"featureType":"poi.park","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"simplified"},{"lightness":"-78"},{"saturation":"-91"},{"hue":"#ff0000"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"lightness":"-69"},{"color":"#ff77d1"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"lightness":"10"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"lightness":"10"},{"gamma":"1"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"lightness":"10"},{"saturation":"-100"}]},{"featureType":"transit","elementType":"all","stylers":[{"lightness":"-35"},{"visibility":"off"},{"gamma":"0.88"}]},{"featureType":"transit","elementType":"labels","stylers":[{"hue":"#ff0000"},{"saturation":"0"},{"weight":"0.01"},{"visibility":"off"}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"saturation":"-97"},{"lightness":"-14"},{"hue":"#ff0000"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"hue":"#ff0000"}]}]        });
};
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
                icon: markerIcon
                , position: position
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
                        subtitle: 'Location: '+ data.venue_name + 'Time: ' + data.start_time,
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

        $('#events_allCB').bind('change', function(){
            if($(this).is(':checked')){
                console.log('events_allCB is checked')
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

        weatherMarkers = initMarkers(data.weather, getWeatherLocation, weatherImage, true, constructWeatherInfoMessage);

        // logs some info to console for debugging purposes, can be deleted
        initialConditionsReceived = true;
        console.log("initial conditions received");
        console.log("num events", data.events.length);
        console.log("num tweets", data.twitter.length);
        console.log("weather info", data.weather);

       $('.pusher').dimmer('hide');
       $('.overlay').dimmer('hide');

    });

    // the server emits 'updatedConditions' event in specific intervals while
    // sending updated info about weather and density conditions
    // TO DO - initMarkers only if the corresponding checkboxes are in checked state
    socket.on("updatedConditions", function (data) {

        if ($('#crowdCB').is(':checked')){
            densityMarkers =  initMarkers(data.twitter, getTwitterLocation, twitterImage);
        }

        // updates density info (old markers are cleared and new ones are created)
        // updateInfo(data.twitter, densityMarkers, function () {
        //     densityMarkers =  initMarkers(data.twitter, getTwitterLocation, twitterImage);
        // });

        // updates weather info (old markers are cleared and new ones are created)
        updateInfo(data.weather, weatherMarkers, function () {
            weatherMarkers = initMarkers(data.weather, getWeatherLocation, weatherImage, true, constructWeatherInfoMessage);
        });

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

            // This section puts the actual date (and next 4 weeks' dates) onto the slider. Currently not necessary.
            // var iDate = new Date();
            // iDate.setDate(iDate.getDate() + i);

            // var sDate = iDate.toDateString();
            // var label = $('<label><small>' + (sDate) + '</small></label>').css('left', (i/vals*100) + '%');

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
        console.log("timelineSelectedValue" + response.data);
        updateInfo(response.data, eventsMarkers, function () {
            eventsMarkers =  initMarkers(response.data, getEventLocation, null, true, constructEventInfoMessage);
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

    $('#crowdCB').bind('change', function(){
        if(!$(this).is(':checked')){
            for (var i = 0; i < densityMarkers.length; i++) {
                densityMarkers[i].setMap(null);
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
        collapsible: false,
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

});
