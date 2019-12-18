var _GLOBAL=
{
	map:null,
	mapOptions:{
        center: new google.maps.LatLng(41.015137, 28.979530)
        , zoom: 12
        , disableDefaultUI: true
        , styles:
       [{"featureType": "all","elementType": "labels","stylers": [{"visibility": "off"}]},{"featureType": "administrative","elementType": "geometry","stylers": [{"visibility": "off"}]},{"featureType": "administrative.country","elementType": "geometry","stylers": [{"visibility": "off"}]},{"featureType": "administrative.province","elementType": "geometry","stylers": [{"visibility": "off"}]},{"featureType": "administrative.province","elementType": "labels","stylers": [{"visibility": "off"}]},{"featureType": "administrative.locality","elementType": "geometry","stylers": [{"visibility": "off"}]},{"featureType": "administrative.locality","elementType": "labels","stylers": [{"visibility": "on"}]},{"featureType": "administrative.locality","elementType": "labels.text.fill","stylers": [{"color": "#a3a3a3"}]},{"featureType": "administrative.neighborhood","elementType": "geometry","stylers": [{"visibility": "off"}]},{"featureType": "administrative.neighborhood","elementType": "labels","stylers": [{"visibility": "off"}]},{"featureType": "administrative.land_parcel","elementType": "geometry","stylers": [{"visibility": "off"}]},{"featureType": "landscape","elementType": "all","stylers": [{"visibility": "on"}]},{"featureType": "landscape","elementType": "geometry","stylers": [{"visibility": "off"},{"hue": "#ff0000"}]},{"featureType": "landscape","elementType": "labels","stylers": [{"visibility": "off"}]},{"featureType": "landscape.man_made","elementType": "geometry","stylers": [{"visibility": "off"},{"color": "#944242"}]},{"featureType": "landscape.man_made","elementType": "geometry.fill","stylers": [{"color": "#ffffff"}]},{"featureType": "landscape.natural","elementType": "geometry","stylers": [{"visibility": "on"},{"color": "#ffffff"}]},{"featureType": "landscape.natural.landcover","elementType": "geometry","stylers": [{"visibility": "off"}]},{"featureType": "landscape.natural.terrain","elementType": "geometry","stylers": [{"visibility": "off"},{"saturation": "-1"}]},{"featureType": "poi","elementType": "all","stylers": [{"visibility": "off"}]},{"featureType": "poi","elementType": "geometry","stylers": [{"visibility": "off"}]},{"featureType": "poi.attraction","elementType": "geometry","stylers": [{"visibility": "off"}]},{"featureType": "road","elementType": "geometry.stroke","stylers": [{"visibility": "off"}]},{"featureType": "road.highway","elementType": "geometry.fill","stylers": [{"color": "#292929"},{"visibility": "off"}]},{"featureType": "road.highway","elementType": "geometry.stroke","stylers": [{"visibility": "off"},{"color": "#494949"},{"saturation": "-85"}]},{"featureType": "road.arterial","elementType": "geometry.fill","stylers": [{"color": "#888888"},{"visibility": "off"}]},{"featureType": "road.local","elementType": "geometry","stylers": [{"visibility": "off"}]},{"featureType": "road.local","elementType": "geometry.fill","stylers": [{"color": "#7f7f7f"},{"visibility": "off"}]},{"featureType": "transit","elementType": "all","stylers": [{"visibility": "off"}]},{"featureType": "transit","elementType": "geometry","stylers": [{"visibility": "off"}]},{"featureType": "transit.line","elementType": "geometry","stylers": [{"visibility": "off"}]},{"featureType": "transit.station","elementType": "geometry","stylers": [{"visibility": "off"}]},{"featureType": "transit.station.airport","elementType": "geometry","stylers": [{"visibility": "off"}]},{"featureType": "transit.station.bus","elementType": "geometry","stylers": [{"visibility": "off"}]},{"featureType": "transit.station.rail","elementType": "geometry","stylers": [{"visibility": "off"}]},{"featureType": "water","elementType": "geometry","stylers": [{"color": "#c8fffa"}]},{"featureType": "water","elementType": "geometry.fill","stylers": [{"color": "#d2d2d7"}]},{"featureType": "water","elementType": "geometry.stroke","stylers": [{"visibility": "off"}]}
]
    },
	trafficLayer:null,
	dw:0,
	dh:0,
	socket:null,	
	socketURL:'/',
	crowd:null,
	weather:null,
	funcMap:{
		"traffic":toggleTraffic,
		"crowd":toggleCrowd,
		"weather":toggleWeather,
		"event":toggleEvent,
		}
};
	
