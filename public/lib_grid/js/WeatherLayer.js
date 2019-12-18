WeatherLayer.prototype = new google.maps.OverlayView();

function WeatherLayer(map, bounds, data) 
{
	this.bounds=new google.maps.LatLngBounds(
		new google.maps.LatLng(40.876127, 28.642802),
		new google.maps.LatLng(41.341531, 29.284970));

	this.data=[new Array(), new Array(), new Array(), new Array()];
	
	
	var i;
	var j;
	var m;
	for(m=0; m<4; m++)
	{
		for(i=0; i<10; i++)
		{
			this.data[m][i]=new Array();
			for(j=0; j<10; j++)
			{
				this.data[m][i][j]={div:null, alpha:Math.random()};
			}
		}
	}
	
	this.map=map;
	//this.bounds=bounds;
	this.setMap(map);
	//this.data=data;
}
WeatherLayer.prototype.onAdd=function()
{

	layer0=new MapLayer("mapoverlay0", this.map, this, this.bounds, this.data[0], "mapTile0", 4);
	layer1=new MapLayer("mapoverlay1", this.map, this, this.bounds, this.data[1], "mapTile1", 4);
	layer2=new MapLayer("mapoverlay2", this.map, this, this.bounds, this.data[2], "mapTile2", 4);
	layer3=new MapLayer("mapoverlay3", this.map, this, this.bounds, this.data[3], "mapTile3", 4);
	
	var layers=[layer0, layer1, layer2, layer3];
	
	layer0.init();
	layer1.init();
	layer2.init();
	layer3.init();
	
	this.actualLayer=layers[Math.floor(Math.random()*layers.length)];
}
WeatherLayer.prototype.draw=function()
{
	layer0.draw();
	layer1.draw();
	layer2.draw();
	layer3.draw();
}
WeatherLayer.prototype.hide=function()
{/*
	layer0.hide();
	layer1.hide();
	layer2.hide();
	layer3.hide();*/
	this.actualLayer.hide();
	//this.setMap(null);
}
WeatherLayer.prototype.show=function()
{/*
	layer0.show();
	layer1.show();
	layer2.show();
	layer3.show();*/
	this.actualLayer.show();
	//this.setMap(this.map);
}