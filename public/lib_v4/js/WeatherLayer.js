function WeatherLayer(map) 
{
	this.visible=false;
	this.map=map;
	this.bounds=[{lat:41.341531, lng:28.642806}, {lat:40.876127, lng:29.284970}];
	this.actualLayer=null;
	
	this.data=[new Array(), new Array(), new Array(), new Array()];
	this.layer0=null;
	this.layer1=null;
	this.layer2=null;
	this.layer3=null;
	
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
}
WeatherLayer.prototype.init=function()
{
	this.layer0=new MapLayer("mapoverlay0", this.map, this, this.bounds, this.data[0], "mapTile0", 4);
	this.layer1=new MapLayer("mapoverlay1", this.map, this, this.bounds, this.data[1], "mapTile1", 4);
	this.layer2=new MapLayer("mapoverlay2", this.map, this, this.bounds, this.data[2], "mapTile2", 4);
	this.layer3=new MapLayer("mapoverlay3", this.map, this, this.bounds, this.data[3], "mapTile3", 4);

	var layers=[this.layer0, this.layer1, this.layer2, this.layer3]
	this.actualLayer=layers[Math.floor(Math.random()*layers.length)];
	this.actualLayer.init();
	this.actualLayer.hide();
}

WeatherLayer.prototype.resize=function()
{
	if(this.visible)
	{
		this.actualLayer.reproject();
		this.actualLayer.show();
	}
}
WeatherLayer.prototype.show=function()
{
	this.visible=true;
	this.actualLayer.show();
}
WeatherLayer.prototype.hide=function()
{
	this.visible=false;
	this.actualLayer.hide();
}
WeatherLayer.prototype.zoomStart=function()
{
	if(this.visible)
		this.actualLayer.hide();
}