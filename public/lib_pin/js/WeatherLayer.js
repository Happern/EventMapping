function WeatherLayer(map) 
{
	this.map=map;
	
	this.list=new Array();
}
WeatherLayer.prototype.init=function()
{
	var i;
	var lat=41;
	var lng=29;
	var obj;
	var options;
	
	
	for(i=0; i<30; i++)
	{
		obj=new Object();
		obj.lat=lat+0.04*(i%6)-0.04+Math.random()*0.02-0.01;
		obj.lng=lng+0.12*Math.floor(i/6)-0.254+Math.random()*0.02-0.01;
		obj.icon=(Math.random()>0.7)?"/lib_pin/img/pin_weather_sun.svg":"/lib_pin/img/pin_weather_rain.svg";
		options={
			position:new google.maps.LatLng(obj.lat,obj.lng),
			icon:obj.icon,
			};
		obj.marker=new google.maps.Marker(options);
		this.list.push(obj);
	}
}
WeatherLayer.prototype.show=function()
{
	var i;
	for(i=0; i<this.list.length; i++)
	{
		this.list[i].marker.setMap(this.map);
	}
}
WeatherLayer.prototype.hide=function()
{
	var i;
	for(i=0; i<this.list.length; i++)
	{
		this.list[i].marker.setMap(null);
	}
}