$(window).load(init);

function init()
{
	initiateDayMap();
}
function initiateDayMap () {
    _GLOBAL.map = new google.maps.Map(document.getElementById('map'), _GLOBAL.mapOptions);
	_GLOBAL.trafficLayer = new google.maps.TrafficLayer();
	
	google.maps.event.addListenerOnce(_GLOBAL.map, 'idle', ready);
	
	$(window).resize(windowResize);
	windowResize();
}
function windowResize()
{
	var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
	_GLOBAL.dw=x;
	_GLOBAL.dh=y;
	$("#map").height(y);
}
function ready()
{
	var bounds=new google.maps.LatLngBounds(
		new google.maps.LatLng(40.876127, 28.642802),
		new google.maps.LatLng(41.341531, 29.284970));

	
	
	var data=[new Array(), new Array(), new Array(), new Array()];
	
	
	var i;
	var j;
	var m;
	for(m=0; m<4; m++)
	{
		for(i=0; i<10; i++)
		{
			data[m][i]=new Array();
			for(j=0; j<10; j++)
			{
				data[m][i][j]={div:null, alpha:Math.random()};
			}
		}
	}
	
	_GLOBAL.socket=io.connect(_GLOBAL.socketURL);
	
	_GLOBAL.socket.on('initialConditions', gotInitData);
	//_GLOBAL.socket.on('updatedConditions', gotUpdateData);
	
	

}
function gotInitData(data)
{
	console.log("gotInitData", data);
	
	_GLOBAL.crowd=new CrowdLayer(_GLOBAL.map);
	_GLOBAL.crowd.init(data.twitter);	
	_GLOBAL.weather=new WeatherLayer(_GLOBAL.map);
	_GLOBAL.weather.init();
	_GLOBAL.event=new EventLayer(_GLOBAL.map);
	_GLOBAL.event.init();
	_GLOBAL.event.setData(data.events);
	/*
	overlay=new MapOverlay(map, bounds, data);
	roads=new RoadLayer(map);
	roads.init();
*/
	$(".map-zoom .zoom-in").click(function(){_GLOBAL.map.setZoom(_GLOBAL.map.getZoom()+1);});
	$(".map-zoom .zoom-out").click(function(){_GLOBAL.map.setZoom(_GLOBAL.map.getZoom()-1);});
}

function gotUpdateData(data)
{
	console.log("gotUpdateData", data);
}
function toggleTraffic(value)
{
	if(value)
		_GLOBAL.trafficLayer.setMap(_GLOBAL.map);
	else
		_GLOBAL.trafficLayer.setMap(null);
}
function toggleCrowd(value)
{
	if(value)
		_GLOBAL.crowd.show();
	else
		_GLOBAL.crowd.hide();
}
function toggleWeather(value)
{
	if(value)
		_GLOBAL.weather.show();
	else
		_GLOBAL.weather.hide();
}
function toggleEvent(value)
{
	if(value)
		_GLOBAL.event.show();
	else
		_GLOBAL.event.hide();
}

function convertDate(inputFormat) 
{
	var d = new Date(inputFormat);
	return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
};
function pad(s) 
{
    return (s < 10) ? '0' + s : s;
}

