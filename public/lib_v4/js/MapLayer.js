function MapLayer(id, map, overlay, bounds, data, tile, tileMultiplier) 
{
	
	this.id = id;
	this.div = null;
	this.map=map;
	
	this.bounds = bounds;
	this.center={lat:(bounds[0].lat+bounds[1].lat)/2, lng:(bounds[0].lng+bounds[1].lng)/2};
	this.data=data;
	this.tile=tile;
	this.tileMultiplier=tileMultiplier;
	this.overlay=overlay;
	
	this.tiles=new Array();
	this.marker;
}
MapLayer.prototype.init=function()
{
	this.div = $("<div></div>");
	this.div.addClass("mapLayer");
	this.div.attr("id", this.id);
	var i;
	var j;
	var overlayDiv;
	for(i=0; i<10; i++)
	{

		this.tiles[i]=new Array();
		for(j=0; j<10; j++)
		{
			overlayDiv=$("<div></div>");
			overlayDiv.addClass("mapTile");
			if(this.data[i][j].alpha>=0.5)
				overlayDiv.addClass(this.tile);
		
			this.div.append(overlayDiv);
			this.tiles[i][j]=overlayDiv;
			

		}
	}

	this.marker =new mapboxgl.Marker(this.div[0])
		.setLngLat(this.center)
		.addTo(this.map);
		
	this.reproject();
}

MapLayer.prototype.reproject=function()
{
	var i;
	var j;
	var p0=this.map.project(this.bounds[0]);
	var p1=this.map.project(this.bounds[1]);
	var stepX=(p1.x-p0.x)/10;
	var stepY=(p1.y-p0.y)/10;
	for(i=0; i<10; i++)
	{
		for(j=0; j<10; j++)
		{
			this.tiles[i][j].css({left:i*stepX-5*stepX, top:j*stepY-5*stepY, width:stepX, height:stepY});
		}
	}
	
	var zoom=this.map.getZoom();

	//if(zoom<8) zoom=8;
	
	//zoom=Math.round(zoom);
	
	var zoomMultiplier=this.tileMultiplier*25/Math.pow(2,zoom-8);
	//console.log(zoomMultiplier);
	$(".mapTile").css("background-size", zoomMultiplier*2+"%");
}

MapLayer.prototype.show=function()
{
	this.div.show();
}

MapLayer.prototype.hide=function()
{
	this.div.hide();
}