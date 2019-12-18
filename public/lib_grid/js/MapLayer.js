function MapLayer(id, map, overlay, bounds, data, tile, tileMultiplier) 
{
	
	this.id = id;
	this.div_ = null;
	this.map_=map;
	
	this.bounds_ = bounds;

	this.data=data;
	this.tile=tile;
	this.tileMultiplier=tileMultiplier;
	this.overlay=overlay;
	
}
MapLayer.prototype.init=function()
{

	var obj=this;
	console.log("init", obj);
	var div = document.createElement('div');
	$(div).addClass("mapLayer");
	$(div).attr("id", this.id);

	obj.div_ = div;

	var i;
	var j;
	for(i=0; i<10; i++)
	{
		for(j=0; j<10; j++)
		{
			var overlayDiv=$(document.createElement('div'));
			overlayDiv.addClass("mapTile");
			overlayDiv.addClass(obj.tile);
			if(obj.data[i][j].alpha>=0.5)
			overlayDiv.css({"opacity":1});
			else
			overlayDiv.css({"opacity":0});
			obj.data[i][j].div=overlayDiv;
			$(div).append(overlayDiv);
		}
	}
	
	// Add the element to the "overlayLayer" pane.
	var panes = obj.overlay.getPanes();
	panes.overlayLayer.appendChild(div);
}


MapLayer.prototype.draw = function() 
{
	//return;
	var obj=this;
	//console.log("draw", obj);
	// We use the south-west and north-east
	// coordinates of the overlay to peg it to the correct position and size.
	// To do this, we need to retrieve the projection from the overlay.
	var overlayProjection = obj.overlay.getProjection();
	
	//console.log(overlayProjection);
	
	// Retrieve the south-west and north-east coordinates of this overlay
	// in LatLngs and convert them to pixel coordinates.
	// We'll use these coordinates to resize the div.
	var sw = overlayProjection.fromLatLngToDivPixel(obj.bounds_.getSouthWest());
	var ne = overlayProjection.fromLatLngToDivPixel(obj.bounds_.getNorthEast());

	// Resize the image's div to fit the indicated dimensions.
	var div = obj.div_;
	div.style.left = sw.x + 'px';
	div.style.top = ne.y + 'px';
	div.style.width = (ne.x - sw.x) + 'px';
	div.style.height = (sw.y - ne.y) + 'px';

	var w=ne.x - sw.x;
	var h=sw.y - ne.y;
	var wStep=w/10;
	var hStep=h/10;

	
	var i;
	var j;
	var tiles=$("."+this.tile);
	for(i=0; i<10; i++)
	{
		for(j=0; j<10; j++)
		{
			$(tiles[i*10+j]).css({
				left:j*wStep,
				top:i*hStep,
				width:wStep,
				height:hStep
			});
		}
	}
	//console.log(wStep,hStep);
	
	var zoom=obj.map_.getZoom();
	if(zoom<8) zoom=8;
	var zoomMultiplier=this.tileMultiplier*50/Math.pow(2,zoom-8);
	//console.log(zoomMultiplier);
	$(".mapTile").css("background-size", zoomMultiplier*2+"%");
}
MapLayer.prototype.show= function() 
{
	$(this.div_).show();
}
MapLayer.prototype.hide= function() 
{
	$(this.div_).hide();
}